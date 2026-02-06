type PreferenceHeaderProps = {
  category: string;
  currentIndex: number; // 0-based
  total: number;
};

export default function PreferenceHeader({
  category,
  currentIndex,
  total,
}: PreferenceHeaderProps) {
  const safeTotal = Math.max(1, total);
  const safeIndex = Math.min(Math.max(0, currentIndex), safeTotal - 1);

  const currentNumber = safeIndex + 1;
  const progress = Math.round((currentNumber / safeTotal) * 100);

  return (
    <section className="w-full mb-5">
      {/* Category */}
      <div className="text-center text-sm font-semibold text-gray-700">
        PART {currentNumber}. {category}
      </div>

      {/* Card */}
      <div className="mt-4 bg-white w-full max-w-3xl mx-auto rounded-3xl px-8 md:px-12 py-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-black/5">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-primary">
              Q{currentNumber}
            </span>
            <span className="text-xl font-extrabold text-gray-300">
              / Q{safeTotal}
            </span>
          </div>

          <div className="text-sm font-semibold text-gray-500">
            {progress}% 완료
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-3 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
            aria-label="progress"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
      </div>
    </section>
  );
}
