// Front/src/data/chat.ts
export type ChatRole = "user" | "assistant";

export type ChatMessageType = "text" | "announcement";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  type: ChatMessageType;
  text: string;
  createdAt: string;
};
