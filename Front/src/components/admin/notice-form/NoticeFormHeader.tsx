type Props = {
  title: string;
  subtitle?: string;
  serverError: string | null;
  onBack: () => void;
};

export default function NoticeCreateHeader({
  title,
  subtitle,
  serverError,
  onBack,
}: Props) {
  return (
    <>
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 hover:text-gray-800 transition-colors"
        >
          <span aria-hidden>←</span>
          공고 목록으로 돌아가기
        </button>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-gray-500">{subtitle}</p>}
      </header>

      {serverError && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}
    </>
  );
}
