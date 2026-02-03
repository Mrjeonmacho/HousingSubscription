import { useEffect } from "react";
import type { ChatMessage } from "../../data/chat";
import ChatMessageItem from "./ChatMessageItem";

type QuickActionItem = {
  label: string;
  value: string;
};

type ChatMessageListProps = {
  messages: ChatMessage[];
  quickActions: QuickActionItem[];
  onQuickAction: (label: string, value: string) => void;
  isSending: boolean;
};

export default function ChatMessageList({
  messages,
  quickActions,
  onQuickAction,
  isSending,
}: ChatMessageListProps) {
  
  useEffect(() => {
    if (messages.length <= 1 && !isSending) return;

    // 메시지가 추가되거나 버튼이 바뀌면 "문서 전체의 맨 밑"으로 부드럽게 이동
    const timer = setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight, // 문서의 전체 높이만큼 내림
        behavior: "smooth",
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [messages.length, quickActions, isSending]);

  return (
    <main className="pt-8 pb-40">
      <div className="space-y-6">
        {messages.map((m) => (
          <ChatMessageItem key={m.id} message={m} />
        ))}

        {isSending && (
          <div className="flex justify-start animate-pulse">
             <div className="mr-3 mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] leading-none text-primary">
                smart_toy
              </span>
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-black/5">
              <span className="text-gray-400 text-sm">답변을 작성하고 있어요...</span>
            </div>
          </div>
        )}

        {!isSending && quickActions.length > 0 && (
          <div className="flex flex-col items-start gap-2 pl-11 -mt-4 animate-fade-in-up">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  // 포커스 튐 방지
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.currentTarget.blur(); 
                    onQuickAction(item.label, item.value);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-primary/20 shadow-sm
                             text-primary text-[13px] font-semibold
                             hover:bg-primary hover:text-white hover:border-primary
                             transition-all active:scale-95 text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}