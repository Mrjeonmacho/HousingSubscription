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

// 상세는 여기서 정규화까지 하고 Notice로 반환 (추가 함수 없이 통일)
export async function getNoticeDetail(id: number): Promise<Notice> {
  const res = await apiClient.get<unknown>(`/notices/${id}`);
  return normalizeNoticeDetail(res.data);
}

type FavoriteSuccessResponse = {
  code: string;
  message: string;
  noticeId: number;
  isFavorite: boolean;
};

type FavoriteListItem = {
  id: number;
};

type MeResponse = {
  userId: number;
};

export async function getMe(): Promise<MeResponse> {
  const res = await apiClient.get<MeResponse>("/users/me");
  return res.data;
}

export async function getFavoriteNotices(
  userId: number
): Promise<FavoriteListItem[]> {
  const res = await apiClient.get<FavoriteListItem[]>(
    `/notices/favorites/${userId}`
  );
  return res.data ?? [];
}

export async function addFavoriteNotice(
  userId: number,
  noticeId: number
): Promise<FavoriteSuccessResponse> {
  const res = await apiClient.post<FavoriteSuccessResponse>(
    `/notices/favorites/${userId}/${noticeId}`,
    null
  );
  return res.data;
}

export async function removeFavoriteNotice(
  userId: number,
  noticeId: number
): Promise<FavoriteSuccessResponse> {
  const res = await apiClient.delete<FavoriteSuccessResponse>(
    `/notices/favorites/${userId}/${noticeId}`
  );
  return res.data;
}

// userId 없이 찜 해제하는 경우 (FavoritesNoticeSection용)
export async function removeFavoriteNoticeByNoticeId(
  noticeId: number
): Promise<FavoriteSuccessResponse> {
  const res = await apiClient.delete<FavoriteSuccessResponse>(
    `/notices/favorites/${noticeId}`
  );
  return res.data;
}
