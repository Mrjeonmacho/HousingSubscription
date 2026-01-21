import { notices, type NoticeStatus } from "../../data/notices";

function StatusBadge({ status }: { status: NoticeStatus }) {
  const cls =
    status === "진행중" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400";

  return (
    <span className={`px-3 py-1 rounded-full ${cls} text-[10px] font-bold`}>
      {status}
    </span>
  );
}

export default function NoticeCarousel() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">최근 주거 공고</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            지금 신청 가능한 서울시 맞춤형 공고입니다.
          </p>
        </div>

        <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
          전체보기 <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>

      <div className="flex overflow-x-auto gap-6 no-scrollbar pb-6 -mx-4 px-4">
        {notices.map((item) => (
          <div
            key={item.id}
            className="min-w-[320px] glass p-6 rounded-3xl border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all group shrink-0"
          >
            <div className="flex justify-between items-start mb-4">
              <span
                className={`px-3 py-1 rounded-full ${item.category.badgeClass} text-[10px] font-bold uppercase`}
              >
                {item.category.label}
              </span>
              <StatusBadge status={item.status} />
            </div>

            <h3 className="text-lg font-bold mb-4 line-clamp-2">{item.title}</h3>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                <span>{item.period}</span>
              </div>
            </div>

            {item.disabled ? (
              <button className="w-full py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm font-bold opacity-50 cursor-not-allowed">
                공고 종료
              </button>
            ) : (
              <button className="w-full py-3 bg-gray-50 dark:bg-white/5 rounded-xl text-sm font-bold group-hover:bg-primary group-hover:text-white transition-all">
                공고 상세보기
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
