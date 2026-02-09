type ChatComposerProps = {
  input: string;
  isSending: boolean;
  isDisabled: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
};

export default function ChatComposer({
  input,
  isSending,
  isDisabled,
  onInputChange,
  onSend,
}: ChatComposerProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gray-50 pb-6 pt-2">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="rounded-2xl bg-white shadow-lg border border-black/5 px-4 py-4">
          <div className="flex items-center gap-3">
            <input
              value={input}
              readOnly={isSending || isDisabled}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  (e.target as HTMLInputElement).blur(); // 엔터 입력 시에도 포커스 해제
                  onSend();
                }
              }}
              placeholder={
                isDisabled
                  ? "원하는 주제를 선택해주세요."
                  : isSending
                  ? "답변을 생성 중입니다..."
                  : "메시지를 입력하세요"
              }
              className="flex-1 h-11 rounded-xl bg-black/5 px-4 text-[14px] outline-none
                         focus:bg-white transition
                         read-only:opacity-50 read-only:bg-gray-100 read-only:cursor-not-allowed"
            />

            <button
              type="button"
              disabled={isSending || isDisabled}
              onClick={(e) => {
                e.currentTarget.blur();
                onSend();
              }}
              className="w-11 h-11 rounded-full bg-primary text-white 
                        flex justify-center items-center shrink-0
                        hover:opacity-90 active:scale-95 transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="전송"
            >
              <span className="material-symbols-outlined text-[24px] leading-none font-bold">
                arrow_upward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}