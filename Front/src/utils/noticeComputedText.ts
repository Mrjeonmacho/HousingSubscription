// Front\src\utils\noticeComputedText.ts => “상태 텍스트”를 최종 결정
import { noticeStatusLabel } from "./noticeFormat";
import { computeNoticeStatus, type ComputedNoticeStatus } from "./noticeStatus";
import type { Notice } from "../pages/NoticesPage";

export function getNoticeComputedStatusText(
  n: Pick<Notice, "startDate" | "endDate">
) {
  const computed: ComputedNoticeStatus | null = computeNoticeStatus(
    n.startDate,
    n.endDate
  );

  return String(noticeStatusLabel(computed));
}
