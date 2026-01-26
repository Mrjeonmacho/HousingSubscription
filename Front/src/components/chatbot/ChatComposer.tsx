type QuickAction = {
  icon: string;
  label: string;
};

type ChatComposerProps = {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onQuickAction: (label: string) => void;
};

const QUICK_ACTIONS: QuickAction[] = [
  { icon: "campaign", label: "최근 공고" },
  { icon: "check_circle", label: "자격 요건" },
  { icon: "description", label: "신청 방법" },
  { icon: "calculate", label: "임대료 계산" },
];

export default function ChatComposer({
  input,
  onInputChange,
  onSend,
  onQuickAction,
}: ChatComposerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent pb-6">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="rounded-2xl bg-white shadow-lg border border-black/5 px-4 py-4">
          {/* Quick actions */}
          <div className="flex gap-2 overflow-x-auto pb-3">
            {QUICK_ACTIONS.map(item => (
              <button
                key={item.label}
                type="button"
                className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/5 hover:bg-black/10 transition text-[12px] text-gray-700"
                onClick={() => onQuickAction(item.label)}
              >
                <span className="material-symbols-outlined text-[16px] leading-none text-primary">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={e => onInputChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") onSend();
              }}
              placeholder="메시지를 입력하세요"
              className="flex-1 h-11 rounded-xl bg-black/5 px-4 text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-primary/30 transition"
            />

            <button
              type="button"
              onClick={onSend}
              className="h-11 px-5 rounded-xl bg-primary text-white font-semibold inline-flex items-center gap-2 hover:opacity-95 active:opacity-90 transition"
            >
              전송
              <span className="material-symbols-outlined text-[18px] leading-none">
                send
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
