import { useEffect, useMemo, useState } from "react";
import type { Notice } from "../../pages/NoticesPage";
import { addFavoriteNotice, getFavoriteNotices, removeFavoriteNotice } from "../../api/NoticeApi";
import { statusLabel } from "../../utils/noticeFormat";

type Props = {
  noticeId: number | null;
  title: string;
  status: Notice["status"];
  dday: number | null;
  loading: boolean;
  onShare?: () => void;
};

// 공고 상태 뱃지 스타일
function getStatusBadgeStyle(status: Notice["status"]) {
  const s = status as string;
  
  if (s === "RECEIVING" || s === "OPEN" || s === "RECRUITING") {
    return "bg-[#F97316] text-white"; // 접수중
  }
  if (s === "DEADLINE_APPROACHING") {
    return "bg-[#FF5A5A] text-white"; // 마감임박
  }
  if (s === "TO_BE_ANNOUNCED" || s === "SCHEDULED") {
    return "bg-[#8B95A1] text-white"; // 발표예정
  }
  if (s === "COMPLETED" || s === "CLOSED" || s === "ENDED") {
    return "bg-gray-200 text-gray-500"; // 접수마감
  }
  
  return "bg-gray-100 text-gray-400";
}

// D-Day 색상 규칙
function ddayTone(daysLeft: number | null) {
  if (daysLeft === null) return "text-gray-400";
  if (daysLeft <= 3) return "text-red-500";
  if (daysLeft <= 7) return "text-primary";
  return "text-gray-400";
}

export default function NoticeDetailHeader({ noticeId, title, status, dday, loading, onShare }: Props) {
  const [isFavorite, setIsFavorite] = useState(false);

  const badgeText = useMemo(() => statusLabel(status), [status]);
  const badgeClass = useMemo(() => getStatusBadgeStyle(status), [status]);
  const ddayColorClass = useMemo(() => ddayTone(dday), [dday]);

  // 접수 마감 상태인지 확인하는 변수
  const isClosed = useMemo(() => {
    const s = status as string;
    return s === "COMPLETED" || s === "CLOSED" || s === "ENDED";
  }, [status]);

  useEffect(() => {
    if (!noticeId || loading) return;
    let ignore = false;
    (async () => {
      try {
        const favorites = await getFavoriteNotices();
        if (ignore) return;
        setIsFavorite(favorites.some((f) => f?.id === noticeId));
      } catch { /* ignore */ }
    })();
    return () => { ignore = true; };
  }, [noticeId, loading]);

  const onFavorite = async () => {
    if (!noticeId) return;
    const previousState = isFavorite;
    setIsFavorite(!previousState);
    try {
      if (previousState) {
        await removeFavoriteNotice(noticeId);
      } else {
        await addFavoriteNotice(noticeId);
      }
    } catch {
      setIsFavorite(previousState);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 뱃지 & D-Day 영역 */}
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}>
          {badgeText}
        </span>
  
        {typeof dday === "number" && !isClosed && (
          <span className={`text-xl font-bold ${ddayColorClass}`}>
            {dday > 0 ? `D-${dday}` : dday === 0 ? "D-Day" : `D+${Math.abs(dday)}`}
          </span>
        )}
      </div>

      {/* 제목 & 버튼 영역 */}
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
          {loading ? <div className="h-10 w-96 rounded bg-gray-200 animate-pulse"/> : title}
        </h1>

        <div className="flex shrink-0 gap-3">
           <button 
             onClick={onFavorite} 
             className="group flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 active:scale-95"
           >
              <span 
                className={`material-symbols-outlined transition-colors ${isFavorite ? "text-red-500" : "text-gray-400 group-hover:text-red-400"}`} 
                style={{fontVariationSettings: `'FILL' ${isFavorite?1:0}`}}
              >
                favorite
              </span>
           </button>
           
           <button 
             onClick={onShare}
             className="group flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:bg-gray-50 active:scale-95"
           >
              <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-900">share</span>
           </button>
        </div>
      </div>
    </div>
  );
}