import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Notice } from "./NoticesPage";
import { getNoticeDetail } from "../api/NoticeApi";

interface NoticeWithSummary extends Notice {
  summary: string | null;
}

import NotFoundPage from "../pages/NotFoundPage";

import NoticeDetailHeader from "../components/noticeDetail/NoticeDetailHeader";
import NoticeOverviewCard from "../components/noticeDetail/NoticeOverviewCard";
import NoticeQuickLinksCard from "../components/noticeDetail/NoticeQuickLinksCard";
import NoticeChatbotPanel from "../components/noticeDetail/NoticeChatbotPanel";
import NoticeAiSummary from "../components/noticeDetail/NoticeAiSummary";

import { computeNoticeStatus } from "../utils/noticeStatus";
import { noticeStatusLabel } from "../utils/noticeFormat";

import { AxiosError } from "axios";

// D-Day 계산 유틸
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
  return { text: null, days: null };
}

export default function NoticeDetailPage() {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();

  const [notice, setNotice] = useState<NoticeWithSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  const parsedId = useMemo(() => {
    if (!noticeId) return NaN;
    const n = Number(noticeId);
    if (!Number.isInteger(n) || n <= 0) return NaN;
    return n;
  }, [noticeId]);

  // 날짜 기반 상태 계산
  const computedStatus = useMemo(
    () => (notice ? computeNoticeStatus(notice.startDate, notice.endDate) : null),
    [notice]
  );

  // 상태 텍스트
  const statusText = noticeStatusLabel(computedStatus);

  // D-Day 정보 계산
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
        return "text-[#FF5A5A]";
      case "RECRUITING":
        return "text-primary";
      case "UPCOMING":
        return "text-[#8B95A1]";
      case "CLOSED":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  }, [computedStatus]);

  // 데이터 로딩
  useEffect(() => {
    // 파라미터 형식 자체가 잘못되면 즉시 404 처리
    if (!noticeId || Number.isNaN(parsedId)) {
      setNotice(null);
      setNotFound(true);
      setLoading(false);
      return;
    }

    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const data = await getNoticeDetail(parsedId);

        // 서버가 200을 주더라도 데이터가 비정상(없음)이면 404로 처리
        if (!data || data.id !== parsedId) {
          if (!ignore) {
            setNotice(null);
            setNotFound(true);
          }
          return;
        }

        if (!ignore) setNotice(data);
        } catch (e: unknown) {
          // AxiosError(서버가 진짜 404 내려준 경우)
          if (e instanceof AxiosError) {
            if (!ignore && e.response?.status === 404) {
              setNotice(null);
              setNotFound(true);
            }
            console.error(e);
            return;
          }

          // 커스텀 404(서버가 200을 줬지만 우리가 404로 간주한 경우)
          const status =
            typeof e === "object" && e !== null && "status" in e
              ? (e as { status?: number }).status
              : undefined;

          if (!ignore && status === 404) {
            setNotice(null);
            setNotFound(true);
          }

          console.error(e);
        } finally {
          if (!ignore) setLoading(false);
        }
    })();

    return () => {
      ignore = true;
    };
  }, [noticeId, parsedId]);

  // 로딩 중일 때는 화면을 그리지 않음
    if (loading) {
      return null; 
    }

    // 404 상태이거나 로딩이 끝났는데 데이터(notice)가 없는 경우 처리
    if (notFound || !notice) {
      return <NotFoundPage />;
    }

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

      <div className="mb-8 border-b border-gray-100 pb-8">
        <NoticeDetailHeader
          noticeId={notice?.id ?? null}
          loading={loading}
          title={notice?.title ?? ""}
          startDate={notice?.startDate ?? ""}
          endDate={notice?.endDate ?? ""}
          statusText={statusText}
          badgeStyle={headerBadgeStyle}
          dDayText={dDayText}
          isUrgent={dDayDays !== null && dDayDays <= 3}
          onShare={onShare}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <NoticeOverviewCard
            loading={loading}
            notice={notice}
            statusText={statusText}
            textColor={overviewTextColor}
          />

          {!loading && notice && (
             <NoticeAiSummary summary={notice.summary ?? undefined} />
          )}
          
          <NoticeQuickLinksCard
            loading={loading}
            pdf={notice?.pdfUrl ?? null}
            url={notice?.originUrl ?? null}
          />
        </div>

        <div className="lg:col-span-2 sticky top-6 h-[calc(100vh-100px)] min-h-[600px] overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <NoticeChatbotPanel noticeTitle={notice?.title} />
        </div>
      </div>
    </div>
  );
}
