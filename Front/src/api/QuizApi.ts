// Front/src/api/QuizApi.ts
import { apiClient } from "./axiosConfig";
import type { AxiosError } from "axios";

/** ===== Types ===== */
export type QuizOption = {
  optionId: number;
  text: string;
};

export type QuizQuestion = {
  questionId: number;
  question: string;
  options: QuizOption[];
};

export type QuizStartResponse = QuizQuestion[];

export type SubmitQuizAnswerRequest = {
  questionId: number;
  selectedOptionId: number;
};

export type SubmitQuizAnswerResponse = {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
};

export type ApiErrorResponse = {
  code?: string;
  message?: string;
};

/** ===== API ===== */
export async function getQuizStart(): Promise<QuizStartResponse> {
  const res = await apiClient.get<QuizStartResponse>("/games/quiz/start");
  return res.data;
}

export async function submitQuizAnswer(
  payload: SubmitQuizAnswerRequest
): Promise<SubmitQuizAnswerResponse> {
  const res = await apiClient.post<SubmitQuizAnswerResponse>(
    "/games/quiz/answer",
    payload
  );
  return res.data;
}

/** ===== Helpers ===== */
export function getApiErrorMessage(err: unknown): string {
  const e = err as AxiosError<ApiErrorResponse>;
  return e.response?.data?.message ?? "요청 처리 중 오류가 발생했습니다.";
}

export function getApiErrorCode(err: unknown): string | undefined {
  const e = err as AxiosError<ApiErrorResponse>;
  return e.response?.data?.code;
}
