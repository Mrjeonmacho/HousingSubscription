// Front/src/components/noticeDetail/NoticeOverviewCard.tsx
import { categoryLabel, statusLabel } from "../../utils/noticeFormat";
import type { NoticeCategory, NoticeStatus } from "../../utils/noticeFormat";


type NoticeOverview = {
  no: string | null;
  reg_date: string | null;
  category: NoticeCategory | string | null;
  status: NoticeStatus | string | null;
  start_date: string | null;
  end_date: string | null;
};

type Props = {
  loading: boolean;
  notice: NoticeOverview | null;
};

function MaterialIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{
        fontVariationSettings:
          "'FILL' 0, 'wght' 500, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {name}
    </span>
  );
}

function SkeletonCard() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <span className="inline-block h-5 w-1 rounded bg-gray-200 animate-pulse" />
        <div className="h-6 w-32 rounded bg-gray-100 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <div>
            <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
            <div className="mt-2 h-5 w-40 rounded bg-gray-100 animate-pulse" />
          </div>
          <div>
            <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
            <div className="mt-2 h-5 w-24 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
            <div className="mt-2 h-5 w-28 rounded bg-gray-100 animate-pulse" />
          </div>
          <div>
            <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
            <div className="mt-2 h-5 w-20 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <div className="mb-2 h-4 w-24 rounded bg-gray-100 animate-pulse" />
        <div className="h-4 w-60 rounded bg-gray-100 animate-pulse" />
      </div>
    </section>
  );
}

export default function NoticeOverviewCard({ loading, notice }: Props) {
  if (loading) return <SkeletonCard />;
  if (!notice) return null;

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <span className="inline-block h-5 w-1 rounded bg-green-400" />
        <h2 className="text-lg font-bold text-gray-900">공고 기본 정보</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <div>
            <p className="text-xs text-gray-400">공고 등록 번호</p>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {notice.no || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">공고 등록일</p>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {notice.reg_date || "-"}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs text-gray-400">공고 분류</p>
            <p className="mt-1 text-base font-semibold text-gray-900">
              {categoryLabel(notice.category as NoticeCategory | null | undefined)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">모집 공고 상태</p>
            <p className="mt-1 text-base font-semibold text-green-600">
              {statusLabel(notice.status as NoticeStatus | null | undefined)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5">
        <p className="mb-2 text-sm font-semibold text-green-700">
          청약 접수 기간
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-900">
          <MaterialIcon name="event" className="text-green-700" />
          <span className="font-semibold">
            {notice.start_date ?? "-"} ~ {notice.end_date ?? "-"}
          </span>
        </div>
      </div>
    </section>
  );
}
