// Front/src/components/notices/list/NoticeListItem.tsx => 개별 공고
import { useMemo } from "react";
import type { Notice } from "../../../pages/NoticesPage";
import { noticeStatusLabel } from "../../../utils/noticeFormat";
import { computeNoticeStatus } from "../../../utils/noticeStatus";
import CategoryBadge from "../../../components/common/CategoryBadge";

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

// D-Day 로직은 "그대로 유지"
function getDDayInfo(endDate: string | null) {
  if (!endDate)
    return { text: null as string | null, daysLeft: null as number | null };

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

function statusTone(statusText: string, isClosed: boolean) {
  if (isClosed) return "text-gray-400";

  const normalized = statusText.replace(/\s+/g, "");

  if (normalized.includes("마감") && normalized.includes("임박")) return "text-red-500";
  if (normalized.includes("접수중")) return "text-primary";
  if (normalized.includes("예정")) return "text-[#8B95A1]";
  if (normalized.includes("마감")) return "text-gray-400";

  return "text-[#8B95A1]";
}

export default function NoticeListItem({
  notice: n,
  isFavorite,
  isPending,
  onOpen,
  onToggleFavorite,
}: Props) {
  // 1) 날짜 기반 상태 계산 (startDate/endDate 기준)
  //    status fallback은 제거하고, null일 때만 안전하게 UPCOMING 처리
  const computedStatus = useMemo(
    () => computeNoticeStatus(n.startDate, n.endDate) ?? "UPCOMING",
    [n.startDate, n.endDate]
  );

  // 2) 좌측 상태 텍스트는 날짜 기반만 사용
  const statusText = useMemo(() => {
    return String(noticeStatusLabel(computedStatus));
  }, [computedStatus]);

  // 3) 마감 여부도 날짜 기반으로만 판단
  const isClosed = useMemo(() => computedStatus === "CLOSED", [computedStatus]);

  // 4) D-Day는 기존 로직 그대로 (endDate 기준)
  const { text: ddayText, daysLeft } = useMemo(
    () => getDDayInfo(n.endDate),
    [n.endDate]
  );

  const leftStatusClass = statusTone(statusText, isClosed);

  return (
    <article
      onClick={() => onOpen(n.id)}
      className={[
        "group relative",
        "grid grid-cols-[150px_1fr_80px] items-center",
        "px-6 py-5 bg-white",
        "transition-colors duration-150 hover:bg-primary/8",
        "cursor-pointer",
      ].join(" ")}
    >
      {/* 1열: 모집 상태 + D-Day */}
      <div className="flex flex-col items-center justify-center px-2 leading-tight">
        <span className={`text-[15px] font-bold tracking-tight ${leftStatusClass}`}>
          {statusText}
        </span>

        {/* D-Day: 있을 때만 렌더링 (끝나면 숨김) */}
        {ddayText && (
          <span className={["mt-0.5 text-[13px] font-medium", ddayTone(daysLeft)].join(" ")}>
            {ddayText}
          </span>
        )}
      </div>

      {/* 2열: 공고 본문 (카테고리뱃지 / 공고명 / 모집기간) */}
      <div className="min-w-0 px-4">
        <div className="mb-2 flex items-center gap-2">
          <CategoryBadge category={n.category} size="sm" className="shrink-0" />
        </div>

        <h4 className="truncate text-[15px] font-bold text-[#191F28] tracking-tight mb-2">
          {n.title}
        </h4>

        <div className="flex items-center gap-1.5 text-sm text-[#8B95A1] font-medium">
          <span className="whitespace-nowrap">모집 기간 |</span>
          <span className="truncate">{formatDateRange(n.startDate, n.endDate)}</span>
        </div>
      </div>

      {/* 3열: 관심공고 */}
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
