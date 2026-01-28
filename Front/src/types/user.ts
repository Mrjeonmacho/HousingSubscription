export interface UserAddInfo {
  birthDate: string;       // "YYYY-MM-DD"
  targetType: "YOUTH" | "NEWLYWED"; // 청년 / 신혼부부
  marriageStatus: "SINGLE" | "MARRIED" | "PLANNED"; // 미혼 / 기혼 / 결혼예정
  childCount: number;      // 자녀 수
  isHomeless: boolean;     // 무주택 여부
  asset: string;           // 자산 (암호화 대상이지만 프론트는 string으로 전송)
  income: string;          // 소득
}