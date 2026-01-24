type QuizResultCorrectProps = {
  correctAnswer?: string;
  explanation?: string;
  onNext: () => void;
  nextLabel?: string;
};

export default function QuizResultCorrect({
  correctAnswer,
  explanation,
  onNext,
  nextLabel = "다음 문제로 이동",
}: QuizResultCorrectProps) {
  return (
    <>
      {/* Result Card */}
      <div className="bg-white w-full rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden">
        
        {/* Success Icon (Double Circle Effect) */}
        <div className="mb-6 relative flex items-center justify-center w-24 h-24">
          {/* Outer Faint Circle */}
          <div className="absolute w-24 h-24 bg-green-50 rounded-full"></div>
          {/* Inner Circle */}
          <div className="relative w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-green-500 text-4xl">
              check
            </span>
          </div>
        </div>

        {/* Title - Reduced Size */}
        <h4 className="text-xl font-bold text-green-500 mb-8">
          정답입니다!
        </h4>

        {/* Answer Display */}
        <div className="flex flex-col items-center mb-10 w-full">
          <span className="text-xs text-gray-400 mb-2 font-medium">입력한 정답</span>
          <p className="text-3xl md:text-4xl font-black text-gray-900 break-keep leading-tight">
            {correctAnswer ?? "-"}
          </p>
        </div>

        {/* Explanation Box - Light Green & Gradient Top */}
        <div className="w-full bg-[#F7FBF9] rounded-2xl p-6 text-left relative overflow-hidden">

          {/* Content Container (z-10 to sit above gradient) */}
          <div className="relative z-10">
            {/* Box Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-green-600 text-lg">
                menu_book
              </span>
              <span className="font-bold text-gray-800 text-sm">해설</span>
            </div>

            {/* Explanation Content (Removed play_arrow) */}
            <p className="text-sm text-gray-600 leading-relaxed text-justify break-keep whitespace-pre-line">
              {explanation ?? "해설 정보가 없습니다."}
            </p>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={onNext}
        className="w-full py-5 px-8 rounded-4xl bg-green-500 text-white text-lg font-bold 
                   shadow-[0_4px_15px_rgba(34,197,94,0.4)] 
                   hover:brightness-105 active:scale-[0.98] transition-all
                   flex items-center justify-center gap-2 mt-6"
      >
        {nextLabel}
        <span className="material-symbols-outlined text-2xl">
          arrow_forward
        </span>
      </button>
    </>
  );
}
