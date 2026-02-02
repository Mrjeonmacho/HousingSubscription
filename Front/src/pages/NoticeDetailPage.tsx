import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Notice } from "./NoticesPage";
import { getNoticeDetail } from "../api/NoticeApi";

import NoticeDetailHeader from "../components/noticeDetail/NoticeDetailHeader";
import NoticeOverviewCard from "../components/noticeDetail/NoticeOverviewCard";
import NoticeQuickLinksCard from "../components/noticeDetail/NoticeQuickLinksCard";
import NoticeChatbotPanel from "../components/noticeDetail/NoticeChatbotPanel";

// D-Day 계산 유틸
function calcDDay(endDate: string | null) {
  if (!endDate) return null;
  const today = new Date();
  const end = new Date(endDate);
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
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

  const dday = useMemo(() => (notice ? calcDDay(notice.endDate) : null), [notice]);

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
    return () => { ignore = true; };
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

      {/* 헤더 */}
      <div className="mb-8 border-b border-gray-100 pb-8">
        <NoticeDetailHeader
          noticeId={notice?.id ?? null}
          title={notice?.title ?? "공고 로딩중..."}
          status={notice?.status ?? null}
          dday={dday}
          loading={loading}
          onShare={onShare}
        />
      </div>

      {/* 레이아웃 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        
        {/* 상세 정보 & 링크 */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <NoticeOverviewCard loading={loading} notice={notice} />

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