type Props = {
  page: number;              // 현재 페이지 (1부터 시작)
  totalPages: number;        // 전체 페이지 수
  onChangePage: (page: number) => void;
};

export default function Pagination({ page, totalPages, onChangePage }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <nav className="flex justify-center items-center gap-2 mt-8">
      {/* 이전 버튼 */}
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => canPrev && onChangePage(page - 1)}
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-colors",
          canPrev
            ? "border-gray-300 text-gray-600 hover:bg-gray-100"
            : "border-gray-200 text-gray-300 cursor-not-allowed",
        ].join(" ")}
        aria-label="이전 페이지"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
      </button>

      {/* 페이지 번호 */}
      {pages.map((p) => {
        const isActive = p === page;

        return (
          <button
            key={p}
            type="button"
            onClick={() => onChangePage(p)}
            className={[
              "h-10 w-10 rounded-full text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100",
            ].join(" ")}
            aria-current={isActive ? "page" : undefined}
          >
            {p}
          </button>
        );
      })}

      {/* 다음 버튼 */}
      <button
        type="button"
        disabled={!canNext}
        onClick={() => canNext && onChangePage(page + 1)}
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-colors",
          canNext
            ? "border-gray-300 text-gray-600 hover:bg-gray-100"
            : "border-gray-200 text-gray-300 cursor-not-allowed",
        ].join(" ")}
        aria-label="다음 페이지"
      >
        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
      </button>
    </nav>
  );
}
