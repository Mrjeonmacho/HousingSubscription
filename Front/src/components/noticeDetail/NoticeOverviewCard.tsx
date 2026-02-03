import { categoryLabel, statusLabel } from "../../utils/noticeFormat";
import type { Notice } from "../../pages/NoticesPage";

type Props = {
  loading: boolean;
  notice: Notice | null;
  statusText?: string;
  textColor?: string;
};

// Fallback 색상 로직 (props 없을 때)
function getFallbackColor(status: string | null) {
  if (!status) return "text-gray-400";
  const s = status as string;
  
  if (s === "RECEIVING" || s === "OPEN" || s === "RECRUITING") return "text-primary"; 
  if (s === "DEADLINE_APPROACHING") return "text-[#FF5A5A]";
  if (s === "TO_BE_ANNOUNCED" || s === "SCHEDULED") return "text-[#8B95A1]";
  return "text-gray-400";
}

export default function NoticeOverviewCard({ loading, notice, statusText, textColor }: Props) {
  if (loading || !notice) return <div className="h-64 rounded-3xl bg-gray-50 animate-pulse" />;

  const displayStatus = statusText || statusLabel(notice.status);
  const displayColor = textColor || getFallbackColor(notice.status);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
      {/* 섹션 제목 */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-5 w-1.5 rounded-full bg-primary" />
        <h2 className="text-lg font-bold text-gray-900">공고 기본 정보</h2>
      </div>

      {/* 정보 그리드 */}
      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-12">
        <div>
          <p className="text-xs font-medium text-gray-400">공고 등록 번호</p>
          <p className="mt-1 text-base font-bold text-gray-900">{notice.noticeNo}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400">공고 분류</p>
          <p className="mt-1 text-base font-bold text-gray-900">{categoryLabel(notice.category)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400">공고 등록일</p>
          <p className="mt-1 text-base font-bold text-gray-900">{notice.regDate}</p>
        </div>
        
        <div>
          <p className="text-xs font-medium text-gray-400">모집 공고 상태</p>
          <p className={`mt-1 text-base font-bold ${displayColor}`}>
            {displayStatus}
          </p>
        </div>
      </div>

      {/* 접수 기간 박스 */}
      <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
        <p className="mb-2 text-xs font-bold text-emerald-600">청약 접수 기간</p>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600">calendar_month</span>
          <span className="text-base font-bold text-gray-900">
            {notice.startDate} ~ {notice.endDate}
          </span>
        </div>
      </div>
    </section>
  );
}