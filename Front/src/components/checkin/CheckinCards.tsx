import { useNavigate } from "react-router-dom";

export default function CheckinCards() {
  const navigate = useNavigate();

  return (
    <main className="h-full w-full snap-start flex items-center justify-center bg-white px-4 md:px-8 py-16">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card A: 퀴즈 */}
        <div 
          onClick={() => navigate("/checkin/quiz")}
          className="group relative overflow-hidden rounded-[28px] shadow-xl bg-[#0e1712] p-10 min-h-[420px] flex flex-col justify-center items-center text-center cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-white mb-4">청약 용어 퀴즈</h2>
          <p className="text-white/70 mb-10">"3분이면 충분합니다. 주인님의 실력을 확인해 보세요."</p>
          <button className="rounded-full bg-white px-8 py-3 font-bold text-primary">도전하기</button>
        </div>

        {/* Card B: 성향 테스트 */}
        <div 
          onClick={() => navigate("/checkin/preference")}
          className="group relative overflow-hidden rounded-[28px] shadow-xl border bg-white p-10 min-h-[420px] flex flex-col justify-center items-center text-center cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">주거 성향 테스트</h2>
          <p className="text-gray-600 mb-10">"헤매지 말고 체크인! 주인님께 꼭 맞는 공고를 찾아 드릴게요."</p>
          <button className="rounded-full bg-primary px-8 py-3 font-bold text-white">검사 시작</button>
        </div>
      </div>
    </main>
  );
}