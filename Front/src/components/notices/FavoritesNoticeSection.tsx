// Front/src/components/notices/FavoritesNoticeSection.tsx

type FavoriteNotice = {
  id: number;
  no: string;
  title: string;
  category: string;
  reg_date: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  pdf: string | null;
  url: string;
};

type Props = {
  items: FavoriteNotice[];
};

export default function FavoritesNoticeSection({ items }: Props) {
  return (
    <section className="mt-16">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900">
          내가 찜한 공고
        </h2>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-400">
            아직 찜한 공고가 없습니다.
          </p>
        </div>
      ) : (
        /* List */
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((notice) => (
            <div
              key={notice.id}
              className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* Category */}
              <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {notice.category}
              </span>

              {/* Favorite Icon */}
              <button
                type="button"
                className="absolute right-6 top-6 text-gray-300 hover:text-red-500"
                aria-label="찜 해제"
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
                  {notice.status}
                </span>
                <span className="text-gray-300">→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
