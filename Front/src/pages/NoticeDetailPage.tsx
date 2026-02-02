import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Notice } from "./NoticesPage";
import { getNoticeDetail } from "../api/NoticeApi";

import NoticeOverviewCard from "../components/noticeDetail/NoticeOverviewCard";
import NoticeQuickLinksCard from "../components/noticeDetail/NoticeQuickLinksCard";
import NoticeChatbotPanel from "../components/noticeDetail/NoticeChatbotPanel";

import { computeNoticeStatus } from "../utils/noticeStatus";
import { noticeStatusLabel } from "../utils/noticeFormat";

// D-Day 문자열 및 남은 일수 계산
function getDDayInfo(endDate: string | null) {
  if (!endDate) return { text: null, days: null };
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return { text: null, days: null };

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const diffMs = startOfEnd.getTime() - startOfToday.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return { text: `D-${diffDays}`, days: diffDays };
  if (diffDays === 0) return { text: "D-DAY", days: 0 };
  return { text: null, days: null }; // 이미 지남
}

export default function NoticeDetailPage() {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();

  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const parsedId = useMemo(() => {
    const n = Number(noticeId);
    return Number.isFinite(n) ? n : NaN;
  }, [noticeId]);

  // 날짜 기반 상태 계산
  const computedStatus = useMemo(
    () => (notice ? computeNoticeStatus(notice.startDate, notice.endDate) : null),
    [notice]
  );

  // 상태 텍스트
  const statusText = noticeStatusLabel(computedStatus);

  // D-Day 정보
  const { text: dDayText, days: dDayDays } = useMemo(
    () => (notice ? getDDayInfo(notice.endDate) : { text: null, days: null }),
    [notice]
  );

  // 헤더용 뱃지 스타일
  const headerBadgeStyle = useMemo(() => {
    switch (computedStatus) {
      case "DEADLINE_SOON":
        return "bg-red-50 text-red-500 border border-red-100";
      case "RECRUITING":
        return "bg-primary/10 text-primary border border-primary/20";
      case "UPCOMING":
        return "bg-gray-100 text-gray-500 border border-gray-200";
      case "CLOSED":
        return "bg-gray-200 text-gray-400 border border-gray-300";
      default:
        return "bg-gray-50 text-gray-400";
    }
  }, [computedStatus]);

  // 기본 정보 카드용 텍스트 색상
  const overviewTextColor = useMemo(() => {
    switch (computedStatus) {
      case "DEADLINE_SOON":
        return "text-[#FF5A5A]"; // 빨강
      case "RECRUITING":
        return "text-primary";   // 연두
      case "UPCOMING":
        return "text-[#8B95A1]"; // 회색
      case "CLOSED":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  }, [computedStatus]);

  // 데이터 로딩
  useEffect(() => {
    if (!noticeId || Number.isNaN(parsedId)) {
      setLoading(false);
      return;
    }
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getNoticeDetail(parsedId);
        if (!ignore) setNotice(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [noticeId, parsedId]);

  const onBack = () => navigate("/notices");

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: notice?.title ?? "공고 공유", url });
        return;
      }
      throw new Error("No share API");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        alert("링크가 복사되었습니다!");
      } catch {
        alert("링크 복사에 실패했습니다.");
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 md:px-6">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6 mt-4">
        <button
          onClick={onBack}
          className="group flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
          공고 목록으로 돌아가기
        </button>
      </div>

      {/* 헤더 영역 */}
      <div className="mb-8 border-b border-gray-100 pb-8">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-24 rounded bg-gray-200" />
            <div className="h-8 w-3/4 rounded bg-gray-200" />
          </div>
        ) : (
          <div>
            {/* 뱃지 라인 */}
            <div className="flex items-center gap-2 mb-3">
              {/* 상태 뱃지 */}
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${headerBadgeStyle}`}>
                {statusText}
              </span>

              {/* D-Day */}
              {computedStatus !== "CLOSED" && dDayText && (
                <span className={`text-sm font-bold ${dDayDays !== null && dDayDays <= 3 ? "text-red-500" : "text-gray-500"}`}>
                  {dDayText}
                </span>
              )}
            </div>

            {/* 타이틀 & 공유 버튼 */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
                {notice?.title}
              </h1>
              <button
                onClick={onShare}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                title="공유하기"
              >
                <span className="material-symbols-outlined text-[22px]">share</span>
              </button>
            </div>

            {/* 기간 표시 */}
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 font-medium">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              {notice?.startDate} ~ {notice?.endDate}
            </div>
          </div>
        )}
      </div>

      {/* 레이아웃 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        
        {/* 상세 정보 & 링크 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <NoticeOverviewCard 
            loading={loading} 
            notice={notice} 
            statusText={statusText} 
            textColor={overviewTextColor}
          />

          <NoticeQuickLinksCard
            loading={loading}
            pdf={notice?.pdfUrl ?? null}
            url={notice?.url ?? null} 
          />
        </div>

        {/* AI 챗봇 */}
        <div className="lg:col-span-2 sticky top-6 h-[calc(100vh-100px)] min-h-[600px] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <NoticeChatbotPanel 
            noticeTitle={notice?.title} 
            noticeId={notice?.id}
          />
        </div>
      </div>
    </div>
  );
}