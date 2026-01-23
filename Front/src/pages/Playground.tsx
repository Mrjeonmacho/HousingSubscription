import { useNavigate } from "react-router-dom";

export default function Playground() {
    const navigate = useNavigate();

    return (
        // App.css의 #root(text-align:center, padding 등) 영향을 페이지 레벨에서 최대한 상쇄
        <div className="w-full text-left">
        <main className="mx-auto w-full max-w-6xl px-4 md:px-8 py-16">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left card: Quiz */}
            <div className="relative overflow-hidden rounded-[28px] shadow-xl">
                {/* background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0e1712] via-[#0f1a14] to-[#173625]" />
                {/* soft glow */}
                <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

                <div className="relative p-10 min-h-[420px] flex flex-col justify-center items-center text-center">
                <div className="mb-8">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[30px] text-primary">
                        quiz
                    </span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">
                    청약 용어 퀴즈
                </h2>

                <p className="text-sm leading-relaxed text-white/70 mb-10">
                    헷갈리는 청약 용어와 규칙,
                    <br />
                    단답형 퀴즈로 3분 만에 마스터하세요!
                </p>

                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/playground/quiz")}
                        className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-primary shadow-sm hover:brightness-95 active:scale-[0.98] transition"
                    >
                        도전하기
                    </button>
                </div>
                </div>
            </div>

            {/* Right card: Preference test */}
            <div className="relative overflow-hidden rounded-[28px] shadow-xl border border-black/5 bg-white">
                {/* subtle background tint */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary/10" />

                <div className="relative p-10 min-h-[420px] flex flex-col justify-center items-center text-center">
                <div className="mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[30px] text-primary">
                        bar_chart
                    </span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    주거 성향 찾기
                </h2>

                <p className="text-sm leading-relaxed text-gray-600 mb-10">
                    나에게 딱 맞는 집은 어디일까?
                    <br />
                    재미있는 질문으로 나의 스타일을 찾아보세요.
                </p>

                <div>
                    <button
                        type="button"
                        onClick={() => navigate("/playground/test")}
                        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:brightness-105 active:scale-[0.98] transition"
                    >
                        검사 시작
                    </button>
                </div>
                </div>
            </div>
            </section>
        </main>
        </div>
    );
}
