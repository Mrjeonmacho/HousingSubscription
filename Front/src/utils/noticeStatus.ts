// Front/src/utils/noticeStatus.ts => 날짜 → 상태(코드값) 계산
export type ComputedNoticeStatus =
  | "UPCOMING"        // 청약 예정
  | "RECRUITING"      // 청약 접수중
  | "DEADLINE_SOON"   // 마감 임박 (D-3~D-0)
  | "CLOSED";         // 청약 마감

function parseYmdToLocalDate(ymd: string): Date | null {
  // "2025-12-01" 형태를 로컬 자정으로 파싱
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const d = Number(m[3]);
  const dt = new Date(y, mo, d);

  return Number.isNaN(dt.getTime()) ? null : dt;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function computeNoticeStatus(
  startDate: string | null,
  endDate: string | null,
  today: Date = new Date()
): ComputedNoticeStatus | null {
  if (!startDate || !endDate) return null;

  const s = parseYmdToLocalDate(startDate);
  const e = parseYmdToLocalDate(endDate);
  if (!s || !e) return null;

  const t0 = startOfDay(today);
  const s0 = startOfDay(s);
  const e0 = startOfDay(e);

  if (t0 < s0) return "UPCOMING";
  if (t0 > e0) return "CLOSED";

  // t0가 s0~e0 사이(포함)인 경우
  const diffDays = Math.floor((e0.getTime() - t0.getTime()) / 86400000);

  // 마감일 당일(diffDays=0)도 마감임박
  if (diffDays <= 3) return "DEADLINE_SOON";
  return "RECRUITING";
}
