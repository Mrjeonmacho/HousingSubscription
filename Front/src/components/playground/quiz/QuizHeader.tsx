type QuizHeaderProps = {
  currentIndex: number; // 0-based
  totalCount: number;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
};

export default function QuizHeader({
  currentIndex,
  totalCount,
  title = "오늘의 퀴즈",
  subtitle = "주거 용어 마스터하기",
  isLoading = false,
}: QuizHeaderProps) {
  const safeTotal = Math.max(0, totalCount);
  const safeIndex = Math.max(0, Math.min(currentIndex, Math.max(safeTotal - 1, 0)));

  const displayCurrent = safeTotal > 0 ? safeIndex + 1 : 0;
  const progressPercent = safeTotal > 0 ? (displayCurrent / safeTotal) * 100 : 0;

  const rightText =
    isLoading
      ? "불러오는 중..."
      : safeTotal === 0
        ? "문제 - / -"
        : `문제 ${displayCurrent} / ${safeTotal}`;

  return (
    <div className="w-full space-y-4 mb-6">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-primary font-bold text-lg">{title}</span>
          <h3 className="text-2xl font-black mt-1">{subtitle}</h3>
        </div>

        <span className="text-sm font-bold text-gray-500">{rightText}</span>
      </div>

      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${isLoading ? 0 : progressPercent}%` }}
        />
      </div>
    </div>
  );
}
