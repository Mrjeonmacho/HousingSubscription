// Front/src/pages/NoticesPage.tsx
import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { getNoticeList } from "../api/NoticeApi";

import NoticeHeroCarousel from "../components/notices/NoticeHeroCarousel";
import BookmarkedNoticeSection from "../components/notices/FavoritesNoticeSection";
import NoticeFilterBar from "../components/notices/NoticeFilterBar";
import NoticeListSection from "../components/notices/NoticeListSection";
import Pagination from "../components/notices/Pagination";

type NoticeCategory =
  | "YOUTH_RESIDENCE"
  | "HAPPY_HOUSE"
  | "NATIONAL_RENTAL"
  | "PUBLIC_RENTAL"
  | "LONG_TERM_RENTAL"
  | "SALE_HOUSE"
  | string;

type NoticeStatus =
  | "RECEIVING"
  | "DEADLINE_APPROACHING"
  | "COMPLETED"
  | "TO_BE_ANNOUNCED"
  | string;

export type Notice = {
  id: number;
  noticeNo: string | null;
  title: string;
  category: NoticeCategory | null;
  regDate: string | null;
  status: NoticeStatus | null;
  startDate: string | null;
  endDate: string | null;
  pdfUrl: string | null;
  url: string | null;
};

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

type SortKey = "LATEST" | "DEADLINE" | "POPULAR";

type Filters = {
  keyword: string;
  category: string; // "ALL" | NoticeCategory
  status: string; // "ALL" | NoticeStatus
  sort: SortKey;
};

const DEFAULT_FILTERS: Filters = {
  keyword: "",
  category: "ALL",
  status: "ALL",
  sort: "LATEST",
};

function toMs(dateStr: string | null) {
  if (!dateStr) return 0;
  const t = new Date(dateStr).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export default function NoticesPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [favorites, setFavorites] = useState<Notice[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // 목록 로딩
  useEffect(() => {
    let ignore = false;

    (async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const list = await getNoticeList();
        if (ignore) return;

        setNotices(list ?? []);
        setFavorites([]); // 임시
      } catch (err) {
        if (ignore) return;

        const ax = err as AxiosError<ApiErrorResponse>;
        const msg =
          ax.response?.data?.message ||
          ax.message ||
          "목록을 불러오지 못했습니다.";

        setErrorMessage(msg);
        setNotices([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  // 필터 변경 시 1페이지로
  useEffect(() => {
    setPage(1);
  }, [filters.keyword, filters.category, filters.status, filters.sort]);

  // 1) FE 필터링
  const filtered = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return (notices ?? []).filter((n) => {
      const matchKeyword =
        keyword.length === 0 || (n.title ?? "").toLowerCase().includes(keyword);

      const matchCategory =
        filters.category === "ALL" || n.category === filters.category;

      const matchStatus = filters.status === "ALL" || n.status === filters.status;

      return matchKeyword && matchCategory && matchStatus;
    });
  }, [notices, filters.keyword, filters.category, filters.status]);

  // 2) FE 정렬 (filters.sort 반영)
  const sorted = useMemo(() => {
    const copied = [...filtered];

    if (filters.sort === "LATEST") {
      copied.sort((a, b) => toMs(b.regDate) - toMs(a.regDate));
      return copied;
    }

    if (filters.sort === "DEADLINE") {
      copied.sort((a, b) => toMs(a.endDate) - toMs(b.endDate));
      return copied;
    }

    // POPULAR: 백엔드 인기 지표 없으니 일단 최신순으로 fallback
    copied.sort((a, b) => toMs(b.regDate) - toMs(a.regDate));
    return copied;
  }, [filtered, filters.sort]);

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  // Hero: 접수중(RECEIVING) 우선 + 최대 3개
  const featured = useMemo(() => {
    const list = [...(notices ?? [])].sort((a, b) => {
      const aRec = a.status === "RECEIVING" ? 0 : 1;
      const bRec = b.status === "RECEIVING" ? 0 : 1;
      return aRec - bRec;
    });
    return list.slice(0, 3);
  }, [notices]);

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-8 space-y-10">
      <NoticeHeroCarousel items={featured} />

      <BookmarkedNoticeSection items={favorites} />

      <NoticeFilterBar value={filters} onChange={setFilters} />

      <NoticeListSection
        totalCount={totalCount}
        items={paged}
        loading={loading}
        errorMessage={errorMessage}
      />

      <Pagination page={page} totalPages={totalPages} onChangePage={setPage} />
    </div>
  );
}
