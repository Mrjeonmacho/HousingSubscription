// Front/src/components/notices/NoticeFilterBar.tsx
import { useMemo, useState } from "react";
import type { Notice } from "../../pages/NoticesPage";

type Option = {
  value: string;
  label: string;
};

type SortKey = "LATEST" | "DEADLINE" | "POPULAR";

type Filters = {
  keyword: string;
  category: string; // "ALL" | Notice["category"]
  status: string; // "ALL" | Notice["status"]
  sort: SortKey;
};

type NoticeFilterBarProps = {
  value: Filters;
  onChange: (next: Filters) => void;

  regionOptions?: Option[]; // 아직 페이지 필터에 region이 없어서 UI만 확장용
  categoryOptions?: Option[];
  statusOptions?: Option[];

  placeholder?: string;
  className?: string;
};

type NoticeCategory = Notice["category"];
type NoticeStatus = Notice["status"];

function categoryLabel(category: NoticeCategory) {
  switch (category) {
    case "YOUTH_RESIDENCE":
      return "청년안심주택";
    case "HAPPY_HOUSE":
      return "행복주택";
    case "NATIONAL_RENTAL":
      return "국민임대";
    case "PUBLIC_RENTAL":
      return "공공임대";
    case "LONG_TERM_RENTAL":
      return "장기전세";
    case "SALE_HOUSE":
      return "분양주택";
    default:
      return category ?? "-";
  }
}

function statusLabel(status: NoticeStatus) {
  switch (status) {
    case "RECEIVING":
      return "접수중";
    case "DEADLINE_APPROACHING":
      return "마감임박";
    case "COMPLETED":
      return "접수마감";
    case "TO_BE_ANNOUNCED":
      return "발표예정";
    default:
      return status ?? "-";
  }
}

function MaterialIcon({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

function SelectPill({
  label,
  value,
  options,
  isActive,
  onSelect,
}: {
  label: string;
  value: string;
  options: Option[];
  isActive: boolean;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="relative inline-flex h-full min-w-[140px]">
      <select
        value={value}
        onChange={(e) => onSelect(e.target.value)}
        className={[
          "h-11 w-full pl-3 pr-8 text-sm cursor-pointer outline-none transition-colors",
          "appearance-none bg-transparent rounded-lg",
          // 기본 테두리 회색 고정
          "border border-gray-300",
          // 선택됐을 때만 초록 테두리
          isActive ? "border-primary text-gray-900" : "text-gray-700 hover:border-gray-400",
        ].join(" ")}
        aria-label={label}
      >
        {/* '전체' 옵션 */}
        <option value="ALL" className="text-gray-900 bg-white">
          전체
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-gray-900 bg-white">
            {opt.label}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
        <MaterialIcon
          name="keyboard_arrow_down"
          className={isActive ? "text-primary text-[1.2rem]" : "text-gray-400 text-[1.2rem]"}
        />
      </div>
    </div>
  );
}

export default function NoticeFilterBar({
  value,
  onChange,
  // regionOptions, // 현재 NoticesPage Filters에 region이 없어서 사용 안 함(추후 확장용)
  categoryOptions,
  statusOptions,
  placeholder = "검색어를 입력하세요",
  className,
}: NoticeFilterBarProps) {
  const [localKeyword, setLocalKeyword] = useState(value.keyword);

  // 카테고리/상태 옵션(코드값 기반)
  const defaultCategoryOptions = useMemo<Option[]>(() => {
    const categories = [
      "YOUTH_RESIDENCE",
      "HAPPY_HOUSE",
      "NATIONAL_RENTAL",
      "PUBLIC_RENTAL",
      "LONG_TERM_RENTAL",
      "SALE_HOUSE",
    ] as const;

    return categories.map((c) => ({ value: c, label: categoryLabel(c) }));
  }, []);

  const defaultStatusOptions = useMemo<Option[]>(() => {
    const statuses = [
      "RECEIVING",
      "DEADLINE_APPROACHING",
      "COMPLETED",
      "TO_BE_ANNOUNCED",
    ] as const;

    return statuses.map((s) => ({ value: s, label: statusLabel(s) }));
  }, []);

  const categories: Option[] = categoryOptions ?? defaultCategoryOptions;
  const statuses: Option[] = statusOptions ?? defaultStatusOptions;

  const commitKeyword = () => {
    const next = localKeyword.trim();
    if (next === value.keyword) return;
    onChange({ ...value, keyword: next });
  };

  return (
    <section
      className={[
        "w-full bg-white border border-gray-200",
        "rounded-xl p-4",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 지역 필터는 현재 NoticesPage Filters에 없어서 렌더링 제외 */}

          <SelectPill
            label="주택 유형"
            value={value.category}
            options={categories}
            isActive={value.category !== "ALL"}
            onSelect={(v) => onChange({ ...value, category: v })}
          />

          <SelectPill
            label="진행 상태"
            value={value.status}
            options={statuses}
            isActive={value.status !== "ALL"}
            onSelect={(v) => onChange({ ...value, status: v })}
          />
        </div>

        <div className="hidden lg:block w-px bg-gray-200 my-1 mx-1" />

        {/* Search Input */}
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
          ].join(" ")}
        >
          검색
        </button>
      </div>
    </section>
  );
}
