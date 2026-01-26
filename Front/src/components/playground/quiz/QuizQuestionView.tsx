type QuizQuestionViewProps = {
  question?: string;
  answer: string;
  onChangeAnswer: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export default function QuizQuestionView({
  question,
  answer,
  onChangeAnswer,
  onSubmit,
  disabled = false,
}: QuizQuestionViewProps) {
  return (
    <>
      {/* Question Card */}
      <div className="bg-white w-full rounded-3xl p-10 md:p-16 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="mb-8 w-16 h-16 bg-green-50 rounded-4xl flex items-center justify-center">
          <span className="material-symbols-outlined text-green-600 text-4xl">
            quiz
          </span>
        </div>

        <h4 className="text-xl md:text-2xl font-bold leading-relaxed break-keep max-w-2xl text-gray-800">
          {question ?? "문제를 불러오는 중입니다."}
        </h4>
      </div>

      {/* Answer Input Area */}
      <div className="w-full flex flex-col gap-4 mt-6">
        {/* Input Field */}
        <input
          type="text"
          value={answer}
          onChange={(e) => onChangeAnswer(e.target.value)}
          placeholder="정답을 입력해주세요"
          disabled={disabled}
          className="w-full px-8 py-5 rounded-4xl bg-white 
                     shadow-[0_4px_15px_rgba(0,0,0,0.05)] 
                     outline-none border-none focus:ring-0
                     text-xl font-bold text-gray-800 placeholder:text-gray-300
                     transition-all disabled:opacity-50"
        />

        {/* Submit Button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !answer.trim()}
          className="w-full py-5 rounded-4xl bg-green-500 text-white text-xl font-bold
                     shadow-[0_4px_15px_rgba(34,197,94,0.4)] 
                     hover:brightness-105 active:scale-[0.98] 
                     transition-all disabled:opacity-50 disabled:shadow-none disabled:bg-gray-300"
        >
          정답 확인
        </button>
      </div>
    </>
  );
}