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
    noticeNo: (d.noticeNo ?? d.no ?? null) as string | null,
    title: (d.title ?? "") as string,
    category: (d.category ?? null) as Notice["category"],
    regDate: (d.regDate ?? d.reg_date ?? null) as string | null,
    status: (d.status ?? null) as Notice["status"],
    summary: (d.summary ?? null) as string | null,
    startDate: (d.startDate ?? d.start_date ?? null) as string | null,
    endDate: (d.endDate ?? d.end_date ?? null) as string | null,
    pdfUrl: (d.pdfUrl ?? d.pdf ?? null) as string | null,
    url: (d.url ?? null) as string | null,
  };
}

type NotFoundLikeError = Error & { status?: number };

export async function getNoticeDetail(id: number): Promise<Notice> {
  const res = await apiClient.get<unknown>(`/notices/${id}`);
  const notice = normalizeNoticeDetail(res.data);

  // 응답이 공고 상세가 아니면(빈 객체/에러 바디 등) 404로 처리
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
  no: string;
  title: string;
  category: string;
  reg_date: string;
  status: string;
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
  if (!isLoggedIn()) return []; // 비로그인: 요청 자체를 안 보냄

  try {
    const res = await apiClient.get<FavoriteNotice[]>("/notices/favorites");
    return res.data ?? [];
  } catch (err) {
    // 토큰 만료/권한 문제(401/403)는 favorites 조회만 조용히 비움
    const ax = err as AxiosError;
    const status = ax.response?.status;
    if (status === 401 || status === 403) return [];
    throw err;
  }
}

/**
 * [공고 찜하기]
 * POST /api/notices/favorites/{id}
 *
 * [찜한 공고 삭제]
 * DELETE /api/notices/favorites/{id}
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
