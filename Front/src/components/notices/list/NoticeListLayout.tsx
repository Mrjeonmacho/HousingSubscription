// Front/src/components/notices/list/NoticeListLayout.tsx => 공고 전체 레이아웃
import NoticeListHeader from "./NoticeListHeader";
import NoticeFilterBar from "../filters/NoticeFilterBar";
import NoticeListSection from "./NoticeListSection";
import type { Notice } from "../../../pages/NoticesPage";

export type SortType = "REG_DATE" | "END_DATE";

type Props = {
  totalCount: number;
  items: Notice[];
  loading: boolean;
  errorMessage: string | null;

  // filters는 NoticeFilterBar가 기대하는 타입 그대로 사용(현재 페이지 Filters 유지)
  filters: {
    keyword: string;
    category: string[];
    status: string[];
    // sort는 여기서 안 씀(정렬은 sortType으로)
    sort: "LATEST" | "DEADLINE" | "POPULAR";
  };
  onChangeFilters: (next: Props["filters"]) => void;

  // 정렬은 page에서 내려받음
  sortType: SortType;
  onChangeSortType: (next: SortType) => void;

  onChangedFavorites?: () => void;
  favoritesVersion?: number;

  className?: string;
};

export default function NoticeListLayout({
  totalCount,
  items,
  loading,
  errorMessage,
  filters,
  onChangeFilters,
  sortType,
  onChangeSortType,
  onChangedFavorites,
  favoritesVersion,
  className,
}: Props) {
  return (
    <section className={["space-y-6", className ?? ""].join(" ")}>
      <NoticeListHeader
        totalCount={totalCount}
        sortType={sortType}
        onChangeSort={onChangeSortType}
      />

      <NoticeFilterBar value={filters} onChange={onChangeFilters} />

      <NoticeListSection
        items={items}
        loading={loading}
        errorMessage={errorMessage}
        onChangedFavorites={onChangedFavorites}
        favoritesVersion={favoritesVersion}
      />
    </section>
  );
}
