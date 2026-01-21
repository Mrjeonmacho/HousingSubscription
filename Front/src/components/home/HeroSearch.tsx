export default function HeroSearch() {
  return (
    <section className="flex flex-col items-center justify-center text-center pt-8 pb-12 max-w-4xl mx-auto w-full">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-primary to-[#54e3a4] rounded-full flex items-center justify-center text-white mb-6 shadow-2xl shadow-primary/40">
          <span className="material-symbols-outlined text-4xl leading-none">
            auto_awesome
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          안녕하세요, <span className="text-primary">서울집사</span>입니다.
          <br />
          무엇을 도와드릴까요?
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
          서울시 청년 및 신혼부부를 위한 맞춤형 주거 정책과 임대 주택 정보를 AI가 분석해 드립니다.
        </p>
      </div>

      <div className="w-full max-w-3xl glass p-2 rounded-[2rem] shadow-2xl border border-white/60 group focus-within:ring-4 ring-primary/10 transition-all">
        <div className="flex items-center gap-4 px-6 py-3">
          <span className="material-symbols-outlined text-gray-400">search</span>
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder:text-gray-400 font-medium"
            placeholder="SH 청년 매입임대 공고에 대해 알려줘"
            type="text"
          />
          <button className="bg-primary text-white p-3 rounded-2xl hover:scale-105 shadow-lg shadow-primary/20 transition-transform">
            <span className="material-symbols-outlined">arrow_upward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
