// Front/src/components/notices/favorites/FavoritesNoticeCard.tsx
import { noticeStatusLabel } from "../../../utils/noticeFormat";
import {
  computeNoticeStatus,
  type ComputedNoticeStatus,
} from "../../../utils/noticeStatus";
import type { Notice } from "../../../pages/NoticesPage";
import CategoryBadge from "../../../components/common/CategoryBadge";

type Props = {
  notice: Notice;
  isPending: boolean;
  onClick: () => void;
  onUnfavorite: () => void;
};

function statusToneByComputed(status: ComputedNoticeStatus) {
  switch (status) {
    case "DEADLINE_SOON":
      return "text-red-500";
    case "RECRUITING":
      return "text-primary";
    case "UPCOMING":
      return "text-gray-600";
    case "CLOSED":
      return "text-gray-500";
    default:
      return "text-gray-600";
  }
}

export default function FavoritesNoticeCard({
  notice,
  isPending,
  onClick,
  onUnfavorite,
}: Props) {
  // 날짜 기반 상태만 사용 (백엔드 status fallback 제거)
  const computedStatus: ComputedNoticeStatus =
    computeNoticeStatus(notice.startDate, notice.endDate) ?? "UPCOMING";

  const statusText = noticeStatusLabel(computedStatus);
  const statusClass = statusToneByComputed(computedStatus);

  return (
    <div
      data-fav-card
      onClick={onClick}
      className="
        relative cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm
        transition hover:shadow-md
        shrink-0
        w-[calc((100%-2rem)/3)]
        min-w-[260px]
      "
    >
      <CategoryBadge category={notice.category} size="md" />

      <button
        type="button"
        className="
          absolute right-6 top-6
          inline-flex h-9 w-9 items-center justify-center rounded-full
          bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600
          disabled:opacity-60
        "
        aria-label="찜 해제"
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          onUnfavorite();
        }}
        title="찜 해제"
      >
        <span
          className="material-symbols-outlined text-[20px] leading-none"
          style={{
            fontVariationSettings: "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24",
          }}
          aria-hidden="true"
        >
          favorite
        </span>
      </button>

      <h3 className="mt-4 line-clamp-2 text-base font-semibold text-gray-900">
        {notice.title}
      </h3>

      <div className="mt-6 flex items-center justify-between">
        <span className={`text-sm font-medium ${statusClass}`}>{statusText}</span>
        <span className="text-gray-300">→</span>
      </div>
    </div>
  );
}
