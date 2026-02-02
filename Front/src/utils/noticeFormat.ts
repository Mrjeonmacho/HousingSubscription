// Front/src/utils/noticeFormat.ts

export type NoticeCategory =
  | "YOUTH_RESIDENCE"
  | "HAPPY_HOUSE"
  | "NATIONAL_RENTAL"
  | "PUBLIC_RENTAL"
  | "LONG_TERM_RENTAL"
  | "SALE_HOUSE";

export type NoticeStatus =
  | "RECEIVING"
  | "DEADLINE_APPROACHING"
  | "COMPLETED"
  | "TO_BE_ANNOUNCED";

/**
 * 공고 카테고리
 */
// recommendedCategories에 내려오는 값까지 커버하도록 보강
export function categoryLabel(category: string | null | undefined) {
  switch (category) {
    case "YOUTH_RESIDENCE":
    case "YOUTH_HOUSING":
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
      return "-";
  }
}

/**
 * 공고 상태
 */
export function statusLabel(status: string | null | undefined) {
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
      return "-";
  }
}
