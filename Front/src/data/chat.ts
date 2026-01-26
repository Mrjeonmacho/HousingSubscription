export type ChatRole = "user" | "bot";

export type ChatMessageType = "text" | "announcement";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  type: ChatMessageType;
  text: string;
  createdAt: string;
};

export const chatMessages: ChatMessage[] = [
  {
    id: "chat-1",
    role: "user",
    type: "text",
    text: "공공임대주택이 뭐야?",
    createdAt: "2026-01-26T09:55:00",
  },
  {
    id: "chat-2",
    role: "bot",
    type: "text",
    text:
      "공공임대주택은 국가나 공공기관이 공급하는 주택으로, 주거 안정을 위해 시세보다 저렴한 임대료로 제공합니다.",
    createdAt: "2026-01-26T09:55:10",
  },
  {
    id: "chat-3",
    role: "user",
    type: "text",
    text: "지금 신청 가능한 공고 있어?",
    createdAt: "2026-01-26T09:56:00",
  },
  {
    id: "chat-4",
    role: "bot",
    type: "announcement",
    text:
      "현재 신청 가능한 공고가 1건 있습니다.\n\n" +
      "• 2025년 제2-1차 미리내집(신혼·신생아)\n" +
      "신청 대상과 일정이 정해져 있으니 확인해보세요.",
    createdAt: "2026-01-26T09:56:10",
  },
];
