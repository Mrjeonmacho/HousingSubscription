// Front/src/api/ChatbotApi.ts
import type { AxiosError } from "axios";
import { apiClient } from "./axiosConfig";

export type ChatbotSuccessResponse = {
  message: string;
};

// 기본 Chatbot
export async function postChat(message: string, title?: string | null): Promise<string> {
  const res = await apiClient.post<ChatbotSuccessResponse>("/chatbot/chat", {
    message: message,
    title: title
  });
  return res.data.message;
}

export function toChatbotErrorText(err: unknown): string {
  if (err && typeof err === "object" && "isAxiosError" in err) {
    const axiosErr = err as AxiosError<{
      code?: string;
      message?: string;
    }>;

    const status = axiosErr.response?.status;
    const data = axiosErr.response?.data;

    if (data?.message) {
      const code = data.code ? ` (${data.code})` : "";
      return `${data.message}${code}`;
    }

    if (status) {
      return `요청 처리 중 오류가 발생했습니다. (HTTP ${status})`;
    }
  }

  return "요청 처리 중 오류가 발생했습니다.";
}
