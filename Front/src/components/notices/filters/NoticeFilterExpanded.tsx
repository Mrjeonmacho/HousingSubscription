import type { ReactNode } from "react";

import type { Filters } from "./NoticeFilterBar";
import type { ComputedNoticeStatus } from "../../../utils/noticeStatus";

type Option<T extends string = string> = {
  value: T;
  label: string;
};

// 1. Chip 컴포넌트: 접근성(aria-pressed)과 시각적 피드백 강화
function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "h-9 px-4 rounded-full text-sm font-medium transition-all duration-200",
        "cursor-pointer",
        active
          ? "bg-primary text-white border-primary shadow-sm" // 활성화 시 배경색 강조 (선택사항)
          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300",
        "border",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function MultiChipGroup<T extends string>({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: Option<T>[];
  value: T[];
  onChange: (next: T[]) => void;
}) {
  const hasAny = value.length > 0;

  const toggle = (v: T) => {
    const nextValue = value.includes(v)
      ? value.filter((x) => x !== v)
      : [...value, v];
    onChange(nextValue);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[15px] font-bold text-gray-900">{title}</p>
      <div className="flex flex-wrap gap-2">
        <Chip active={!hasAny} onClick={() => onChange([])}>
          전체
        </Chip>
        {options.map((opt) => (
          <Chip
            key={opt.value}
            active={value.includes(opt.value)}
            onClick={() => toggle(opt.value)}
          >
            {opt.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

type Props = {
  categories: Option<string>[];
  statuses: Option<ComputedNoticeStatus>[];
  value: Filters;
  onChange: (next: Filters) => void;
  onReset: () => void;
};

export default function FilterPanelExpanded({
  categories,
  statuses,
  value,
  onChange,
  onReset,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex flex-col gap-8">
        
        {/* 필터 그룹 영역 */}
        <div className="space-y-6">
          <MultiChipGroup
            title="주택유형"
            options={categories}
            value={value.category}
            onChange={(next) => onChange({ ...value, category: next })}
          />

          <MultiChipGroup
            title="진행상태"
            options={statuses}
            value={value.status}
            onChange={(next) => onChange({ ...value, status: next })}
          />
        </div>

        {/* 하단 액션 영역: 초기화 버튼을 아래로 배치하여 안정감 부여 */}
        <div className="flex justify-end border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            <span className="text-lg">↺</span> 필터 초기화
          </button>
        </div>
      </div>
    </div>
  );
}