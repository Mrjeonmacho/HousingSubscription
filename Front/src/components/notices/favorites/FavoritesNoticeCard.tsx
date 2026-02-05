// Front/src/components/notices/favorites/FavoritesNoticeCard.tsx
import { noticeStatusLabel } from "../../../utils/noticeFormat";
import {
  computeNoticeStatus,
  type ComputedNoticeStatus,
} from "../../../utils/noticeStatus";
import type { Notice } from "../../../pages/NoticesPage";
import CategoryBadge from "../../../components/common/CategoryBadge";
import FavoriteHeartButton from "../../common/FavoriteHeartButton";
import { useAuth } from "../../../context/AuthContext";

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
  const { isLoggedIn } = useAuth();

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

      {/* 하트(통일): 기준 하트 스타일 + stopPropagation 유지 */}
      <div className="absolute right-6 top-6">
        <FavoriteHeartButton
          isFavorite={true}
          isPending={isPending}
          isLoggedIn={isLoggedIn}
          onToggle={onUnfavorite}
          stopPropagation={true}
        />
      </div>

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
