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
import NoticeListLayout, {
  type SortType,
} from "../components/notices/list/NoticeListLayout";

import {
  computeNoticeStatus,
  type ComputedNoticeStatus,
} from "../utils/noticeStatus";

type NoticeCategory =
  | "YOUTH_RESIDENCE"
  | "HAPPY_HOUSE"
  | "NATIONAL_RENTAL"
  | "PUBLIC_RENTAL"
  | "LONG_TERM_RENTAL"
  | "SALE_HOUSE"
  | string;

export type Notice = {
  id: number;
  noticeNo: string | null;
  title: string;
  category: NoticeCategory | null;
  regDate: string | null;
  status: string | null;
  summary: string | null;
  startDate: string | null;
  endDate: string | null;
  pdfUrl: string | null;
  originUrl: string | null;
};

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

type SortKey = "LATEST" | "DEADLINE" | "POPULAR";

type Filters = {
  keyword: string;
  category: string[];
  status: ComputedNoticeStatus[];
  sort: SortKey;
};

const DEFAULT_FILTERS: Filters = {
  keyword: "",
  category: [],
  status: [],
  sort: "LATEST",
};

// 주택유형 필터에서 제외할 카테고리
const EXCLUDED_CATEGORIES = new Set<string>(["SALE_HOUSE"]);

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
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffMs = startOfEnd.getTime() - startOfToday.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
type NoticePresetState = {
  preselectedCategories?: string[];
  scrollToList?: boolean;
};

export default function NoticesPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const listTopRef = useRef<HTMLDivElement | null>(null);
  const didScrollRef = useRef(false);

  // preset 카테고리 정리(중복 제거 + SALE_HOUSE 제거)
  const presetCategories = useMemo(() => {
    const state = location.state as NoticePresetState | null;
    const preset = state?.preselectedCategories;
    if (!Array.isArray(preset) || preset.length === 0) return null;

    const cleaned = Array.from(new Set(preset)).filter(
      (c) => !EXCLUDED_CATEGORIES.has(c)
    );
    return cleaned.length > 0 ? cleaned : null;
  }, [location.state]);

  const shouldScrollToList = useMemo(() => {
    const state = location.state as NoticePresetState | null;
    return !!state?.scrollToList;
  }, [location.state]);

  // 필터 초기값도 동일하게 정리
  const [filters, setFilters] = useState<Filters>(() => {
    if (!presetCategories) return DEFAULT_FILTERS;
    return {
      ...DEFAULT_FILTERS,
      category: presetCategories,
      keyword: "",
      status: [],
    };
  });

  const [defaultExpandFilters] = useState<boolean>(() => !!presetCategories);

  useEffect(() => {
    if (!presetCategories && !shouldScrollToList) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [presetCategories, shouldScrollToList, navigate, location.pathname]);

  useEffect(() => {
    if (!shouldScrollToList) return;
    if (didScrollRef.current) return;

    requestAnimationFrame(() => {
      const el = listTopRef.current;
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "start" });
      didScrollRef.current = true;
    });
  }, [shouldScrollToList]);

  const [sortType, setSortType] = useState<SortType>("REG_DATE");

  const [notices, setNotices] = useState<Notice[]>([]);
  const [favorites, setFavorites] = useState<Notice[]>([]);
  const [favoritesVersion, setFavoritesVersion] = useState(0);
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // [수정] 즐겨찾기 매핑에서 noticeNo / status 주입 제거 (항상 null)
  const mapFavoriteToNotice = (f: FavoriteNotice): Notice => ({
    id: f.id,
    noticeNo: null,
    title: f.title ?? "",
    category: f.category ?? null,
    regDate: f.reg_date ?? null,
    status: null,
    summary: f.summary ?? null,
    startDate: f.start_date ?? null,
    endDate: f.end_date ?? null,
    pdfUrl: f.pdfUrl ?? null,
    originUrl: f.originUrl ?? null,
  });

  const loadFavorites = useCallback(
    async (ignore?: boolean): Promise<void> => {
      // 비로그인: 요청 자체를 안 함 + 상태도 빈값으로 정리
      if (!isLoggedIn) {
        if (!ignore) {
          setFavorites([]);
          setFavoritesVersion((v) => v + 1);
        }
        return;
      }

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
    },
    [isLoggedIn]
  );

  // 목록 + 즐겨찾기 재조회 함수
  const loadNotices = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const list = await getNoticeList();
      setNotices(list ?? []);
      await loadFavorites(false);
    } catch (err) {
      const ax = err as AxiosError<ApiErrorResponse>;
      const msg =
        ax.response?.data?.message ||
        ax.message ||
        "목록을 불러오지 못했습니다.";

      setErrorMessage(msg);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, [loadFavorites]);

  // 최초 로딩
  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  // 생성/수정/삭제 등 공고 변경 이벤트 수신 → 재조회
  useEffect(() => {
    const onChanged = () => {
      loadNotices();
    };

    window.addEventListener("notices-changed", onChanged);
    return () => window.removeEventListener("notices-changed", onChanged);
  }, [loadNotices]);

  const categoryKey = useMemo(
    () => JSON.stringify(filters.category),
    [filters.category]
  );
  const statusKey = useMemo(
    () => JSON.stringify(filters.status),
    [filters.status]
  );

  useEffect(() => {
    setPage(1);
  }, [filters.keyword, categoryKey, statusKey, sortType]);

  // (안전) 혹시 어디서든 SALE_HOUSE가 주입되면 제거
  useEffect(() => {
    if (!filters.category?.some((c) => EXCLUDED_CATEGORIES.has(c))) return;

    setFilters((prev) => ({
      ...prev,
      category: (prev.category ?? []).filter((c) => !EXCLUDED_CATEGORIES.has(c)),
    }));
  }, [filters.category]);

  const filtered = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();

    return (notices ?? []).filter((n) => {
      const matchKeyword =
        keyword.length === 0 ||
        (n.title ?? "").toLowerCase().includes(keyword);

      const matchCategory =
        filters.category.length === 0 ||
        (n.category != null && filters.category.includes(String(n.category)));

      const matchStatus =
        filters.status.length === 0 ||
        (() => {
          const cs = computeNoticeStatus(n.startDate, n.endDate);
          return cs != null && filters.status.includes(cs);
        })();

      return matchKeyword && matchCategory && matchStatus;
    });
  }, [notices, filters.keyword, filters.category, filters.status]);

  const sorted = useMemo(() => {
    const copied = [...filtered];

    if (sortType === "REG_DATE") {
      copied.sort((a, b) => toMs(b.regDate) - toMs(a.regDate));
      return copied;
    }

    const today = new Date();

    copied.sort((a, b) => {
      const aStatus = computeNoticeStatus(a.startDate, a.endDate, today);
      const bStatus = computeNoticeStatus(b.startDate, b.endDate, today);

      const aClosed = aStatus === "CLOSED";
      const bClosed = bStatus === "CLOSED";

      if (aClosed !== bClosed) return aClosed ? 1 : -1;

      const aEnd = toMs(a.endDate);
      const bEnd = toMs(b.endDate);

      if (!aClosed && !bClosed) return aEnd - bEnd;
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

  // 캐러셀 featured: notices 기준으로 즉시 재계산됨
  const featured = useMemo(() => {
    const base = notices ?? [];
    if (base.length === 0) return [];

    // 1) 기본: 마감일까지 남은 날짜 기준으로(청약 예정 포함) 0 이상만 노출
    const byDeadline = [...base]
      .map((n) => ({
        n,
        daysLeft: calcDaysLeft(n.endDate),
      }))
      .filter((x) => x.daysLeft !== null && x.daysLeft >= 0)
      .sort((a, b) => a.daysLeft! - b.daysLeft!)
      .slice(0, 5)
      .map((x) => x.n);

    if (byDeadline.length > 0) return byDeadline;

    // 2) fallback: 혹시 endDate 파싱 실패/없음 등으로 다 걸러지면 최신 등록순으로라도 띄우기
    return [...base]
      .sort((a, b) => toMs(b.regDate) - toMs(a.regDate))
      .slice(0, 5);
  }, [notices]);

  return (
    <div className="mx-auto md:py-8 space-y-10">
      <NoticeHeroCarousel items={featured} />

      <FavoritesNoticeSection
        items={favorites}
        onChangedFavorites={loadFavorites}
      />

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
