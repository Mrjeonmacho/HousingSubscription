// Front/src/components/notices/filters/NoticeFilterBar.tsx
import { useEffect, useMemo, useState } from "react";
import {
  categoryLabel,
  noticeStatusLabel,
  type NoticeCategory,
} from "../../../utils/noticeFormat";
import type { ComputedNoticeStatus } from "../../../utils/noticeStatus";

import NoticeFilterCollapsed from "./NoticeFilterCollapsed";
import NoticeFilterExpanded from "./NoticeFilterExpanded";

type Option<T extends string = string> = {
  value: T;
  label: string;
};

type SortKey = "LATEST" | "DEADLINE" | "POPULAR";

export type Filters = {
  keyword: string;
  category: string[];
  status: ComputedNoticeStatus[];
  sort: SortKey;
};

type NoticeFilterBarProps = {
  value: Filters;
  onChange: (next: Filters) => void;

  categoryOptions?: Option<string>[];
  statusOptions?: Option<ComputedNoticeStatus>[];

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
        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20",
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

// 필터에서 제외할 카테고리(주택유형)
const EXCLUDED_CATEGORIES = new Set<string>(["SALE_HOUSE"]);

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

  // 만약 외부에서든 내부에서든 SALE_HOUSE가 들어와 있으면 제거(보이지 않는 선택값 방지)
  useEffect(() => {
    if (!value.category?.some((c) => EXCLUDED_CATEGORIES.has(c))) return;

    const nextCategory = (value.category ?? []).filter(
      (c) => !EXCLUDED_CATEGORIES.has(c)
    );
    onChange({ ...value, category: nextCategory });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.category]);

  const defaultCategoryOptions = useMemo<Option<NoticeCategory>[]>(() => {
    const categories: NoticeCategory[] = [
      "YOUTH_RESIDENCE",
      "HAPPY_HOUSE",
      "NATIONAL_RENTAL",
      "PUBLIC_RENTAL",
      "LONG_TERM_RENTAL",
    ];

    return categories
      .filter((c) => !EXCLUDED_CATEGORIES.has(String(c)))
      .map((c) => ({ value: c, label: categoryLabel(c) }));
  }, []);

  // 진행상태는 날짜 기반 computed 상태로 고정
  const defaultStatusOptions = useMemo<Option<ComputedNoticeStatus>[]>(() => {
    const statuses: ComputedNoticeStatus[] = [
      "UPCOMING",
      "RECRUITING",
      "DEADLINE_SOON",
      "CLOSED",
    ];
    return statuses.map((s) => ({ value: s, label: noticeStatusLabel(s) }));
  }, []);

  // 외부에서 categoryOptions를 주더라도, 필터에서 제외 대상은 한번 더 걸러줌
  const categories = useMemo<Option<string>[]>(() => {
    const base: Option<string>[] =
      categoryOptions ?? (defaultCategoryOptions as Option<string>[]);
    return base.filter((opt) => !EXCLUDED_CATEGORIES.has(opt.value));
  }, [categoryOptions, defaultCategoryOptions]);

  const statuses: Option<ComputedNoticeStatus>[] =
    statusOptions ?? defaultStatusOptions;

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
            className={[
              "w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm",
              "h-11 leading-[44px]",
              "py-0",
            ].join(" ")}
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
