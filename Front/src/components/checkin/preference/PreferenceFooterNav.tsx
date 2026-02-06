type PreferenceFooterNavProps = {
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  nextLabel?: string;
};

export default function PreferenceFooterNav({
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  nextLabel = "다음 질문으로",
}: PreferenceFooterNavProps) {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 mt-2">
      <div className="flex items-center gap-6">
        {/* Prev */}
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className={[
            "flex items-center justify-center gap-3",
            "h-14 w-[42%] rounded-3xl",
            "border border-gray-200 bg-white",
            "text-gray-700 font-semibold",
            "transition-colors",
            canGoPrev ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed",
          ].join(" ")}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          이전으로
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className={[
            "flex items-center justify-center gap-3",
            "h-14 flex-1 rounded-3xl",
            "font-semibold transition-all",
            canGoNext
              ? "bg-primary text-gray-900 shadow-[0_10px_30px_rgba(15,230,104,0.35)] hover:brightness-95"
              : "bg-gray-200 text-gray-500 cursor-not-allowed",
          ].join(" ")}
        >
          {nextLabel}
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
