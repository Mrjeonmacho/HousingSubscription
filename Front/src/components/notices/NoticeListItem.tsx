// Front\src\components\notices\NoticeListItem.tsx
import { useMemo } from "react";
import type { Notice } from "../../pages/NoticesPage";
import { categoryLabel, statusLabel } from "../../utils/noticeFormat";

type Props = {
  notice: Notice;
  isFavorite: boolean;
  isPending: boolean;
  onOpen: (id: number) => void;
  onToggleFavorite: (id: number) => void;
};

function formatDateRange(start: string | null, end: string | null) {
  const s = start ?? "-";
  const e = end ?? "-";
  return `${s} - ${e}`;
}

function calcDDay(endDate: string | null) {
  if (!endDate) return null;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return null;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffMs = startOfEnd.getTime() - startOfToday.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-DAY";
  return null;
}

function getDDayInfo(endDate: string | null) {
  if (!endDate) return { text: null as string | null, daysLeft: null as number | null };

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return { text: null, daysLeft: null };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffMs = startOfEnd.getTime() - startOfToday.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return { text: `D-${diffDays}`, daysLeft: diffDays };
  if (diffDays === 0) return { text: "D-DAY", daysLeft: 0 };
  return { text: null, daysLeft: diffDays };
}

function ddayTone(daysLeft: number | null) {
  if (daysLeft === null) return "text-gray-400";
  if (daysLeft <= 3) return "text-red-500";
  if (daysLeft <= 7) return "text-primary";
  return "text-gray-400";
}

function rightTone() {
  return "text-primary";
}

function isClosedNotice(n: Notice) {
  if (n.endDate) {
    const end = new Date(n.endDate);
    if (!Number.isNaN(end.getTime())) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      if (startOfEnd.getTime() >= startOfToday.getTime()) return false;
      return true;
    }
  }

  const label = statusLabel(n.status);
  const normalized = String(label).replace(/\s+/g, "");
  return normalized.includes("마감") || normalized.includes("종료");
}

function statusTone(statusText: string, isClosed: boolean) {
  if (isClosed) return "text-gray-400";
  const normalized = statusText.replace(/\s+/g, "");
  if (normalized.includes("접수중") || normalized.includes("모집중")) return "text-[#F97316]";
  if (normalized.includes("마감") || normalized.includes("종료") || normalized.includes("완료"))
    return "text-gray-400";
  if (normalized.includes("예정")) return "text-[#8B95A1]";
  return "text-[#8B95A1]";
}

export default function NoticeListItem({
  notice: n,
  isFavorite,
  isPending,
  onOpen,
  onToggleFavorite,
}: Props) {
  const statusText = useMemo(() => String(statusLabel(n.status)), [n.status]);

  const dday = useMemo(() => calcDDay(n.endDate), [n.endDate]);
  const rightText = dday ?? statusLabel(n.status);

  const { text: ddayText, daysLeft } = useMemo(() => getDDayInfo(n.endDate), [n.endDate]);
  const isClosed = useMemo(() => isClosedNotice(n), [n]);

  const rightTextClass = isClosed ? "text-gray-400" : ddayText ? ddayTone(daysLeft) : rightTone();
  const leftStatusClass = statusTone(statusText, isClosed);

  return (
    <article
      onClick={() => onOpen(n.id)}
      className={[
        "group relative",
        "grid grid-cols-[84px_1fr_92px_64px] items-center",
        "px-6 py-5 bg-white",
        "transition-colors duration-150 hover:bg-primary/8",
        "cursor-pointer",
      ].join(" ")}
    >
      {/* 1열: 모집 상태 */}
      <div className="flex items-center justify-center px-2">
        <span className={`text-[15px] font-bold tracking-tight ${leftStatusClass}`}>
          {statusText}
        </span>
      </div>

      {/* 2열: 공고 본문 (카테고리뱃지 / 공고명 / 모집기간) */}
      <div className="min-w-0 px-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-bold leading-none">
            {categoryLabel(n.category)}
          </span>
        </div>

        <h4 className="truncate text-[15px] font-bold text-[#191F28] tracking-tight mb-2">
          {n.title}
        </h4>

        <div className="flex items-center gap-1.5 text-sm text-[#8B95A1] font-medium">
          <span className="whitespace-nowrap">모집 기간 |</span>
          <span className="truncate">{formatDateRange(n.startDate, n.endDate)}</span>
        </div>
      </div>

      {/* 3열: D-day */}
      <div className="flex justify-center px-2">
        <span className={`text-[15px] tracking-tight whitespace-nowrap ${rightTextClass}`}>
          {rightText}
        </span>
      </div>

      {/* 4열: 관심공고 */}
      <div className="flex justify-center px-2">
        <button
          type="button"
          className={[
            "p-1 rounded-full transition-colors disabled:opacity-60",
            "hover:bg-gray-100",
            isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-400",
          ].join(" ")}
          aria-label={isFavorite ? "찜 해제" : "찜"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(n.id);
          }}
          disabled={isPending}
        >
          ❤
        </button>
      </div>
    </article>
  );
}
