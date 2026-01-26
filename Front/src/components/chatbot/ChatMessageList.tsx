import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../data/chat";
import ChatMessageItem from "./ChatMessageItem";

type ChatMessageListProps = {
  messages: ChatMessage[];
};

export default function ChatMessageList({ messages }: ChatMessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <main className="pt-8 pb-56">
      <div className="space-y-10">
        {messages.map(m => (
          <ChatMessageItem key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </div>
    </main>
  );
}
