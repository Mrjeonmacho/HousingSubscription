export type NoticeStatus = "진행중" | "마감";

export type NoticeCategory = {
  label: string;
  badgeClass: string;
};

export type NoticeItem = {
  id: string;
  category: NoticeCategory;
  status: NoticeStatus;
  title: string;
  period: string;
  disabled?: boolean;
};

export const notices: NoticeItem[] = [
  {
    id: "notice-1",
    category: { label: "행복주택", badgeClass: "bg-blue-100 text-blue-600" },
    status: "진행중",
    title: "강동구 상일동 고덕자이 행복주택 예비입주자 모집",
    period: "2024.10.20 - 2024.10.24",
  },
  {
    id: "notice-2",
    category: { label: "장기전세", badgeClass: "bg-orange-100 text-orange-600" },
    status: "진행중",
    title: "마포구 공덕역 인근 청년 안심주택 모집",
    period: "2024.10.15 - 2024.10.30",
  },
  {
    id: "notice-3",
    category: { label: "매입임대", badgeClass: "bg-purple-100 text-purple-600" },
    status: "마감",
    title: "송파구 거여동 신혼부부 전세임대 Ⅱ형",
    period: "2024.09.20 - 2024.10.05",
    disabled: true,
  },
  {
    id: "notice-4",
    category: { label: "청년주택", badgeClass: "bg-green-100 text-green-600" },
    status: "진행중",
    title: "동작구 대방동 수방사 부지 사전청약 가이드",
    period: "2024.10.22 - 2024.11.02",
  },
];
