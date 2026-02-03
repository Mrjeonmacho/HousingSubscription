import type { ChatMessage } from "../../data/chat";

type ChatMessageItemProps = {
  message: ChatMessage;
};

// 볼드체 및 줄바꿈 처리 함수
const formatText = (text: string) => {
  // 1. 줄바꿈(\n)을 기준으로 먼저 나누고
  // 2. 각 줄마다 **로 감싸진 부분을 찾아서 <strong> 태그로 변환
  return text.split("\n").map((line, i) => (
    <span key={i} className="block min-h-[1.2em]">
      {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          // **로 감싸진 부분 -> 볼드체 적용
          return (
            <strong key={j} className="font-bold text-gray-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        // 일반 텍스트
        return part;
      })}
    </span>
  ));
};

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isAnnouncement = message.type === "announcement";

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      {isAssistant ? (
        <div className="mr-3 mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px] leading-none text-primary">
            smart_toy
          </span>
        </div>
      ) : null}

      <div className={isUser ? "max-w-[70%]" : "max-w-[74%]"}>
        {isAssistant ? (
          <div className="text-[12px] text-gray-500 mb-2">Seoul Jibsa AI</div>
        ) : null}

        <div
          className={
            isUser
              ? "bg-primary text-white rounded-2xl px-4 py-3 shadow-sm"
              : isAnnouncement
              ? "bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-sm border border-black/10 ring-1 ring-primary/10"
              : "bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-sm border border-black/5"
          }
        >
          <div className="whitespace-pre-line text-[14px] leading-6">
            {formatText(message.text)}
          </div>
        </div>

      </div>

      {isUser ? (
        <div className="ml-3 mt-1 h-8 w-8 rounded-full bg-black/5 flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px] leading-none text-gray-600">
            person
          </span>
        </div>
      ) : null}
    </div>
  );
}
