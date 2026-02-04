// Front/src/api/AdminNoticeApi.ts
import { apiClient } from "./axiosConfig";
import type { NoticeCategory } from "../utils/noticeFormat";

export type AdminCreateNoticeRequest = {
  title: string;
  category: NoticeCategory;
  reg_date: string; // YYYY-MM-DD
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  pdf: string; // URL
  url: string; // URL
};

export type AdminCreateNoticeResponse = {
  code: string;
  message: string;
  noticeId: number;
};

export type AdminUpdateNoticeResponse = {
  noticeId: number;
};

export type AdminDeleteNoticeResponse = {
  code?: string;
  message?: string;
  noticeId?: number;
};

function buildUpsertPayload(
  body: AdminCreateNoticeRequest
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: body.title,
    category: body.category,
    regDate: body.reg_date,
    startDate: body.start_date,
    endDate: body.end_date,
    pdfUrl: body.pdf,
    url: body.url,
  };

  return payload;
}

export async function postAdminCreateNotice(
  body: AdminCreateNoticeRequest
): Promise<AdminCreateNoticeResponse> {
  const payload = buildUpsertPayload(body);
  const res = await apiClient.post<AdminCreateNoticeResponse>(
    "/admin/notices",
    payload
  );
  return res.data;
}

export async function patchAdminUpdateNotice(
  noticeId: number,
  body: AdminCreateNoticeRequest
): Promise<AdminUpdateNoticeResponse> {
  const payload = buildUpsertPayload(body);
  const res = await apiClient.patch<AdminUpdateNoticeResponse>(
    `/admin/notices/${noticeId}`,
    payload
  );
  return res.data;
}

export async function deleteAdminNotice(
  noticeId: number
): Promise<AdminDeleteNoticeResponse> {
  const res = await apiClient.delete<AdminDeleteNoticeResponse>(
    `/admin/notices/${noticeId}`
  );
  return res.data;
}
