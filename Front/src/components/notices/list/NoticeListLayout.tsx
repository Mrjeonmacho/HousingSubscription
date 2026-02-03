// Front/src/components/notices/list/NoticeListLayout.tsx
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

  filters: {
    keyword: string;
    category: string[];
    status: string[];
    sort: "LATEST" | "DEADLINE" | "POPULAR";
  };
  onChangeFilters: (next: Props["filters"]) => void;

  sortType: SortType;
  onChangeSortType: (next: SortType) => void;

  onChangedFavorites?: () => void;
  favoritesVersion?: number;

  className?: string;

  // 필터 자동 펼침
  defaultExpandFilters?: boolean;
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
  defaultExpandFilters = false,
}: Props) {
  return (
    <section className={["space-y-3", className ?? ""].join(" ")}>
      <NoticeListHeader
        totalCount={totalCount}
        sortType={sortType}
        onChangeSort={onChangeSortType}
      />

      <NoticeFilterBar
        value={filters}
        onChange={onChangeFilters}
        defaultExpanded={defaultExpandFilters}
      />

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
