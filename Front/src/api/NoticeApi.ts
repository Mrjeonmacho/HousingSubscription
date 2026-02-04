// Front/src/api/NoticeApi.ts
import { apiClient } from "./axiosConfig";
import type { Notice } from "../pages/NoticesPage";
import type { AxiosError } from "axios";

type NoticeListResponse = {
  notices: Notice[];
};

export async function getNoticeList(): Promise<Notice[]> {
  const res = await apiClient.get<NoticeListResponse>("/notices");
  return res.data?.notices ?? [];
}

function normalizeNoticeDetail(data: unknown): Notice {
  const d = (data ?? {}) as Record<string, unknown>;

  return {
    id: Number(d.id),

    // ✅ 최소수정: Notice 타입에서 요구하는 필드 채우기
    // - noticeNo: 백엔드가 noticeNo / notice_no / no 등으로 줄 수도 있으니 다 커버
    noticeNo: (d.noticeNo ?? d.notice_no ?? d.no ?? null) as string | null,

    title: (d.title ?? "") as string,
    category: (d.category ?? null) as Notice["category"],
    regDate: (d.regDate ?? d.reg_date ?? null) as string | null,

    // ✅ 최소수정: status도 채우기 (없으면 null)
    status: (d.status ?? null) as string | null,

    summary: (d.summary ?? null) as string | null,
    startDate: (d.startDate ?? d.start_date ?? null) as string | null,
    endDate: (d.endDate ?? d.end_date ?? null) as string | null,
    pdfUrl: (d.pdfUrl ?? d.pdf ?? null) as string | null,
    originUrl: (d.originUrl ?? d.url ?? null) as string | null,
  };
}

type NotFoundLikeError = Error & { status?: number };

export async function getNoticeDetail(id: number): Promise<Notice> {
  const res = await apiClient.get<unknown>(`/notices/${id}`);
  const notice = normalizeNoticeDetail(res.data);

  if (!Number.isFinite(notice.id) || notice.id !== id) {
    const err: NotFoundLikeError = Object.assign(new Error("NOT_FOUND"), {
      status: 404,
    });
    throw err;
  }

  return notice;
}

/**
 * [찜한 공고 목록 조회]
 * GET /api/notices/favorites
 */
export type FavoriteNotice = {
  id: number;
  title: string;
  category: string;
  reg_date: string;
  summary: string | null;
  start_date: string | null;
  end_date: string | null;
  pdf: string | null;
  url: string;
};

function isLoggedIn() {
  return Boolean(localStorage.getItem("accessToken"));
}

export async function getFavoriteNotices(): Promise<FavoriteNotice[]> {
  if (!isLoggedIn()) return [];

  try {
    const res = await apiClient.get<FavoriteNotice[]>("/notices/favorites");
    return res.data ?? [];
  } catch (err) {
    const ax = err as AxiosError;
    const status = ax.response?.status;
    if (status === 401 || status === 403) return [];
    throw err;
  }
}

/**
 * [공고 찜하기] POST /api/notices/favorites/{id}
 * [공고 찜한 삭제] DELETE /api/notices/favorites/{id}
 */
export type FavoriteSuccessResponse = {
  code: string;
  message: string;
  noticeId: number;
  isFavorite: boolean;
};

export async function addFavoriteNotice(
  noticeId: number
): Promise<FavoriteSuccessResponse> {
  const res = await apiClient.post<FavoriteSuccessResponse>(
    `/notices/favorites/${noticeId}`
  );
  return res.data;
}

export async function removeFavoriteNotice(
  noticeId: number
): Promise<FavoriteSuccessResponse> {
  const res = await apiClient.delete<FavoriteSuccessResponse>(
    `/notices/favorites/${noticeId}`
  );
  return res.data;
}
