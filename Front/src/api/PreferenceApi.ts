// Front/src/api/PreferenceApi.ts

export type PreferenceAnswerItem = {
  questionKey: string;
  selectedOption: string;
};

export type PreferenceResultResponse = {
  preferenceType: string;
  summary: string;
  recommendedCategories: string[];
  noticeTip: string;
};

export type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export async function postPreferenceResult(
  answers: PreferenceAnswerItem[],
  signal?: AbortSignal
): Promise<PreferenceResultResponse> {
  const accessToken = localStorage.getItem("accessToken");

  const res = await fetch("/api/games/preferences/result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ answers }),
    signal,
  });

  if (!res.ok) {
    let err: ApiErrorResponse | null = null;
    try {
      err = (await res.json()) as ApiErrorResponse;
    } catch {
      err = null;
    }

    const message =
      err?.message ||
      (res.status === 401
        ? "인증이 필요합니다."
        : "결과를 불러오지 못했습니다.");

    const error = new Error(message) as Error & {
      status?: number;
      code?: string;
    };
    error.status = res.status;
    error.code = err?.code;
    throw error;
  }

  return (await res.json()) as PreferenceResultResponse;
}
