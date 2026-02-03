// Front/src/pages/NoticesPage.tsx
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
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

function calcDaysLeft(endDate: string | null) {
  if (!endDate) return null;

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return null;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffMs = startOfEnd.getTime() - startOfToday.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 오늘 0, 내일 1 ...
}

function isStarted(startDate: string | null) {
  if (!startDate) return true;
  const s = new Date(startDate);
  if (Number.isNaN(s.getTime())) return true;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfStart = new Date(s.getFullYear(), s.getMonth(), s.getDate());
  return startOfStart.getTime() <= startOfToday.getTime();
}


type NoticePresetState = {
  preselectedCategories?: string[];
  scrollToList?: boolean;
};

export default function NoticesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // 스크롤 앵커 + 1회 실행 가드
  const listTopRef = useRef<HTMLDivElement | null>(null);
  const didScrollRef = useRef(false);

  // 이동 시 전달된 preset을 "처음 렌더에서" 읽기
  const presetCategories = useMemo(() => {
    const state = location.state as NoticePresetState | null;
    const preset = state?.preselectedCategories;
    if (!Array.isArray(preset) || preset.length === 0) return null;
    return Array.from(new Set(preset));
  }, [location.state]);

  // scroll 플래그도 같이 읽기
  const shouldScrollToList = useMemo(() => {
    const state = location.state as NoticePresetState | null;
    return !!state?.scrollToList;
  }, [location.state]);

  // 필터 초기값에 preset 반영 (처음부터 체크된 상태)
  const [filters, setFilters] = useState<Filters>(() => {
    if (!presetCategories) return DEFAULT_FILTERS;
    return {
      ...DEFAULT_FILTERS,
      category: presetCategories,
      keyword: "",
      status: [],
    };
  });

  // 처음부터 펼친 상태로 시작
  const [defaultExpandFilters] = useState<boolean>(() => !!presetCategories);

  // state 지우는 로직은 유지하되, "필요한 처리(스크롤) 이후"에 실행되게끔 effect 분리/순서 보장
  useEffect(() => {
    if (!presetCategories && !shouldScrollToList) return;
    // replace로 state 제거 (뒤로가기/새로고침 시 재적용 방지)
    navigate(location.pathname, { replace: true, state: null });
  }, [presetCategories, shouldScrollToList, navigate, location.pathname]);

  // 자동 스크롤: 최초 1회만
  useEffect(() => {
    if (!shouldScrollToList) return;
    if (didScrollRef.current) return;

    // 렌더가 한 번 돈 뒤 스크롤되도록 rAF 사용
    requestAnimationFrame(() => {
      const el = listTopRef.current;
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "start" });
      didScrollRef.current = true;
    });
  }, [shouldScrollToList]);

  // 정렬 상태는 Header(sortType) 기준으로만 사용
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

    // 마감 임박순
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    copied.sort((a, b) => {
      const aEnd = toMs(a.endDate);
      const bEnd = toMs(b.endDate);

      const aClosed = aEnd < startOfToday;
      const bClosed = bEnd < startOfToday;

      // 1️. 마감 여부 우선 (마감 안 된 것 먼저)
      if (aClosed !== bClosed) {
        return aClosed ? 1 : -1;
      }

      // 2️. 둘 다 마감 안 됐으면 → 마감 빠른 순
      if (!aClosed && !bClosed) {
        return aEnd - bEnd;
      }

      // 3️. 둘 다 마감됐으면 → 최신 마감일 순(선택)
      return bEnd - aEnd;
    });

    return copied;
  }, [filtered, sortType]);

  const totalCount = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  const featured = useMemo(() => {
    const base = notices ?? [];

    return [...base]
      .map((n) => ({
        n,
        daysLeft: calcDaysLeft(n.endDate),
      }))
      // 마감 안 지난 것만 (D-1 이하는 제외)
      .filter((x) => x.daysLeft !== null && x.daysLeft >= 0 && isStarted(x.n.startDate))
      // D-day 작은 순 (임박 우선)
      .sort((a, b) => (a.daysLeft! - b.daysLeft!))
      .slice(0, 5)
      .map((x) => x.n);
  }, [notices]);

  return (
    <div className="mx-auto md:py-8 space-y-10">
      <NoticeHeroCarousel items={featured} />

      <FavoritesNoticeSection items={favorites} onChangedFavorites={loadFavorites} />

      <div ref={listTopRef} />

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
