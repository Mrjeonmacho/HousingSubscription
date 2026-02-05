// Front/src/components/noticeDetail/NoticeQuickLinksCard.tsx

type Props = {
  loading: boolean;
  pdfUrl: string | null;
  originUrl: string | null;
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
    <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="h-5 w-1.5 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-4 w-40 rounded bg-gray-100 animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse" />
        <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse" />
      </div>
    </section>
  );
}

export default function NoticeQuickLinksCard({
  loading,
  pdfUrl,
  originUrl,
}: Props) {
  if (loading) return <SkeletonCard />;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="h-5 w-1.5 rounded-full bg-primary" />
        <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">
          첨부 파일 및 바로가기
        </h3>
      </div>

      <div className="space-y-3 px-1">
        <button
          type="button"
          onClick={() => pdfUrl && safeExternalOpen(pdfUrl)}
          disabled={!pdfUrl}
          className="
            w-full rounded-2xl
            border border-primary/20
            bg-white
            px-4 py-3
            text-left
            text-sm font-semibold text-gray-900
            shadow-sm
            transition-all duration-300
            cursor-pointer
            hover:border-primary/50
            hover:bg-primary/5
            hover:shadow-md
            disabled:opacity-50
            disabled:cursor-not-allowed
            flex items-center justify-between
            group
          "
        >
          <span className="flex items-center gap-3">
            <span
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-xl
                bg-primary/10 text-primary
                transition-all duration-300
                group-hover:bg-primary group-hover:text-white
              "
            >
              <MaterialIcon name="description" className="text-[20px]" />
            </span>
            모집 공고문 PDF 바로가기
          </span>
          <MaterialIcon
            name="open_in_new"
            className="text-gray-400 transition-colors duration-300 group-hover:text-primary"
          />
        </button>

        <button
          type="button"
          onClick={() => originUrl && safeExternalOpen(originUrl)}
          disabled={!originUrl}
          className="
            w-full rounded-2xl
            border border-gray-200
            bg-white
            px-4 py-3
            text-left
            text-sm font-semibold text-gray-900
            shadow-sm
            transition-all duration-300
            cursor-pointer
            hover:border-gray-300
            hover:bg-gray-50
            hover:shadow-md
            disabled:opacity-50
            disabled:cursor-not-allowed
            flex items-center justify-between
            group
          "
        >
          <span className="flex items-center gap-3">
            <span
              className="
                inline-flex h-9 w-9 items-center justify-center rounded-xl
                bg-gray-100 text-gray-700
                transition-all duration-300
                group-hover:bg-gray-900 group-hover:text-white
              "
            >
              <MaterialIcon name="language" className="text-[20px]" />
            </span>
            SH 공식 홈페이지 바로가기
          </span>
          <MaterialIcon
            name="open_in_new"
            className="text-gray-400 transition-colors duration-300 group-hover:text-gray-700"
          />
        </button>
      </div>
    </section>
  );
}
