type QuizOption = {
  optionId: number;
  text: string;
};

type QuizQuestionViewProps = {
  question?: string;
  options: QuizOption[];
  selectedOptionId: number | null;
  onChangeOption: (optionId: number) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export default function QuizQuestionView({
  question,
  options,
  selectedOptionId,
  onChangeOption,
  onSubmit,
  disabled = false,
}: QuizQuestionViewProps) {
  const canSubmit = !disabled && selectedOptionId != null;

  return (
    <>
      {/* Question Card */}
      <div className="bg-white w-full rounded-3xl p-10 md:p-16 flex flex-col items-center text-center shadow-[0_10px_40px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="mb-8 w-16 h-16 bg-primary/10 rounded-4xl flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-4xl">
            quiz
          </span>
        </div>

        <h4 className="text-xl md:text-2xl font-bold leading-relaxed break-keep max-w-2xl text-gray-800">
          {question ?? "문제를 불러오는 중입니다."}
        </h4>
      </div>

      {/* Options + Submit */}
      <div className="w-full flex flex-col gap-4 mt-6">
        {/* Options */}
        <div className="w-full flex flex-col gap-3">
          {options.length === 0 ? (
            <div className="w-full px-8 py-5 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-gray-100 text-gray-400 text-sm text-center">
              보기를 불러오는 중입니다.
            </div>
          ) : (
            options.map((opt) => {
              const selected = selectedOptionId === opt.optionId;

              return (
                <button
                  key={opt.optionId}
                  type="button"
                  disabled={disabled}
                  onClick={() => onChangeOption(opt.optionId)}
                  className={[
                    "w-full text-left px-6 py-5 rounded-2xl border transition-all duration-200 ease-in-out relative group",
                    "active:scale-[0.99]",
                    disabled ? "opacity-50 cursor-not-allowed" : (selected ? "" : "hover:border-primary/30 hover:bg-gray-50"),
                    selected
                      ? "bg-primary/5 border-primary shadow-md shadow-primary/10 z-10"
                      : "bg-white border-gray-100 shadow-[0_2px_5px_rgba(0,0,0,0.03)]",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={[
                        "mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200",
                        selected
                          ? "bg-primary border-primary"
                          : "bg-white border-gray-300 group-hover:border-primary/50",
                      ].join(" ")}
                    >
                      {selected && (
                        <span className="material-symbols-outlined text-white text-[14px] font-bold">
                          check
                        </span>
                      )}
                    </div>

                    {/* Option Text */}
                    <p className={[
                      "text-lg md:text-xl break-keep leading-snug transition-all",
                      selected ? "font-bold text-primary" : "font-medium text-gray-700"
                    ].join(" ")}>
                      {opt.text}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Submit Button (레이아웃 유지, 색상만 primary 대응) */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full py-5 rounded-4xl bg-primary text-white text-xl font-bold
                     shadow-[0_4px_15px_rgba(0,0,0,0.1)]
                     hover:brightness-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] active:scale-[0.98]
                     transition-all disabled:opacity-50 disabled:shadow-none disabled:bg-gray-300"
        >
          정답 확인
        </button>
      </div>
    </>
  );
}