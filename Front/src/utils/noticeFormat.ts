import type { Notice } from "../pages/NoticesPage";

type NoticeCategory = Notice["category"];
type NoticeStatus = Notice["status"];

export function categoryLabel(category: NoticeCategory) {
  switch (category) {
    case "YOUTH_RESIDENCE":
      return "청년안심주택";
    case "HAPPY_HOUSE":
      return "행복주택";
    case "NATIONAL_RENTAL":
      return "국민임대";
    case "PUBLIC_RENTAL":
      return "공공임대";
    case "LONG_TERM_RENTAL":
      return "장기전세";
    case "SALE_HOUSE":
      return "분양주택";
    default:
      return category ?? "-";
  }
}

export function statusLabel(status: NoticeStatus) {
  switch (status) {
    case "RECEIVING":
      return "접수중";
    case "DEADLINE_APPROACHING":
      return "마감임박";
    case "COMPLETED":
      return "접수마감";
    case "TO_BE_ANNOUNCED":
      return "발표예정";
    default:
      return status ?? "-";
  }
}
