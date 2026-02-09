import { useRef } from "react";
import FadeInWhenVisible from "./FadeInWhenVisible";

interface IntroProps {
  onComplete: () => void;
}

export default function CheckinIntro({ onComplete }: IntroProps) {
  // Step 1 섹션으로 이동하기 위한 Ref
  const step1Ref = useRef<HTMLElement>(null);

  // 처음 방문일 경우 Step 1으로 스크롤
  const handleFirstTime = () => {
    step1Ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* --------------------------------------------------------------------------------
          Step 0: 처음 방문 여부 확인 (New)
      -------------------------------------------------------------------------------- */}
      <section className="h-full w-full flex-shrink-0 snap-start flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="max-w-2xl space-y-8">
          <FadeInWhenVisible delay="0.2s">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight break-keep">
              안녕하세요!<br />
              <span className="text-primary">서울집사</span> 방문이 처음이신가요?
            </h1>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible delay="0.4s">
            <p className="text-gray-400 text-lg md:text-xl break-keep">
              처음오셨다면 튜토리얼을 통해 안내해 드리고,<br />
              이미 익숙하시다면 바로 체크인을 시작할 수 있어요.
            </p>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay="0.6s">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
              {/* 처음입니다 -> Step 1로 이동 */}
              <button
                onClick={handleFirstTime}
                className="w-full md:w-auto px-8 py-4 rounded-full bg-primary text-white text-lg font-bold shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
              >
                네, 처음입니다
              </button>

              {/* 아닙니다 -> 바로 CheckinCards (onComplete 실행) */}
              <button
                onClick={onComplete}
                className="w-full md:w-auto px-8 py-4 rounded-full bg-gray-100 text-gray-600 text-lg font-bold hover:bg-gray-200 transition-all"
              >
                아니요, 바로 시작할래요
              </button>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------
          Step 1: 첫 인사 (ref 추가됨)
      -------------------------------------------------------------------------------- */}
      <section 
        ref={step1Ref} 
        className="h-full w-full flex-shrink-0 snap-start flex flex-col items-center justify-center bg-white px-6 text-center"
      >
        <div className="max-w-2xl space-y-6">
          <FadeInWhenVisible delay="0.2s">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight break-keep">
              청약이 처음인 당신을 위해,<br />
              <span className="text-primary">서울집사</span>가 마중 나왔습니다.
            </h1>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible delay="0.6s">
            <p className="text-gray-400 text-lg md:text-xl">
              아래로 내려서 집사를 만나보세요.
            </p>
          </FadeInWhenVisible>

          {/* 화살표 애니메이션 */}
          <FadeInWhenVisible delay="1.0s">
            <div className="mt-10 animate-bounce text-gray-300 mt-6">
              <span className="material-symbols-outlined text-4xl">keyboard_arrow_down</span>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------
          Step 2: 신뢰 형성
      -------------------------------------------------------------------------------- */}
      <section className="h-full w-full flex-shrink-0 snap-start flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <div className="max-w-3xl space-y-6">
          <FadeInWhenVisible delay="0.2s">
            <h2 className="text-2xl md:text-5xl font-extrabold text-gray-800 leading-snug break-keep">
              막막한 시작이 <span className="text-primary">확신</span>이 되도록,<br />
              당신의 든든한 가이드가 되어 드릴게요.
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay="0.5s">
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed break-keep mt-4">
              복잡한 용어부터 나에게 맞는 집 찾기까지,<br />
              그저 편안하게 따라오시면 됩니다.
            </p>
          </FadeInWhenVisible>
          
          {/* 화살표 애니메이션 */}
          <FadeInWhenVisible delay="1.0s">
            <div className="mt-10 animate-bounce text-gray-300 mt-6">
              <span className="material-symbols-outlined text-4xl">keyboard_arrow_down</span>
            </div>
          </FadeInWhenVisible>
        
        </div>
      </section>

      {/* --------------------------------------------------------------------------------
          Step 3: 행동 유도
      -------------------------------------------------------------------------------- */}
      <section className="h-full w-full flex-shrink-0 snap-start flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl flex flex-col items-center justify-center space-y-10">
          
          <FadeInWhenVisible delay="0.2s">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight break-keep">
              본격적인 탐색 전,<br />
              집사와 함께 <span className="relative inline-block">
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-primary/20 -z-10"></span>
                '체크인'
              </span>을 시작해 볼까요?
            </h2>
          </FadeInWhenVisible>
          
          <FadeInWhenVisible delay="0.6s">
            <div className="mt-20 relative group">
              <div className="absolute -inset-1 rounded-full bg-primary/60 blur-md animate-pulse"></div>
              
              <button
                onClick={onComplete}
                className="relative inline-flex items-center justify-center gap-2 rounded-full bg-primary px-10 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95"
              >
                지금 체크인하기
              </button>
            </div>
          </FadeInWhenVisible>

        </div>
      </section>
    </>
  );
}
