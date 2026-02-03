type Props = {
  submitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function NoticeCreateActions({
  submitting,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <div className="mt-8 rounded-[20px] bg-white p-6 border border-gray-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="h-14 w-full rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors sm:w-40"
          disabled={submitting}
        >
          취소
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="h-14 w-full rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors sm:flex-1"
          disabled={submitting}
        >
          {submitting ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}
