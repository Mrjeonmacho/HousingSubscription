// Front/src/components/notices/FavoritesNoticeSection.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import type { Notice } from "../../pages/NoticesPage";
import { categoryLabel, statusLabel } from "../../utils/noticeFormat";
import { removeFavoriteNoticeByNoticeId } from "../../api/NoticeApi";

type Props = {
  items: Notice[];
};

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export default function FavoritesNoticeSection({ items }: Props) {
  const navigate = useNavigate();

  // 초기 렌더에서 props(items) 기준으로 "찜 상태"를 true로 세팅
  const initialFavoriteMap = useMemo(() => {
    const next: Record<number, boolean> = {};
    for (const n of items) next[n.id] = true;
    return next;
  }, [items]);

  const [favoriteMap, setFavoriteMap] =
    useState<Record<number, boolean>>(initialFavoriteMap);
  const [pendingMap, setPendingMap] = useState<Record<number, boolean>>({});

  const visibleItems = useMemo(() => {
    // 화면에서는 isFavorite=false 된 항목은 숨김 처리
    return items.filter((n) => favoriteMap[n.id] !== false);
  }, [items, favoriteMap]);

  const unfavorite = async (noticeId: number) => {
    if (pendingMap[noticeId]) return;

    setPendingMap((prev) => ({ ...prev, [noticeId]: true }));

    // 낙관적 업데이트: 즉시 카드 제거
    setFavoriteMap((prev) => ({ ...prev, [noticeId]: false }));

    try {
      const data = await removeFavoriteNoticeByNoticeId(noticeId);

      // 서버 응답 기준으로 최종 반영
      setFavoriteMap((prev) => ({
        ...prev,
        [data.noticeId]: data.isFavorite,
      }));
    } catch (err) {
      // 실패 시 롤백
      setFavoriteMap((prev) => ({ ...prev, [noticeId]: true }));

      const ax = err as AxiosError<ApiErrorResponse>;
      const status = ax.response?.status;
      const msg =
        ax.response?.data?.message ??
        (status === 404
          ? "존재하지 않는 공고이거나 이미 삭제된 공고입니다"
          : "내부 서버 오류입니다.");

      alert(msg);
    } finally {
      setPendingMap((prev) => ({ ...prev, [noticeId]: false }));
    }
  };

  return (
    <section className="mt-16">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900">내가 찜한 공고</h2>
      </div>

      {/* Empty State */}
      {visibleItems.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-400">아직 찜한 공고가 없습니다.</p>
        </div>
      ) : (
        /* List */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {visibleItems.map((notice) => {
            const isPending = Boolean(pendingMap[notice.id]);

            return (
              <div
                key={notice.id}
                onClick={() => navigate(`/notices/${notice.id}`)}
                className="relative cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Category */}
                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {categoryLabel(notice.category)}
                </span>

                {/* Favorite Icon */}
                <button
                  type="button"
                  className="absolute right-6 top-6 text-gray-300 hover:text-red-500 disabled:opacity-60"
                  aria-label="찜 해제"
                  disabled={isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    unfavorite(notice.id);
                  }}
                >
                  ❤
                </button>

                {/* Title */}
                <h3 className="mt-4 line-clamp-2 text-base font-semibold text-gray-900">
                  {notice.title}
                </h3>

                {/* Status */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">
                    {statusLabel(notice.status)}
                  </span>
                  <span className="text-gray-300">→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
