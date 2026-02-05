// Front/src/components/home/HeroSearch.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HeroSearch() {
  const navigate = useNavigate();

  const goChatbotDirect = () => {
    navigate("/chatbot");
  };

  // ----------------------------------------------------------------------
  // [Effect] 타이핑 효과
  // ----------------------------------------------------------------------
  const fullText = "청년 매입임대 공고에 대해 알려줘";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    setTypedText("");

    const startTypingDelay = setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        i++;
        setTypedText(fullText.slice(0, i));
        if (i === fullText.length) clearInterval(typeInterval);
      }, 80);
      return () => clearInterval(typeInterval);
    }, 1400);

    return () => clearTimeout(startTypingDelay);
  }, []);

  return (
    <section className="flex flex-col items-center justify-center text-left max-w-4xl w-full px-4 relative z-10">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        .animate-enter {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
        .delay-0 { animation-delay: 0ms; }
        .delay-100 { animation-delay: 150ms; }
        .delay-200 { animation-delay: 300ms; }
        .delay-300 { animation-delay: 450ms; }
        
        /* 텍스트 그라데이션 애니메이션 (선택사항: 색이 은은하게 흐름) */
        .text-gradient {
          background-size: 200% auto;
          animation: gradientMove 5s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* 배경 장식 (선택사항: 은은한 배경 빛) */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 blur-[100px] rounded-full -z-10 pointer-events-none" /> */}

      <div className="mb-10 flex flex-col items-center text-center">
        {/* 1. 로고 영역 */}
        <div className="animate-enter delay-0 mb-12 mt-10 flex items-center">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* 2중 글로우 효과로 깊이감 추가 */}
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-primary/40 blur-xl" />
            {/* 심볼이 없다면 이 부분은 빛만 남습니다 */}
          </div>
        </div>

        {/* 2. 제목 영역: 그라데이션 텍스트 적용 */}
        <h1 className="animate-enter delay-100 text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
          안녕하세요, <br className="md:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-indigo-500 text-gradient">
            서울집사
          </span>입니다.
          <br />
          <span className="block mt-2 text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-200">
            무엇을 도와드릴까요?
          </span>
        </h1>

        {/* 3. 설명 텍스트 */}
        <p className="animate-enter delay-200 text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
          서울시 청년 및 신혼부부를 위한 맞춤형 주거 정책과 <br className="hidden sm:block"/>
          임대 주택 정보를 AI가 분석해 드립니다.
        </p>
      </div>

      {/* 4. 검색바 영역: 글래스모피즘(backdrop-blur) 적용 */}
      <div
        role="button"
        tabIndex={0}
        onClick={goChatbotDirect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") goChatbotDirect();
        }}
        className="
          animate-enter delay-300
          group w-full max-w-3xl p-2 rounded-[2rem] 
          
          /* [Upgrade] 글래스모피즘: 반투명 배경 + 블러 */
          bg-white/80 dark:bg-gray-800/80 
          backdrop-blur-md
          
          border border-white/20 dark:border-gray-700/50
          shadow-[0px_8px_30px_rgba(0,0,0,0.06)]
          hover:shadow-[0px_20px_40px_rgba(0,0,0,0.12)]
          
          hover:-translate-y-1
          cursor-pointer transition-all duration-300 ease-out
          relative overflow-hidden
        "
        aria-label="AI 채팅으로 이동"
      >
        <div className="relative flex items-center gap-4 px-6 py-2">
          
          <div className="flex-1 text-left flex items-center">
            <span className="
              text-gray-700 dark:text-gray-100 
              text-[16px] md:text-[18px] 
              font-medium whitespace-nowrap
            ">
              {typedText}
            </span>
            <span className="inline-block w-[2px] h-5 bg-primary ml-0.5 align-middle [animation:pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
          </div>

          {/* [Upgrade] 버튼 쉬머(Shimmer) 효과 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goChatbotDirect();
            }}
            className="
              relative overflow-hidden
              flex-none shrink-0
              w-12 h-12 p-0
              aspect-square
              rounded-full
              inline-flex items-center justify-center
              transition-all duration-300 ease-out
              bg-primary text-white
              shadow-md shadow-primary/30
              group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/40
              active:scale-95
            "
            aria-label="채팅 이동"
          >
            {/* 빗살무늬 빛 지나가는 효과 */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-20" />
            
            <span className="material-symbols-outlined text-[24px] leading-none relative z-10">
              arrow_upward
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}