// Front/src/components/noticeDetail/NoticeQuickLinksCard.tsx

type Props = {
  loading: boolean;
  pdf: string | null;
  url: string | null;
};

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
        fontVariationSettings:
          "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}

function safeExternalOpen(link: string) {
  window.open(link, "_blank", "noopener,noreferrer");
}

function SkeletonCard() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 h-4 w-36 rounded bg-gray-100 animate-pulse" />
      <div className="space-y-3">
        <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse" />
        <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse" />
      </div>
    </section>
  );
}

export default function NoticeQuickLinksCard({ loading, pdf, url }: Props) {
  if (loading) return <SkeletonCard />;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        첨부 파일 및 바로가기
      </h3>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => pdf && safeExternalOpen(pdf)}
          disabled={!pdf}
          className="w-full rounded-xl bg-green-400 px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
        >
          <span className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/70">
              <MaterialIcon name="description" className="text-gray-800" />
            </span>
            모집 공고문 PDF 바로가기
          </span>
          <MaterialIcon name="open_in_new" className="text-gray-800" />
        </button>

        <button
          type="button"
          onClick={() => url && safeExternalOpen(url)}
          disabled={!url}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
        >
          <span className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <MaterialIcon name="language" className="text-gray-700" />
            </span>
            SH 공식 홈페이지 바로가기
          </span>
          <MaterialIcon name="open_in_new" className="text-gray-700" />
        </button>
      </div>
    </section>
  );
}
