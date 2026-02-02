// Front/src/components/notices/filters/NoticeFilterBar.tsx
import { useMemo, useState } from "react";
import {
  categoryLabel,
  statusLabel,
  type NoticeCategory,
  type NoticeStatus,
} from "../../../utils/noticeFormat";

import NoticeFilterCollapsed from "./NoticeFilterCollapsed";
import NoticeFilterExpanded from "./NoticeFilterExpanded";

type Option = {
  value: string;
  label: string;
};

type SortKey = "LATEST" | "DEADLINE" | "POPULAR";

export type Filters = {
  keyword: string;
  category: string[];
  status: string[];
  sort: SortKey;
};

type NoticeFilterBarProps = {
  value: Filters;
  onChange: (next: Filters) => void;

  categoryOptions?: Option[];
  statusOptions?: Option[];

  placeholder?: string;
  className?: string;

  // 처음 렌더링 시 펼칠지 여부(또는 true로 들어오면 펼치기)
  defaultExpanded?: boolean;
};

function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{
        fontVariationSettings:
          "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20",
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export default function NoticeFilterBar({
  value,
  onChange,
  categoryOptions,
  statusOptions,
  placeholder = "검색어를 입력하세요",
  className,
  defaultExpanded = false,
}: NoticeFilterBarProps) {
  // 초기값에 반영
  const [expanded, setExpanded] = useState(() => defaultExpanded);
  const [localKeyword, setLocalKeyword] = useState(value.keyword);

  const defaultCategoryOptions = useMemo<Option[]>(() => {
    const categories: NoticeCategory[] = [
      "YOUTH_RESIDENCE",
      "HAPPY_HOUSE",
      "NATIONAL_RENTAL",
      "PUBLIC_RENTAL",
      "LONG_TERM_RENTAL",
      "SALE_HOUSE",
    ];
    return categories.map((c) => ({ value: c, label: categoryLabel(c) }));
  }, []);

  const defaultStatusOptions = useMemo<Option[]>(() => {
    const statuses: NoticeStatus[] = [
      "RECEIVING",
      "DEADLINE_APPROACHING",
      "COMPLETED",
      "TO_BE_ANNOUNCED",
    ];
    return statuses.map((s) => ({ value: s, label: statusLabel(s) }));
  }, []);

  const categories = categoryOptions ?? defaultCategoryOptions;
  const statuses = statusOptions ?? defaultStatusOptions;

  const commitKeyword = () => {
    const next = localKeyword.trim();
    if (next === value.keyword) return;
    onChange({ ...value, keyword: next });
  };

  const resetFilters = () => {
    setLocalKeyword("");
    onChange({
      ...value,
      keyword: "",
      category: [],
      status: [],
    });
  };

  return (
    <section
      className={[
        "w-full bg-white border border-gray-200 rounded-xl p-4",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex flex-col lg:flex-row gap-3">
        <NoticeFilterCollapsed
          expanded={expanded}
          onToggleExpanded={() => setExpanded((p) => !p)}
        />

        <div className="hidden lg:block w-px bg-gray-200 my-1 mx-1" />

        <div className="relative flex-1 flex items-center border border-gray-200 rounded-lg px-3 h-11 bg-gray-50">
          <MaterialIcon name="search" className="mr-2 text-gray-400" />
          <input
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            onBlur={commitKeyword}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitKeyword();
            }}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm"
            aria-label="공지 검색"
          />
        </div>

        <button
          onClick={commitKeyword}
          className={[
            "h-11 px-6 rounded-lg font-medium text-sm flex-shrink-0",
            "bg-primary text-white shadow-sm",
            "hover:bg-primary/90 hover:shadow active:translate-y-0.5",
            "transition-all duration-200 ease-in-out",
            "cursor-pointer",
          ].join(" ")}
        >
          검색
        </button>
      </div>

      {expanded ? (
        <div className="mt-4">
          <NoticeFilterExpanded
            categories={categories}
            statuses={statuses}
            value={value}
            onChange={onChange}
            onReset={resetFilters}
          />
        </div>
      ) : null}
    </section>
  );
}
