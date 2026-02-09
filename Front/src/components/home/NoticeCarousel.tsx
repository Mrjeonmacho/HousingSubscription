// Front/src/components/home/NoticeCarousel.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getNoticeList } from "../../api/NoticeApi";
import type { Notice } from "../../pages/NoticesPage";
import CategoryBadge from "../common/CategoryBadge";

function formatPeriod(start: string | null, end: string | null) {
  const s = start ?? "-";
  const e = end ?? "-";
  return `${s} ~ ${e}`;
}

function getDDayInfo(endDate: string | null) {
  if (!endDate) return null;

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return null;
  if (diffDays === 0) return { text: "D-DAY", daysLeft: 0 };
  return { text: `D-${diffDays}`, daysLeft: diffDays };
}

// [디자인 수정 1] D-Day 색상 로직 변경 및 폰트 굵기 통일
function DDayBadge({ endDate }: { endDate: string | null }) {
  const info = getDDayInfo(endDate);
  if (!info) return null;

  // 기본 스타일: 폰트 굵기 통일 (font-bold)
  let colorClass = "";

  if (info.daysLeft <= 3) {
    // D-Day ~ D-3: 빨간색 (강조 효과 유지)
    colorClass = "text-red-600"; 
  } else if (info.daysLeft <= 7) {
    // D-4 ~ D-7: 초록색
    colorClass = "text-primary";
  } else {
    // 나머지: 회색
    colorClass = "text-gray-400";
  }

  return (
    <span className={`text-xs tracking-tight font-bold ${colorClass}`}>
      {info.text}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-16 rounded-lg bg-gray-100 animate-pulse" />
        <div className="h-4 w-10 rounded bg-gray-100 animate-pulse" />
      </div>
      <div className="h-6 w-3/4 rounded bg-gray-100 animate-pulse mb-3" />
      <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse mb-8" />
      <div className="h-11 w-full rounded-xl bg-gray-100 animate-pulse mt-auto" />
    </div>
  );
}

function useColumnsByBreakpoint() {
  const calc = () => {
    const w = window.innerWidth;
    if (w >= 1280) return 4;
    if (w >= 1024) return 3;
    if (w >= 768) return 2;
    return 1;
  };

  const [cols, setCols] = useState<number>(() => calc());

  useEffect(() => {
    const onResize = () => setCols(calc());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return cols;
}

export default function NoticeCarousel() {
  const navigate = useNavigate();

  const [items, setItems] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cols = useColumnsByBreakpoint();

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
    return () => { ignore = true; };
  }, []);

  const latest = useMemo(() => {
    const openOnly = items.filter((n) => getDDayInfo(n.endDate) !== null);
    const sorted = [...openOnly].sort((a, b) => {
      const aInfo = getDDayInfo(a.endDate);
      const bInfo = getDDayInfo(b.endDate);
      const aLeft = aInfo ? aInfo.daysLeft : Number.POSITIVE_INFINITY;
      const bLeft = bInfo ? bInfo.daysLeft : Number.POSITIVE_INFINITY;
      if (aLeft !== bLeft) return aLeft - bLeft;
      const aReg = a.regDate ? new Date(a.regDate).getTime() : 0;
      const bReg = b.regDate ? new Date(b.regDate).getTime() : 0;
      if (bReg !== aReg) return bReg - aReg;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });
    return sorted.slice(0, cols);
  }, [items, cols]);

  const goDetail = (id: number) => {
    navigate(`/notices/${id}`);
  };

  return (
    <section className="space-y-8 px-2">
      
      {/* 헤더 */}
      <div className="flex items-end justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            마감 임박 공고
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            놓치면 안 되는 서울시 주요 공고를 확인하세요.
          </p>
        </div>

        <Link
          to="/notices"
          className="group flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-1"
        >
          <span>전체보기</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
            chevron_right
          </span>
        </Link>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : errorMessage ? (
          <div className="col-span-full py-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">{errorMessage}</p>
            <button onClick={() => window.location.reload()} className="text-sm font-bold text-primary hover:underline">
              다시 시도하기
            </button>
          </div>
        ) : latest.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-[2rem]">
            <span className="material-symbols-outlined text-4xl text-gray-300 mb-3">folder_open</span>
            <p className="text-gray-500 font-medium">현재 신청 가능한 공고가 없습니다.</p>
          </div>
        ) : (
          latest.map((item) => (
            <div
              key={item.id}
              onClick={() => goDetail(item.id)}
              className="
                group relative flex flex-col justify-between
                bg-white dark:bg-gray-800 
                border border-gray-100 dark:border-gray-700
                rounded-[1.5rem] p-5
                shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]
                hover:-translate-y-1
                transition-all duration-300 ease-out
                cursor-pointer h-full
              "
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <CategoryBadge category={item.category} size="sm" />
                  <DDayBadge endDate={item.endDate} />
                </div>

                <h3 className="text-[17px] font-bold text-gray-800 dark:text-gray-100 leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6 w-fit">
                  <span className="font-medium tracking-tight">
                    {formatPeriod(item.startDate, item.endDate)}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-700">
                 <div className="flex items-center justify-between text-sm text-gray-400 group-hover:text-primary transition-colors">
                    <span className="font-medium">자세히 보기</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                    </span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
