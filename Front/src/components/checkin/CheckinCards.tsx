import { useNavigate } from "react-router-dom";

export default function CheckinCards() {
  const navigate = useNavigate();

  return (
    <main className="h-full w-full flex items-center justify-center bg-white px-4 md:px-8 py-16">
      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 animate-fade-in-up">
            그럼 이제, 체크인을 도와드리겠습니다.
          </h3>
          <p className="text-gray-500 text-sm md:text-base animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            아래에 준비된 체험 중, 궁금한 것부터 골라보시겠어요?
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card A: 청약 용어 퀴즈 */}
          <div 
            onClick={() => navigate("/checkin/quiz")}
            className="group relative overflow-hidden rounded-[28px] shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0e1712] via-[#0f1a14] to-[#173625]" />
            <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />

            <div className="relative p-8 min-h-[380px] flex flex-col justify-center items-center text-center">
              <div className="mb-8 transform transition-transform duration-500 group-hover:scale-110">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[30px] text-primary">
                    quiz
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">
                청약 용어 퀴즈
              </h2>

              <p className="text-sm leading-relaxed text-white/60 mb-8 break-keep">
                3분이면 충분합니다.<br/>당신의 실력을 확인해 보세요.
              </p>

              <button className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-primary shadow-sm hover:brightness-95 transition">
                도전하기
              </button>
            </div>
          </div>

          {/* Card B: 주거 성향 테스트 */}
          <div 
            onClick={() => navigate("/checkin/preference")}
            className="group relative overflow-hidden rounded-[28px] shadow-xl border border-black/5 bg-white transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary/10 opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative p-8 min-h-[380px] flex flex-col justify-center items-center text-center">
              <div className="mb-8 transform transition-transform duration-500 group-hover:scale-110">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[30px] text-primary">
                    bar_chart
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                주거 성향 테스트
              </h2>

              <p className="text-sm leading-relaxed text-black/60 mb-8 break-keep">
                나에게 딱 맞는 집은 어디일까?<br/>당신에게 꼭 맞는 공고를 찾아 드릴게요.
              </p>

              <button className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-white shadow-md shadow-primary/25 hover:brightness-105 transition">
                검사 시작
              </button>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}