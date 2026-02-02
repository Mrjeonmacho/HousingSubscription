type QuizResultWrongProps = {
  answer?: string;
  correctAnswer?: string;
  explanation?: string;
  onNext: () => void;
  nextLabel?: string;
  errorMessage?: string;
};

export default function QuizResultWrong({
  answer,
  correctAnswer,
  explanation,
  onNext,
  nextLabel = "다음 문제로 이동",
  errorMessage,
}: QuizResultWrongProps) {
  return (
    <>
      {/* Result Card */}
      <div className="bg-white w-full rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden">
        
        {/* Fail Icon (Double Circle Effect - Red) */}
        <div className="mb-6 relative flex items-center justify-center w-24 h-24">
          {/* Outer Faint Circle */}
          <div className="absolute w-24 h-24 bg-red-50 rounded-full"></div>
          {/* Inner Circle */}
          <div className="relative w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-red-500 text-4xl">
              close
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-xl font-bold text-red-500 mb-8">
          아쉽네요, 오답입니다.
        </h4>

        {/* Answer Comparison (Side by Side) */}
        <div className="flex w-full justify-center gap-4 md:gap-12 mb-10">
            {/* User's Answer */}
            <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-gray-400 mb-2 font-medium">내가 선택한 답</span>
                {/* decoration-gray-400으로 취소선 색상을 회색으로 변경했습니다. */}
                <p className="text-xl md:text-2xl font-bold text-gray-400 break-keep line-through decoration-gray-400 decoration-2">
                    {answer ?? "-"}
                </p>
            </div>

            {/* Separator Line */}
            <div className="w-[1px] h-12 bg-gray-100 my-auto"></div>

            {/* Correct Answer */}
             <div className="flex flex-col items-center flex-1">
                <span className="text-xs text-green-500 mb-2 font-bold">진짜 정답</span>
                <p className="text-xl md:text-2xl font-black text-gray-900 break-keep">
                    {correctAnswer ?? "-"}
                </p>
            </div>
        </div>

        {/* Error Message or Explanation Box */}
        {errorMessage ? (
           <div className="w-full bg-red-50 rounded-2xl p-6 text-left">
             <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-red-500 text-lg">
                  error
                </span>
                <span className="font-bold text-red-700 text-sm">오류 발생</span>
             </div>
             <p className="text-sm text-red-600 leading-relaxed">
               {errorMessage}
             </p>
           </div>
        ) : (
          /* Explanation Box */
          /* bg-gray-50으로 배경색을 연한 회색으로 변경했습니다. */
          <div className="w-full bg-gray-50 rounded-2xl p-6 text-left relative overflow-hidden">
             <div className="relative z-10">
                {/* Box Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-green-600 text-lg">
                    info
                  </span>
                  <span className="font-bold text-gray-800 text-sm">알아두면 좋은 해설</span>
                </div>

                {/* Explanation Content */}
                <p className="text-sm text-gray-600 leading-relaxed text-justify break-keep whitespace-pre-line">
                  {explanation ?? "해설 정보가 없습니다."}
                </p>
             </div>
          </div>
        )}
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
