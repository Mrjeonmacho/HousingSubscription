import { useCallback, useEffect, useRef, useState } from "react";
import type { AxiosError } from "axios";
import { apiClient } from "../../api/axiosConfig";
import ChatMessageItem from "../chatbot/ChatMessageItem";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  type: "text" | "announcement";
  text: string;
  createdAt: string;
};

type Props = {
  noticeTitle?: string;
  noticeId?: number | null;
};

// type QuickAction = {
//   icon: string;
//   label: string;
// };

// const QUICK_ACTIONS: QuickAction[] = [
//   { icon: "campaign", label: "최근 공고" },
//   { icon: "check_circle", label: "자격 요건" },
//   { icon: "description", label: "신청 방법" },
//   { icon: "calculate", label: "임대료 계산" },
// ];

async function postChat(message: string, noticeId?: number | null): Promise<string> {
  const payload = {
    message,
    noticeId: noticeId ?? null,
  };
  const res = await apiClient.post<{ message: string }>("/chatbot/chat", payload);
  return res.data.message;
}

function toErrorText(err: unknown): string {
  if (err && typeof err === "object" && "isAxiosError" in err) {
    const axiosErr = err as AxiosError<{ message?: string; code?: string }>;
    if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
    if (axiosErr.response?.status) return `오류 발생 (HTTP ${axiosErr.response.status})`;
  }
  return "요청 처리 중 오류가 발생했습니다.";
}

export default function NoticeChatbotPanel({ noticeTitle, noticeId }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // 스크롤 컨테이너를 잡기 위한 Ref 생성
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // todo: 초기 안내 메시지
  useEffect(() => {
    setMessages([
      {
        id: "intro",
        role: "assistant",
        type: "text",
        text: `안녕하세요! ${noticeTitle ? `'${noticeTitle}'` : "이 공고"}에 대해 궁금한 점이 있으신가요?\n입주 자격이나 신청 방법에 대해 무엇이든 물어보세요!`,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [noticeTitle]);

  // 메시지가 추가될 때 "챗봇 영역 내부만" 스크롤되도록 변경
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendText = useCallback(
    async (raw: string) => {
      const value = raw.trim();
      if (!value || isSending) return;

      setIsSending(true);

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        type: "text",
        text: value,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

      try {
        const answer = await postChat(value, noticeId);
        
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          type: "text",
          text: answer,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (e) {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: "assistant",
          type: "text",
          text: toErrorText(e),
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsSending(false);
      }
    },
    [isSending, noticeId]
  );

  return (
    <div className="flex h-full flex-col bg-[#F8F9FA]">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
            <span className="material-symbols-outlined">smart_toy</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">AI 어시스턴트</h2>
          </div>
        </div>
      </header>

      {/* 채팅 목록 */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide"
      >
        {messages.map((m) => (
          <ChatMessageItem key={m.id} message={m} />
        ))}
        {isSending && (
          <div className="flex justify-start">
             <div className="mr-3 mt-1 h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-green-600">smart_toy</span>
             </div>
             <div className="bg-white rounded-2xl px-4 py-3 border border-black/5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}/>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}/>
             </div>
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div className="bg-white border-t border-gray-100 p-4">
        {/* <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {QUICK_ACTIONS.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={isSending}
              onClick={() => handleSendText(item.label)}
              className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 hover:bg-green-50 hover:text-green-700 transition text-xs text-gray-700 border border-transparent hover:border-green-100"
            >
              <span className="material-symbols-outlined text-[16px] leading-none text-primary">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div> */}

        <div className="flex items-center gap-2">
          <input
            value={input}
            disabled={isSending}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSendText(input);
              }
            }}
            placeholder={isSending ? "답변을 생성 중입니다..." : "메시지를 입력하세요"}
            className="flex-1 h-11 rounded-xl bg-gray-50 px-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-green-500/30 transition border border-transparent focus:border-green-500/30"
          />
          <button
            type="button"
            disabled={isSending || !input.trim()}
            onClick={() => handleSendText(input)}
            className="h-11 w-11 rounded-xl bg-[#00D179] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}