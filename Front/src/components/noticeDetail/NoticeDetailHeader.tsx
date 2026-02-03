import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addFavoriteNotice,
  getFavoriteNotices,
  removeFavoriteNotice,
} from "../../api/NoticeApi";
import { getIsAdmin } from "../../api/UserApi";
import type { AxiosError } from "axios";
import { deleteAdminNotice } from "../../api/AdminNoticeApi";

type Props = {
  noticeId: number | null;
  loading: boolean;
  title: string | undefined;
  startDate: string | undefined;
  endDate: string | undefined;

  // 상태/스타일 정보
  statusText: string;
  badgeStyle: string;
  dDayText: string | null;
  isUrgent: boolean;

  onShare: () => void;
};

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export default function NoticeDetailHeader({
  noticeId,
  loading,
  title,
  startDate,
  endDate,
  statusText,
  badgeStyle,
  dDayText,
  isUrgent,
  onShare,
}: Props) {
  const navigate = useNavigate();

  // 찜 상태 관리
  const [isFavorite, setIsFavorite] = useState(false);

  // 관리자 여부
  const [isAdmin, setIsAdmin] = useState<boolean>(() => Boolean(getIsAdmin()));

  // 삭제 중 상태
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const sync = () => setIsAdmin(Boolean(getIsAdmin()));
    window.addEventListener("auth-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("auth-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // 초기 찜 상태 확인
  useEffect(() => {
    if (!noticeId || loading) return;
    let ignore = false;
    (async () => {
      try {
        const favorites = await getFavoriteNotices();
        if (!ignore) {
          setIsFavorite(favorites.some((f) => f?.id === noticeId));
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      ignore = true;
    };
  }, [noticeId, loading]);

  // 찜 토글 핸들러
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
    } catch (error) {
      console.error(error);
      setIsFavorite(previousState);
    }
  };

  const onUpdate = () => {
    if (!noticeId) return;
    navigate(`/admin/notices/${noticeId}/update`);
  };

  const onDelete = async () => {
    if (!noticeId) return;
    if (deleting) return;

    const ok = window.confirm(
      "정말 삭제하시겠습니까?\n삭제된 공고는 복구할 수 없습니다."
    );
    if (!ok) return;

    try {
      setDeleting(true);
      await deleteAdminNotice(noticeId);

      // 삭제 성공 → 목록으로
      navigate("/notices", { replace: true });
    } catch (e) {
      const err = e as AxiosError<ApiErrorResponse>;
      const msg =
        err.response?.data?.message ||
        err.message ||
        "삭제 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded bg-gray-200" />
          <div className="h-6 w-10 rounded bg-gray-200" />
        </div>
        <div className="h-10 w-3/4 rounded bg-gray-200" />
        <div className="h-5 w-48 rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <div>
      {/* 뱃지 & D-Day 라인 */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`px-2.5 py-1 text-xs font-bold rounded-md ${badgeStyle}`}
        >
          {statusText}
        </span>
        {dDayText && (
          <span
            className={`text-sm font-bold ${
              isUrgent ? "text-red-500" : "text-gray-500"
            }`}
          >
            {dDayText}
          </span>
        )}
      </div>

      {/* 타이틀 & 버튼들 */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
          {title}
        </h1>

        <div className="flex shrink-0 gap-2">
          {/* 수정/삭제 버튼 (관리자만) */}
          {isAdmin && noticeId && (
            <>
              <button
                type="button"
                onClick={onUpdate}
                className="h-10 inline-flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-100 px-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
                title="공고 수정"
              >
                <span className="material-symbols-outlined text-[20px]">
                  edit
                </span>
                수정
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                className={[
                  "h-10 inline-flex items-center gap-1.5 rounded-full border px-3 text-sm font-semibold transition-all active:scale-95",
                  deleting
                    ? "bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200",
                ].join(" ")}
                title="공고 삭제"
              >
                <span className="material-symbols-outlined text-[20px]">
                  delete
                </span>
                {deleting ? "삭제 중..." : "삭제"}
              </button>
            </>
          )}

          {/* 찜 버튼 */}
          <button
            onClick={onFavorite}
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100 transition-all hover:bg-red-50 hover:border-red-100 active:scale-95"
            title={isFavorite ? "관심 공고 해제" : "관심 공고 등록"}
          >
            <span
              className={`material-symbols-outlined text-[22px] transition-colors ${
                isFavorite
                  ? "text-red-500"
                  : "text-gray-400 group-hover:text-red-400"
              }`}
              style={{ fontVariationSettings: `'FILL' ${isFavorite ? 1 : 0}` }}
            >
              favorite
            </span>
          </button>

          {/* 공유 버튼 */}
          <button
            onClick={onShare}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
            title="공유하기"
          >
            <span className="material-symbols-outlined text-[22px]">share</span>
          </button>
        </div>
      </div>

      {/* 기간 표시 */}
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 font-medium">
        <span className="material-symbols-outlined text-[18px]">
          calendar_today
        </span>
        {startDate} ~ {endDate}
      </div>
    </div>
  );
}
