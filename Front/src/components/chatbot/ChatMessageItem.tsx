import type { ChatMessage } from "../../data/chat";

type ChatMessageItemProps = {
  message: ChatMessage;
};

function formatKoreanTime(isoString: string) {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";

  // 예: "오전 10:02"
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export default function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const timeLabel = formatKoreanTime(message.createdAt);

  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      {!isUser ? (
        <div className="mr-3 mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px] leading-none text-primary">
            smart_toy
          </span>
        </div>
      ) : null}

      <div className={isUser ? "max-w-[70%]" : "max-w-[74%]"}>
        {!isUser ? (
          <div className="text-[12px] text-gray-500 mb-2">Seoul Jibsa AI</div>
        ) : null}

        <div
          className={
            isUser
              ? "bg-primary text-white rounded-2xl px-4 py-3 shadow-sm"
              : "bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-sm border border-black/5"
          }
        >
          <div className="whitespace-pre-line text-[14px] leading-6">
            {message.text}
          </div>
        </div>

        {/* Time */}
        {timeLabel ? (
          <div
            className={
              isUser
                ? "mt-2 text-right text-[11px] text-gray-400"
                : "mt-2 text-left text-[11px] text-gray-400"
            }
          >
            {timeLabel}
          </div>
        ) : null}
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
