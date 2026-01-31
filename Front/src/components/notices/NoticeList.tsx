// Front\src\components\notices\NoticeList.tsx => 리스트(로딩/빈 상태/맵)
import type { Notice } from "../../pages/NoticesPage";
import NoticeListItem from "./NoticeListItem";

type Props = {
  loading: boolean;
  items: Notice[];
  isFavorite: (id: number) => boolean;
  isPending: (id: number) => boolean;
  onOpen: (id: number) => void;
  onToggleFavorite: (id: number) => void;
};

function SkeletonRow() {
  return (
    <div className="px-6 py-5 bg-white">
      <div className="grid grid-cols-[84px_1fr_92px_64px] items-center">
        <div className="flex items-center justify-center px-2">
          <div className="h-5 w-12 rounded bg-gray-100 animate-pulse" />
        </div>

        <div className="min-w-0 px-4">
          <div className="mb-2 h-5 w-20 rounded bg-gray-100 animate-pulse" />
          <div className="mb-2 h-6 w-3/4 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
        </div>

        <div className="flex justify-center px-2">
          <div className="h-5 w-12 rounded bg-gray-100 animate-pulse" />
        </div>

        <div className="flex justify-center px-2">
          <div className="h-6 w-6 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function NoticeList({
  loading,
  items,
  isFavorite,
  isPending,
  onOpen,
  onToggleFavorite,
}: Props) {
  if (loading) {
    return (
      <div className="divide-y divide-gray-100 border-b border-gray-100">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border-b border-gray-100 bg-white px-6 py-12 text-center text-gray-500">
        표시할 공고가 없습니다.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 border-b border-gray-100">
      {items.map((n) => (
        <NoticeListItem
          key={n.id}
          notice={n}
          isFavorite={isFavorite(n.id)}
          isPending={isPending(n.id)}
          onOpen={onOpen}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
