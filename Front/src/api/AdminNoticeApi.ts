// Front/src/api/AdminNoticeApi.ts
import { apiClient } from "./axiosConfig";
import type { NoticeCategory, NoticeStatus } from "../utils/noticeFormat";

export type AdminCreateNoticeRequest = {
  notice_no: string; // 선택 입력(비우면 전송하지 않음)
  title: string;
  category: NoticeCategory;
  reg_date: string; // YYYY-MM-DD
  status: NoticeStatus;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  pdfUrl: string; // URL
  originUrl: string; // URL
  summary: string | null; // 요약문
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

function buildUpsertPayload(body: AdminCreateNoticeRequest): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: body.title,
    category: body.category,
    status: body.status,
    regDate: body.reg_date,
    startDate: body.start_date,
    endDate: body.end_date,
    pdfUrl: body.pdfUrl,
    originUrl: body.originUrl,
    summary: body.summary,
  };

  const noticeNo = body.notice_no.trim();
  if (noticeNo) payload.noticeNo = noticeNo;

  return payload;
}

export async function postAdminCreateNotice(
  body: AdminCreateNoticeRequest
): Promise<AdminCreateNoticeResponse> {
  const payload = buildUpsertPayload(body);
  const res = await apiClient.post<AdminCreateNoticeResponse>("/admin/notices", payload);
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
  const res = await apiClient.delete<AdminDeleteNoticeResponse>(`/admin/notices/${noticeId}`);
  return res.data;
}
