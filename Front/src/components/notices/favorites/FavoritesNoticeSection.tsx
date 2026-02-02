import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

import type { Notice } from "../../../pages/NoticesPage";
import { removeFavoriteNotice } from "../../../api/NoticeApi";
import FavoritesNoticeCard from "./FavoritesNoticeCard";

type Props = {
  items: Notice[];
  onChangedFavorites?: () => void;
};

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export default function FavoritesNoticeSection({
  items,
  onChangedFavorites,
}: Props) {
  const navigate = useNavigate();

  const initialFavoriteMap = useMemo(() => {
    const next: Record<number, boolean> = {};
    for (const n of items) next[n.id] = true;
    return next;
  }, [items]);

  const [favoriteMap, setFavoriteMap] =
    useState<Record<number, boolean>>(initialFavoriteMap);
  const [pendingMap, setPendingMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setFavoriteMap(initialFavoriteMap);
  }, [initialFavoriteMap]);

  const visibleItems = useMemo(() => {
    return items.filter((n) => favoriteMap[n.id] !== false);
  }, [items, favoriteMap]);

  const unfavorite = async (noticeId: number) => {
    if (pendingMap[noticeId]) return;

    setPendingMap((prev) => ({ ...prev, [noticeId]: true }));
    setFavoriteMap((prev) => ({ ...prev, [noticeId]: false }));

    try {
      const data = await removeFavoriteNotice(noticeId);

      setFavoriteMap((prev) => ({
        ...prev,
        [data.noticeId]: data.isFavorite,
      }));

      onChangedFavorites?.();
    } catch (err) {
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

  // 캐러셀(가로 스크롤) 관련
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateNavState = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 0);
    setCanNext(el.scrollLeft < max - 1);
  };

  useEffect(() => {
    updateNavState();
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => updateNavState();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateNavState());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [visibleItems.length]);

  const scrollByCard = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;

    // 한 번에 "카드 1장 + gap" 만큼 이동
    const firstCard = el.querySelector<HTMLElement>("[data-fav-card]");
    const step = firstCard
      ? firstCard.getBoundingClientRect().width + 16 // gap-4 = 16px
      : 320;

    el.scrollBy({
      left: dir === "prev" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-16">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">내가 찜한 공고</h2>

        {/* 좌/우 버튼 */}
        {visibleItems.length > 3 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard("prev")}
              disabled={!canPrev}
              className="h-9 w-9 rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-40"
              aria-label="이전"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("next")}
              disabled={!canNext}
              className="h-9 w-9 rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-40"
              aria-label="다음"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {visibleItems.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-400">아직 찜한 공고가 없습니다.</p>
        </div>
      ) : (
        <div className="relative">
          {/* 가로 스크롤 영역 */}
          <div
            ref={scrollerRef}
            className="
              flex gap-4 overflow-x-auto scroll-smooth
              pb-2
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {visibleItems.map((notice) => {
              const isPending = Boolean(pendingMap[notice.id]);

              return (
                <FavoritesNoticeCard
                  key={notice.id}
                  notice={notice}
                  isPending={isPending}
                  onClick={() => navigate(`/notices/${notice.id}`)}
                  onUnfavorite={() => unfavorite(notice.id)}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
