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

export async function getNoticeDetail(id: number): Promise<Notice> {
  const res = await apiClient.get<Notice>(`/notices/${id}`);
  return res.data;
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

export async function getFavoriteNotices(userId: number): Promise<FavoriteListItem[]> {
  const res = await apiClient.get<FavoriteListItem[]>(`/notices/favorites/${userId}`);
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