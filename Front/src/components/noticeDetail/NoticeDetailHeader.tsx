// Front/src/components/noticeDetail/NoticeDetailHeader.tsx
import { useEffect, useMemo, useState } from "react";
import type { Notice } from "../../pages/NoticesPage";
import { statusLabel } from "../../utils/noticeFormat";
import {
  addFavoriteNotice,
  getFavoriteNotices,
  removeFavoriteNotice,
} from "../../api/NoticeApi";


type Props = {
  noticeId: number | null;
  title: string;
  status: Notice["status"];
  dday: number | null;
  loading: boolean;
  onBack: () => void;
  onShare?: () => void;
};

function statusTone(status: Notice["status"]) {
  if (status === "RECEIVING") return "bg-emerald-50 text-emerald-700";
  if (status === "DEADLINE_APPROACHING") return "bg-rose-50 text-rose-700";
  return "bg-gray-100 text-gray-700";
}

function MaterialIcon({
  name,
  className,
  filled,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 500, 'GRAD' 0, 'opsz' 24`,
      }}
    >
      {name}
    </span>
  );
}

export default function NoticeDetailHeader({
  noticeId,
  title,
  status,
  dday,
  loading,
  onBack,
  onShare,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favPending, setFavPending] = useState(false);

  const badgeText = useMemo(() => {
    return statusLabel(status);
  }, [status]);

  // 1) 로그인 사용자 조회 + 찜 여부 조회
  useEffect(() => {
    if (!noticeId || loading) return;

    let ignore = false;

    (async () => {
      try {
        const favorites = await getFavoriteNotices();
        if (ignore) return;

        const favored = favorites.some((f) => f?.id === noticeId);
        setIsFavorite(favored);
      } catch {
        // 로그인 안 됐거나 에러 → 찜 아님으로 처리
        if (!ignore) setIsFavorite(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [noticeId, loading]);


  // 2) 찜 토글
  const onFavorite = async () => {
    if (!noticeId || favPending) return;

    const currently = isFavorite;

    setFavPending(true);
    setIsFavorite(!currently);

    try {
      const data = currently
        ? await removeFavoriteNotice(noticeId)
        : await addFavoriteNotice(noticeId);

      setIsFavorite(Boolean(data.isFavorite));
    } catch {
      setIsFavorite(currently);
      alert("로그인이 필요하거나 요청 처리 중 오류가 발생했습니다.");
    } finally {
      setFavPending(false);
    }
  };

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
              {badgeText}
            </span>

            {typeof dday === "number" && (
              <span className="text-sm font-semibold text-red-500">
                {dday > 0 ? `D-${dday}` : dday === 0 ? "D-DAY" : `D+${Math.abs(dday)}`}
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
            disabled={loading || favPending}
          >
            <MaterialIcon
              name="favorite"
              className={isFavorite ? "text-red-500" : "text-gray-700"}
              filled={isFavorite}
            />
          </button>
          <button
            type="button"
            onClick={onShare}
            className="h-11 w-11 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center"
            aria-label="공유"
            disabled={loading}
          >
            <MaterialIcon name="share" className="text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
