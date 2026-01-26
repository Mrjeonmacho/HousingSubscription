import { useMemo, useState } from "react";
import { chatMessages } from "../data/chat";
import type { ChatMessage } from "../data/chat";

import ChatComposer from "../components/chatbot/ChatComposer";
import ChatMessageList from "../components/chatbot/ChatMessageList";



export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [input, setInput] = useState("");

  const todayLabel = useMemo(() => "오늘, 11월 12일", []);

  const handleSend = () => {
    const value = input.trim();
    if (!value) return;

    const newMessage: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: "user",
      type: "text",
      text: value,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        {/* Date pill */}
        <div className="flex justify-center pt-6">
          <div className="px-3 py-1 rounded-full bg-black/5 text-[12px] text-gray-500">
            {todayLabel}
          </div>
        </div>

        {/* Messages area */}
        <ChatMessageList messages={messages} />
        
      </div>

      {/* Bottom composer */}
        <ChatComposer
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            onQuickAction={label => setInput(label)}
        />
        </div>
  );
}
