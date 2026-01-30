// Front/src/components/home/NoticeCarousel.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getNoticeList } from "../../api/NoticeApi";
import type { Notice } from "../../pages/NoticesPage";
import { categoryLabel } from "../../utils/noticeFormat";

type UiStatus = "진행중" | "종료";

function StatusBadge({ status }: { status: UiStatus }) {
  const cls =
    status === "진행중"
      ? "bg-primary/10 text-primary"
      : "bg-gray-100 text-gray-400";

  return (
    <span className={`px-3 py-1 rounded-full ${cls} text-[10px] font-bold`}>
      {status}
    </span>
  );
}

function formatPeriod(start: string | null, end: string | null) {
  const s = start ?? "-";
  const e = end ?? "-";
  return `${s} ~ ${e}`;
}

/**
 * 홈 캐러셀 기준 "종료" 판정
 * - status가 COMPLETED면 종료
 * - endDate가 오늘(00:00)보다 과거면 종료
 */
function calcUiStatus(n: Notice): UiStatus {
  if (n.status === "COMPLETED") return "종료";

  if (n.endDate) {
    const end = new Date(n.endDate);
    if (!Number.isNaN(end.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      if (end < today) return "종료";
    }
  }

  return "진행중";
}

function badgeClassByCategory(category: string | null | undefined) {
  switch (category) {
    case "YOUTH_RESIDENCE":
      return "bg-primary/10 text-primary";
    case "HAPPY_HOUSE":
      return "bg-emerald-500/10 text-emerald-600";
    case "NATIONAL_RENTAL":
      return "bg-blue-500/10 text-blue-600";
    case "PUBLIC_RENTAL":
      return "bg-indigo-500/10 text-indigo-600";
    case "LONG_TERM_RENTAL":
      return "bg-purple-500/10 text-purple-600";
    case "SALE_HOUSE":
      return "bg-amber-500/10 text-amber-700";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

function SkeletonCard() {
  return (
    <div className="glass p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 w-24 rounded-full bg-gray-100 animate-pulse" />
        <div className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" />
      </div>
      <div className="h-6 w-4/5 rounded bg-gray-100 animate-pulse mb-3" />
      <div className="h-6 w-3/5 rounded bg-gray-100 animate-pulse mb-6" />
      <div className="flex items-center gap-2 mb-6">
        <div className="h-5 w-5 rounded bg-gray-100 animate-pulse" />
        <div className="h-4 w-40 rounded bg-gray-100 animate-pulse" />
      </div>
      <div className="h-12 w-full rounded-xl bg-gray-100 animate-pulse" />
    </div>
  );
}

export default function NoticeCarousel() {
  const navigate = useNavigate();

  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchList = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);

        const list = await getNoticeList();
        if (ignore) return;

        setItems(list ?? []);
      } catch {
        if (ignore) return;
        setErrorMessage("공고를 불러오지 못했습니다.");
        setItems([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchList();
    return () => {
      ignore = true;
    };
  }, []);

  const latest = useMemo(() => {
    // 1) 종료 공고 제외
    const openOnly = items.filter((n) => calcUiStatus(n) !== "종료");

    // 2) 마감 임박순 정렬 (endDate가 가까운 순)
    const sorted = [...openOnly].sort((a, b) => {
      const aEnd = a.endDate ? new Date(a.endDate).getTime() : Number.POSITIVE_INFINITY;
      const bEnd = b.endDate ? new Date(b.endDate).getTime() : Number.POSITIVE_INFINITY;

      // endDate가 있으면 그 값이 작은(더 빨리 마감) 게 먼저
      if (aEnd !== bEnd) return aEnd - bEnd;

      // endDate가 같거나 둘 다 없으면 등록일 최신순으로 보정
      const aReg = a.regDate ? new Date(a.regDate).getTime() : 0;
      const bReg = b.regDate ? new Date(b.regDate).getTime() : 0;
      if (bReg !== aReg) return bReg - aReg;

      // 마지막 tie-breaker
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });

    // 3) 최대 4개
    return sorted.slice(0, 4);
  }, [items]);

  const goDetail = (id: number) => {
    navigate(`/notices/${id}`);
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">최근 주거 공고</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            지금 신청 가능한 서울시 맞춤형 공고입니다.
          </p>
        </div>

        <Link
          to="/notices"
          className="group text-primary font-bold flex items-center gap-1 transition-colors"
        >
          <span className="group-hover:underline">전체보기</span>
          <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : errorMessage ? (
          <div className="w-full px-2">
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm text-gray-500">{errorMessage}</p>
              <Link
                to="/notices"
                className="inline-flex items-center gap-1 mt-4 text-primary font-bold"
              >
                공고 목록으로 이동
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>
        ) : latest.length === 0 ? (
          <div className="w-full px-2">
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm text-gray-500">
                지금 신청 가능한 공고가 없습니다.
              </p>
              <Link
                to="/notices"
                className="inline-flex items-center gap-1 mt-4 text-primary font-bold"
              >
                전체 공고 보기
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>
        ) : (
          latest.map((item) => {
            const uiStatus = calcUiStatus(item);
            const isDisabled = uiStatus === "종료";

            return (
              <div
                key={item.id}
                className="glass p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full ${badgeClassByCategory(
                      item.category
                    )} text-[10px] font-bold uppercase`}
                  >
                    {categoryLabel(item.category)}
                  </span>
                  <StatusBadge status={uiStatus} />
                </div>

                <h3 className="text-lg font-bold mb-4 line-clamp-2">
                  {item.title}
                </h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="material-symbols-outlined text-sm">
                      calendar_month
                    </span>
                    <span>{formatPeriod(item.startDate, item.endDate)}</span>
                  </div>
                </div>

                {isDisabled ? (
                  <button className="w-full py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">
                    공고 종료
                  </button>
                ) : (
                  <button
                    onClick={() => goDetail(item.id)}
                    className="w-full py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm font-bold group-hover:bg-primary group-hover:text-white transition-all"
                  >
                    공고 상세보기
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
