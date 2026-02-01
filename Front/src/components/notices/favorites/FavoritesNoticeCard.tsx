import { categoryLabel, statusLabel } from "../../../utils/noticeFormat";
import type { Notice } from "../../../pages/NoticesPage";

type Props = {
  notice: Notice;
  isPending: boolean;
  onClick: () => void;
  onUnfavorite: () => void;
};

export default function FavoritesNoticeCard({
  notice,
  isPending,
  onClick,
  onUnfavorite,
}: Props) {
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
      <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
        {categoryLabel(notice.category)}
      </span>

      <button
        type="button"
        className="absolute right-6 top-6 text-red-500 hover:text-red-600 disabled:opacity-60"
        aria-label="찜 해제"
        disabled={isPending}
        onClick={(e) => {
          e.stopPropagation();
          onUnfavorite();
        }}
      >
        ❤
      </button>

      <h3 className="mt-4 line-clamp-2 text-base font-semibold text-gray-900">
        {notice.title}
      </h3>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm font-medium text-green-600">
          {statusLabel(notice.status)}
        </span>
        <span className="text-gray-300">→</span>
      </div>
    </div>
  );
}
