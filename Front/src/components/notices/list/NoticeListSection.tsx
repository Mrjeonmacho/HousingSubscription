// Front/src/components/notices/list/NoticeListSection.tsx => 공고 테이블 섹션(레이아웃)
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import type { Notice } from "../../../pages/NoticesPage";
import { useNavigate } from "react-router-dom";
import {
  addFavoriteNotice,
  getFavoriteNotices,
  removeFavoriteNotice,
} from "../../../api/NoticeApi";
import NoticeList from "./NoticeList";
import NoticeListHeaderRow from "./NoticeListHeaderRow";

type Props = {
  items: Notice[];
  loading: boolean;
  errorMessage: string | null;
  onChangedFavorites?: () => void;
  favoritesVersion?: number;
};

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

function pickNoticeIdFromFavorite(fav: unknown): number | null {
  if (!fav || typeof fav !== "object") return null;
  const f = fav as Record<string, unknown>;

  // 백엔드가 noticeId로 주는 경우도 커버
  const noticeId = f.noticeId;
  if (typeof noticeId === "number") return noticeId;

  // 기존: id가 noticeId인 경우
  const id = f.id;
  if (typeof id === "number") return id;

  return null;
}

export default function NoticeListSection({
  items,
  loading,
  errorMessage,
  onChangedFavorites,
  favoritesVersion,
}: Props) {
  const navigate = useNavigate();

  const [favoriteMap, setFavoriteMap] = useState<Record<number, boolean>>({});
  const [favoritePending, setFavoritePending] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const list = await getFavoriteNotices();
        if (ignore) return;

        const next: Record<number, boolean> = {};
        for (const fav of list) {
          const noticeId = pickNoticeIdFromFavorite(fav);
          if (typeof noticeId === "number") next[noticeId] = true;
        }
        setFavoriteMap(next);
      } catch (err) {
        const ax = err as AxiosError<ApiErrorResponse>;
        const status = ax.response?.status;
        if (status === 401 || status === 403) {
          setFavoriteMap({});
        }
      }
    })();

    return () => {
      ignore = true;
    };
  }, [favoritesVersion]);

  const toggleFavorite = async (noticeId: number) => {
    if (favoritePending[noticeId]) return;

    const currently = Boolean(favoriteMap[noticeId]);

    setFavoritePending((prev) => ({ ...prev, [noticeId]: true }));
    setFavoriteMap((prev) => ({ ...prev, [noticeId]: !currently }));

    try {
      const data = currently
        ? await removeFavoriteNotice(noticeId)
        : await addFavoriteNotice(noticeId);

      setFavoriteMap((prev) => ({
        ...prev,
        [data.noticeId]: data.isFavorite,
      }));

      onChangedFavorites?.();
    } catch (err) {
      setFavoriteMap((prev) => ({ ...prev, [noticeId]: currently }));

      const ax = err as AxiosError<ApiErrorResponse>;
      const status = ax.response?.status;
      const msg = ax.response?.data?.message ?? "요청 처리 중 오류가 발생했습니다.";

      if (status === 401 || status === 403) {
        alert("로그인이 필요합니다.");
        return;
      }
      if (status === 409) {
        alert(msg);
        setFavoriteMap((prev) => ({ ...prev, [noticeId]: true }));
        return;
      }
      alert(msg);
    } finally {
      setFavoritePending((prev) => ({ ...prev, [noticeId]: false }));
    }
  };

  return (
    <section className="space-y-4">
      {errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="border-t border-gray-200">
        <NoticeListHeaderRow />

        <div className="divide-y divide-gray-100">
          <NoticeList
            loading={loading}
            items={items}
            isFavorite={(id) => Boolean(favoriteMap[id])}
            isPending={(id) => Boolean(favoritePending[id])}
            onOpen={(id) => navigate(`/notices/${id}`)}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </div>
    </section>
  );
}
