// Front/src/components/noticeDetail/NoticeDetailHeader.tsx

// import { statusLabel } from "../../utils/noticeFormat";
import type { Notice } from "../../pages/NoticesPage";

type Props = {
  title: string;
  status: Notice["status"];
  dday: number | null;
  loading: boolean;
  onBack: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
};

// function statusBadgeLabel(status: Notice["status"]) {
//   return statusLabel(status);
// }

function statusTone(status: Notice["status"]) {
  if (status === "RECEIVING") return "bg-emerald-50 text-emerald-700";
  if (status === "DEADLINE_APPROACHING") return "bg-rose-50 text-rose-700";
  return "bg-gray-100 text-gray-700";
}

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
        fontVariationSettings: "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}

export default function NoticeDetailHeader({
  title,
  status,
  dday,
  loading,
  onBack,
  onFavorite,
  onShare,
}: Props) {
  return (
    <header className="mb-8 flex flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
      >
        <MaterialIcon name="arrow_back" className="text-[18px]" />
        공고 목록으로 돌아가기
      </button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusTone(
                status
              )}`}
            >
              {/* {statusBadgeLabel(status)} */}
            </span>

            {typeof dday === "number" && (
              <span className="text-sm font-semibold text-red-500">
                {dday > 0
                  ? `D-${dday}`
                  : dday === 0
                  ? "D-DAY"
                  : `D+${Math.abs(dday)}`}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-black leading-tight text-gray-900">
            {loading ? (
              <span className="inline-block h-10 w-[520px] max-w-full rounded bg-gray-100 animate-pulse" />
            ) : (
              title
            )}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onFavorite}
            className="h-11 w-11 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center"
            aria-label="찜"
          >
            <MaterialIcon name="favorite" className="text-gray-700" />
          </button>
          <button
            type="button"
            onClick={onShare}
            className="h-11 w-11 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center"
            aria-label="공유"
          >
            <MaterialIcon name="share" className="text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
