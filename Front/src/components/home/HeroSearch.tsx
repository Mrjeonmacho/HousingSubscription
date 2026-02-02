import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const goChatbot = () => {
    const text = q.trim();
    if (!text) return;

    navigate("/chatbot", { state: { initialMessage: text } });
  };

  return (
    <section className="flex flex-col items-center justify-center text-left max-w-4xl w-full">
      <div className="mb-10 flex flex-col items-center text-center">
        
        <div className="mb-20 mt-10 flex items-center">
          <div className="relative w-14 h-14">
            {/* 바깥 글로우 */}
            <div className="absolute -inset-6 rounded-full bg-primary/20 blur-2xl bg-primary/30" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          안녕하세요, <span className="text-primary">서울집사</span>입니다.
          <br />
          <span className="block mt-2">무엇을 도와드릴까요?</span>
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400">
          서울시 청년 및 신혼부부를 위한 맞춤형 주거 정책과 임대 주택 정보를 AI가 분석해 드립니다.
        </p>
      </div>

      <div className="w-full max-w-3xl p-2 rounded-3xl bg-white overflow-hidden
                      shadow-[0px_8px_30px_rgba(0,_0,_0,_0.06)]">
        <div className="flex items-center gap-4 px-6 py-1">
          <span className="material-symbols-outlined text-gray-400">search</span>

          <input
            className="w-full h-10 bg-transparent border-none outline-none
                      focus:outline-none focus:ring-0 focus:border-none
                      placeholder:text-gray-400 text-[15px]"
            placeholder="SH 청년 매입임대 공고에 대해 알려줘"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") goChatbot();
            }}
          />

          <button
            type="button"
            onClick={goChatbot}
            disabled={!q.trim()}
            className={`
              flex-none shrink-0
              !w-12 !h-12 !p-0
              aspect-square
              rounded-full
              inline-flex items-center justify-center
              transition-all duration-300 ease-out
              ${
                q.trim()
                  ? "bg-gradient-to-tr from-primary to-green-500 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
            aria-label="검색 전송"
          >
            <span className="material-symbols-outlined text-[24px] leading-none">
              arrow_upward
            </span>
          </button>

        </div>
      </div>

    </section>
  );
}
