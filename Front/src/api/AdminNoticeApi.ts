import { apiClient } from "./axiosConfig";
import type { NoticeCategory, NoticeStatus } from "../utils/noticeFormat";

export type AdminCreateNoticeRequest = {
  notice_no: string;
  title: string;
  category: NoticeCategory;
  reg_date: string;
  status: NoticeStatus;
  start_date: string;
  end_date: string;
  pdf: string;
  url: string;
};

export type AdminCreateNoticeResponse = {
  code: string;
  message: string;
  noticeId: number;
};

export async function postAdminCreateNotice(
  body: AdminCreateNoticeRequest
) {
  const payload = {
    noticeNo: body.notice_no,
    title: body.title,
    category: body.category,
    status: body.status,
    regDate: body.reg_date,
    startDate: body.start_date,
    endDate: body.end_date,
    pdfUrl: body.pdf,
    url: body.url,
  };

  const res = await apiClient.post("/admin/notices", payload);
  return res.data;
}
