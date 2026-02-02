// Front/src/pages/NoticesPage.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AxiosError } from "axios";
import {
  getFavoriteNotices,
  getNoticeList,
  type FavoriteNotice,
} from "../api/NoticeApi";

import NoticeHeroCarousel from "../components/notices/hero/NoticeHeroCarousel";
import FavoritesNoticeSection from "../components/notices/favorites/FavoritesNoticeSection";
import Pagination from "../components/notices/Pagination";
import NoticeListLayout, { type SortType } from "../components/notices/list/NoticeListLayout";

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
  category: string[];
  status: string[];
  sort: SortKey;
};

const DEFAULT_FILTERS: Filters = {
  keyword: "",
  category: [],
  status: [],
  sort: "LATEST",
};

function toMs(dateStr: string | null) {
  if (!dateStr) return 0;
  const t = new Date(dateStr).getTime();
  return Number.isNaN(t) ? 0 : t;
}

type NoticePresetState = {
  preselectedCategories?: string[];
};

export default function NoticesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 이동 시 전달된 preset을 "처음 렌더에서" 읽기
  const presetCategories = useMemo(() => {
    const state = location.state as NoticePresetState | null;
    const preset = state?.preselectedCategories;
    if (!Array.isArray(preset) || preset.length === 0) return null;
    return Array.from(new Set(preset));
  }, [location.state]);

  // ✅ 필터 초기값에 preset 반영 (처음부터 체크된 상태)
  const [filters, setFilters] = useState<Filters>(() => {
    if (!presetCategories) return DEFAULT_FILTERS;
    return {
      ...DEFAULT_FILTERS,
      category: presetCategories,
      keyword: "", // 원하시면 유지로 바꿔드릴게요
      status: [],  // 원하시면 유지로 바꿔드릴게요
    };
  });

  // ✅ 처음부터 펼친 상태로 시작
  const [defaultExpandFilters] = useState<boolean>(() => !!presetCategories);

  // ✅ state 재적용 방지용으로 한 번만 지움
  useEffect(() => {
    if (!presetCategories) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [presetCategories, navigate, location.pathname]);

  // ✅ 정렬 상태는 Header(sortType) 기준으로만 사용
  const [sortType, setSortType] = useState<SortType>("REG_DATE");

  const [notices, setNotices] = useState<Notice[]>([]);
  const [favorites, setFavorites] = useState<Notice[]>([]);
  const [favoritesVersion, setFavoritesVersion] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const mapFavoriteToNotice = (f: FavoriteNotice): Notice => ({
    id: f.id,
    noticeNo: f.no ?? null,
    title: f.title ?? "",
    category: f.category ?? null,
    regDate: f.reg_date ?? null,
    status: f.status ?? null,
    startDate: f.start_date ?? null,
    endDate: f.end_date ?? null,
    pdfUrl: f.pdf ?? null,
    url: f.url ?? null,
  });

  const loadFavorites = useCallback(async (ignore?: boolean): Promise<void> => {
    try {
      const favList = await getFavoriteNotices();
      if (ignore) return;

      setFavorites((favList ?? []).map(mapFavoriteToNotice));
      setFavoritesVersion((v) => v + 1);
    } catch {
      if (ignore) return;

      setFavorites([]);
      setFavoritesVersion((v) => v + 1);
    }
  }, []);

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
        await loadFavorites(ignore);
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
  }, [loadFavorites]);

  const categoryKey = useMemo(() => JSON.stringify(filters.category), [filters.category]);
  const statusKey = useMemo(() => JSON.stringify(filters.status), [filters.status]);

  // 필터/정렬 변경 시 1페이지로
  useEffect(() => {
    setPage(1);
  }, [filters.keyword, categoryKey, statusKey, sortType]);

  // 1) FE 필터링
  const filtered = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return (notices ?? []).filter((n) => {
      const matchKeyword =
        keyword.length === 0 ||
        (n.title ?? "").toLowerCase().includes(keyword);

      const matchCategory =
        filters.category.length === 0 ||
        (n.category != null && filters.category.includes(n.category));

      const matchStatus =
        filters.status.length === 0 ||
        (n.status != null && filters.status.includes(n.status));

      return matchKeyword && matchCategory && matchStatus;
    });
  }, [notices, filters.keyword, filters.category, filters.status]);

  // 2) FE 정렬: sortType 기준(헤더 드롭다운)
  const sorted = useMemo(() => {
    const copied = [...filtered];

    if (sortType === "REG_DATE") {
      copied.sort((a, b) => toMs(b.regDate) - toMs(a.regDate));
      return copied;
    }

    copied.sort((a, b) => toMs(a.endDate) - toMs(b.endDate));
    return copied;
  }, [filtered, sortType]);

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const featured = useMemo(() => {
    const list = [...(notices ?? [])].sort((a, b) => {
      const aRec = a.status === "RECEIVING" ? 0 : 1;
      const bRec = b.status === "RECEIVING" ? 0 : 1;
      return aRec - bRec;
    });
    return list.slice(0, 3);
  }, [notices]);

  return (
    <div className="mx-auto md:py-8 space-y-10">
      <NoticeHeroCarousel items={featured} />

      <FavoritesNoticeSection items={favorites} onChangedFavorites={loadFavorites} />

      <NoticeListLayout
        totalCount={totalCount}
        items={paged}
        loading={loading}
        errorMessage={errorMessage}
        filters={filters}
        onChangeFilters={setFilters}
        sortType={sortType}
        onChangeSortType={setSortType}
        onChangedFavorites={loadFavorites}
        favoritesVersion={favoritesVersion}
        defaultExpandFilters={defaultExpandFilters}
      />

      <Pagination page={page} totalPages={totalPages} onChangePage={setPage} />
    </div>
  );
}
