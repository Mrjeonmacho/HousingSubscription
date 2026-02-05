// Front/src/components/noticeDetail/NoticeOverviewCard.tsx
import { categoryLabel } from "../../utils/noticeFormat";
import { computeNoticeStatus, type ComputedNoticeStatus } from "../../utils/noticeStatus";
import { noticeStatusLabel } from "../../utils/noticeFormat"; // 이 함수는 computed -> 한글 라벨
import type { Notice } from "../../pages/NoticesPage";

type Props = {
  loading: boolean;
  notice: Notice | null;

  // 외부에서 강제로 표시 텍스트/색상을 주고 싶을 때만 사용
  statusText?: string;
  textColor?: string;
};

function getColorByComputedStatus(status: ComputedNoticeStatus | null) {
  switch (status) {
    case "RECRUITING":
      return "text-primary";
    case "DEADLINE_SOON":
      return "text-[#FF5A5A]";
    case "UPCOMING":
      return "text-[#8B95A1]";
    case "CLOSED":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
}

export default function NoticeOverviewCard({
  loading,
  notice,
  statusText,
  textColor,
}: Props) {
  if (loading || !notice) return <div className="h-64 rounded-3xl bg-gray-50 animate-pulse" />;

  // 1) 날짜 기반 상태 계산
  const computed = computeNoticeStatus(notice.startDate, notice.endDate);

  // 2) 표시 텍스트: (외부 지정) > (날짜 기반 라벨)
  const displayStatus = statusText || noticeStatusLabel(computed);

  // 3) 컬러: (외부 지정) > (날짜 기반)
  const displayColor = textColor || getColorByComputedStatus(computed);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="h-5 w-1.5 rounded-full bg-primary" />
        <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">공고 기본 정보</h2>
      </div>

      <div className="space-y-4 px-1">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-gray-400">공고 분류</span>
          <span className="text-[15px] font-semibold text-gray-900">
            {categoryLabel(notice.category)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-gray-400">공고 등록일</span>
          <span className="text-[15px] font-semibold text-gray-900">{notice.regDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-gray-400">모집 공고 상태</span>
          <span className={`text-[15px] font-bold ${displayColor}`}>{displayStatus}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100/50">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[12px] font-bold text-emerald-600/80 uppercase tracking-wider">
            청약 접수 기간
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-[20px]">
            calendar_today
          </span>
          <span className="text-[16px] font-bold text-gray-900 tracking-tight">
            {notice.startDate} ~ {notice.endDate}
          </span>
        </div>
      </div>
    </section>
  );
}
