// Front/src/api/NoticeApi.ts
import { apiClient } from "./axiosConfig";
import type { Notice } from "../pages/NoticesPage";

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
    startDate: (d.startDate ?? d.start_date ?? null) as string | null,
    endDate: (d.endDate ?? d.end_date ?? null) as string | null,
    pdfUrl: (d.pdfUrl ?? d.pdf ?? null) as string | null,
    url: (d.url ?? null) as string | null,
  };
}

export async function getNoticeDetail(id: number): Promise<Notice> {
  const res = await apiClient.get<unknown>(`/notices/${id}`);
  return normalizeNoticeDetail(res.data);
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
  start_date: string | null;
  end_date: string | null;
  pdf: string | null;
  url: string;
};

export async function getFavoriteNotices(): Promise<FavoriteNotice[]> {
  const res = await apiClient.get<FavoriteNotice[]>("/notices/favorites");
  return res.data ?? [];
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
