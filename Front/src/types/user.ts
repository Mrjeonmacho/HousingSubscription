export interface UserAddInfo {
  birthDate: string | null;       // "YYYY-MM-DD"
  targetType: "STUDENT" | "YOUTH" | "NEWLYWED" | null; // 대학생 / 청년 / 신혼부부
  marriageStatus: "SINGLE" | "MARRIED" | "PLANNED" | null; // 미혼 / 기혼 / 결혼예정
  childCount: number | null;      // 자녀 수
  houseOwn: "YES" | "NO" | null;     // 무주택 여부
  asset: number | null;           // 자산
  income: number | null;          // 소득
}