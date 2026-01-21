export default function QuickCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="relative overflow-hidden group cursor-pointer bg-gradient-to-br from-[#111814] to-[#1a2e22] rounded-[2.5rem] p-8 text-white shadow-xl hover:shadow-primary/10 transition-all border border-white/5">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">오늘의 주거 퀴즈</h3>
            <p className="text-gray-400 font-medium">
              매일 퀴즈 풀고 '서울 포인트'를 적립하세요!
            </p>
            <button className="mt-6 bg-white text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all">
              도전하기
            </button>
          </div>
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
            <span className="material-symbols-outlined text-5xl text-primary">quiz</span>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
      </div>

      <div className="relative overflow-hidden group cursor-pointer glass rounded-[2.5rem] p-8 text-[#111814] dark:text-white shadow-xl hover:shadow-2xl transition-all border border-primary/20">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">주거 성향 진단</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              나에게 딱 맞는 서울 라이프스타일 찾기
            </p>
            <button className="mt-6 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:brightness-105 shadow-lg shadow-primary/20 transition-all">
              검사 시작
            </button>
          </div>
          <div className="bg-primary/10 p-4 rounded-3xl">
            <span className="material-symbols-outlined text-5xl text-primary">
              leaderboard
            </span>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl transition-all" />
      </div>
    </section>
  );
}
