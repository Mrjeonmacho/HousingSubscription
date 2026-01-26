type Props = {
  totalCount: number;
  correctCount: number;
  onRestart: () => void;
};

export default function QuizResultDone({ totalCount, correctCount, onRestart }: Props) {
  return (
    <section className="w-full rounded-3xl bg-white shadow-sm border border-black/5 px-10 py-12 text-center">
      <div className="mx-auto w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-green-500"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            thumb_up
        </span>
      </div>

      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
        오늘의 퀴즈 완료!
      </h2>

      <p className="mt-3 text-gray-600">
        총 {totalCount}문항 중 <span className="font-semibold text-gray-900">{correctCount}</span>문항을 맞히셨어요.
      </p>

      <button
        type="button"
        onClick={onRestart}
        className="mt-10 inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-white font-semibold hover:opacity-90 transition"
      >
        다시 풀기
      </button>
    </section>
  );
}
