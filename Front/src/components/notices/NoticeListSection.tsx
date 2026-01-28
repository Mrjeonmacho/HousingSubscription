// Front/src/components/notices/NoticeListSection.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type { Notice } from "../../pages/NoticesPage";
import { categoryLabel, statusLabel } from "../../utils/noticeFormat";

type SortType = "REG_DATE" | "END_DATE";

type Props = {
  totalCount: number;
  items: Notice[];
  loading: boolean;
  errorMessage: string | null;
};

function formatDateRange(start: string | null, end: string | null) {
  const s = start ?? "-";
  const e = end ?? "-";
  return `${s} - ${e}`;
}

function calcDDay(endDate: string | null) {
  if (!endDate) return null;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return null;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffMs = startOfEnd.getTime() - startOfToday.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-DAY";
  return null;
}

function getDDayInfo(endDate: string | null) {
  if (!endDate) return { text: null as string | null, daysLeft: null as number | null };

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return { text: null, daysLeft: null };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffMs = startOfEnd.getTime() - startOfToday.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return { text: `D-${diffDays}`, daysLeft: diffDays };
  if (diffDays === 0) return { text: "D-DAY", daysLeft: 0 };
  return { text: null, daysLeft: diffDays }; // 지난 날짜
}

function ddayTone(daysLeft: number | null) {
  if (daysLeft === null) return "text-gray-400";
  if (daysLeft <= 3) return "text-red-500";
  if (daysLeft <= 10) return "text-primary";
  return "text-gray-400";
}

function rightTone() {
  return "text-primary";
}

function HeartIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 21s-7.2-4.7-9.6-9.2C.7 8.5 2.3 5.4 5.6 4.6c1.7-.4 3.5.2 4.7 1.5L12 7.9l1.7-1.8c1.2-1.3 3-1.9 4.7-1.5 3.3.8 4.9 3.9 3.2 7.2C19.2 16.3 12 21 12 21z"
          fill="#EF4444"
        />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12.1 20.3s-6.9-4.4-9.1-8.7C1.5 8.6 3 5.9 5.8 5.2c1.5-.4 3.1.2 4.2 1.4L12 8.3l2-1.7c1.1-1.2 2.7-1.8 4.2-1.4 2.8.7 4.3 3.4 2.8 6.4-2.2 4.3-8.9 8.7-8.9 8.7z"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SkeletonRow() {
  return (
    <div className="rounded-[20px] bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-6">
        <div className="h-24 w-32 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="h-7 w-3/4 rounded bg-gray-100 animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-32 rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-32 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-12 rounded bg-gray-100 animate-pulse" />
          <div className="h-6 w-6 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function isNew(regDate: string | null, days = 7) {
  if (!regDate) return false;

  const reg = new Date(regDate);
  if (Number.isNaN(reg.getTime())) return false;

  const now = new Date();
  const diffMs = now.getTime() - reg.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays <= days;
}

function isClosedNotice(n: Notice) {
  // endDate가 있으면 날짜를 최우선으로 판단
  if (n.endDate) {
    const end = new Date(n.endDate);
    if (!Number.isNaN(end.getTime())) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      // 오늘 포함(= D-DAY 포함)은 마감으로 보지 않음
      if (startOfEnd.getTime() >= startOfToday.getTime()) return false;

      // 과거면 마감
      return true;
    }
  }

  // endDate가 없거나 파싱 실패 시에만 status 기반으로 판단
  const label = statusLabel(n.status);
  const normalized = String(label).replace(/\s+/g, "");
  return normalized.includes("마감") || normalized.includes("종료");
}

function dateToMs(dateStr: string | null, fallback: string) {
  return new Date(dateStr ?? fallback).getTime();
}

export default function NoticeListSection({ totalCount, items, loading }: Props) {
  const [sortType, setSortType] = useState<SortType>("REG_DATE");
  const [open, setOpen] = useState(false);

  // 드롭박스 밖 클릭 닫기
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      const el = dropdownRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const sortedItems = useMemo(() => {
    const copied = [...items];

    return copied.sort((a, b) => {
      if (sortType === "REG_DATE") {
        return (
          dateToMs(b.regDate, "1970-01-01") - dateToMs(a.regDate, "1970-01-01")
        );
      }

      // 마감 임박순:
      // 1) 접수마감은 항상 아래
      const aClosed = isClosedNotice(a);
      const bClosed = isClosedNotice(b);
      if (aClosed !== bClosed) return aClosed ? 1 : -1;

      // 2) (둘 다 접수마감이 아니거나, 둘 다 접수마감이면) endDate 빠른 순
      const endDiff =
        dateToMs(a.endDate, "9999-12-31") - dateToMs(b.endDate, "9999-12-31");
      if (endDiff !== 0) return endDiff;

      // 3) tie-break: regDate 최신 순
      return dateToMs(b.regDate, "1970-01-01") - dateToMs(a.regDate, "1970-01-01");
    });
  }, [items, sortType]);

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between px-1">
        <h3 className="text-xl font-bold text-gray-900 leading-none">
          전체 공고 리스트 <span className="text-gray-900">({totalCount})</span>
        </h3>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="정렬"
          >
            {sortType === "REG_DATE" ? "최신 등록순" : "마감 임박순"}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-36 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-10">
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => {
                  setSortType("REG_DATE");
                  setOpen(false);
                }}
              >
                최신 등록순
              </button>
              <button
                type="button"
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                onClick={() => {
                  setSortType("END_DATE");
                  setOpen(false);
                }}
              >
                마감 임박순
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : sortedItems.length === 0 ? (
          <div className="rounded-[20px] border border-gray-100 bg-white px-6 py-12 text-center text-gray-500 shadow-sm">
            표시할 공고가 없습니다.
          </div>
        ) : (
          sortedItems.map((n) => {
            const dday = calcDDay(n.endDate);
            const statusText = String(statusLabel(n.status));
            const rightText = dday ?? statusLabel(n.status);

            const { text: ddayText, daysLeft } = getDDayInfo(n.endDate);

            // D-day가 아닌(= statusText를 보여줄 때) 색은 기존처럼 primary, D-day면 조건부 색상
            const isClosed = isClosedNotice(n);
            const rightTextClass = isClosed
              ? "text-gray-400"
              : ddayText
              ? ddayTone(daysLeft)
              : rightTone();

            const isFavorite = false;

            const normalizedStatus = statusText.replace(/\s+/g, "");
            const badgeText =
                normalizedStatus === "접수중"
                  ? "접수중"
                  : normalizedStatus === "마감임박" || n.status === "DEADLINE_APPROACHING"
                  ? "마감임박"
                  : null;

            return (
              <article
                key={n.id}
                className="group relative flex flex-col md:flex-row items-stretch md:items-center gap-6 rounded-[20px] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#F2F4F6] hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="shrink-0 w-full md:w-32 flex flex-col justify-center items-center rounded-2xl bg-[#F3F4F6] py-3 px-2 text-center">
                  <span className="text-xs text-[#7D8592] mb-1">주택유형</span>
                  <span className="text-[15px] font-bold text-[#191F28] break-keep leading-tight">
                    {categoryLabel(n.category)}
                  </span>
                </div>

                <div className="flex-1 min-w-0 py-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isNew(n.regDate) && (
                      <span className="inline-flex shrink-0 items-center justify-center rounded px-[6px] py-[2px] text-[10px] font-bold text-primary">
                        NEW
                      </span>
                    )}
                    <h4 className="truncate text-lg md:text-[15px] font-bold text-[#191F28] tracking-tight">
                      {n.title}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#8B95A1] font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-[#9CA3AF]">
                        calendar_today
                      </span>
                      <span className="tracking-tight">
                        {formatDateRange(n.startDate, n.endDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-[#9CA3AF]">
                        location_on
                      </span>
                      <span>서울특별시 전역</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 md:pl-2">
                  <div className="flex flex-col items-center justify-center text-center min-w-[72px]">
                    {badgeText && (
                      <span className="mb-1 inline-flex shrink-0 items-center justify-center rounded bg-[#F3F4F6] px-[6px] py-[2px] text-[10px] font-bold">
                        {badgeText}
                      </span>
                    )}

                    <div className={`text-l font-bold tracking-tight whitespace-nowrap ${rightTextClass}`}>
                      {rightText}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-gray-50 transition-colors"
                    aria-label="관심 공고 등록"
                    onClick={() => {}}
                  >
                    <HeartIcon active={isFavorite} />
                  </button>
                </div>

              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
