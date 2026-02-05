// Front/src/utils/noticeFormat.ts => 코드값 → 한글 라벨(표시 텍스트) 변환

export type NoticeCategory =
  | "YOUTH_RESIDENCE"
  | "HAPPY_HOUSE"
  | "NATIONAL_RENTAL"
  | "PUBLIC_RENTAL"
  | "LONG_TERM_RENTAL"
  | "SALE_HOUSE";

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
 * 공고 상태 (Front 기준: 날짜 기반 computed)
 */
import type { ComputedNoticeStatus } from "./noticeStatus";

export function noticeStatusLabel(status: ComputedNoticeStatus | null) {
  switch (status) {
    case "UPCOMING":
      return "청약 예정";
    case "RECRUITING":
      return "청약 접수중";
    case "DEADLINE_SOON":
      return "마감 임박";
    case "CLOSED":
      return "청약 마감";
    default:
      return "-";
  }
}
