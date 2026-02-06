import FadeInWhenVisible from "./FadeInWhenVisible";

interface IntroProps {
  onComplete: () => void;
}

export default function CheckinIntro({ onComplete }: IntroProps) {
  return (
    <>
      {/* --------------------------------------------------------------------------------
          Step 1: 첫 인사
      -------------------------------------------------------------------------------- */}
      <section className="h-full w-full flex-shrink-0 snap-start flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="max-w-2xl space-y-6">
          <FadeInWhenVisible delay="0.2s">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight break-keep">
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
            <h2 className="text-2xl md:text-5xl font-bold text-gray-800 leading-snug break-keep">
              막막한 시작이 <span className="text-primary">확신</span>이 되도록,<br />
              당신의 든든한 가이드가 되어 드릴게요.
            </h2>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay="0.5s">
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed break-keep mt-4">
              복잡한 용어부터 나에게 맞는 집 찾기까지,<br />
              주인님은 그저 편안하게 따라오시면 됩니다.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* --------------------------------------------------------------------------------
          Step 3: 행동 유도
      -------------------------------------------------------------------------------- */}
      <section className="h-full w-full flex-shrink-0 snap-start flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-3xl flex flex-col items-center justify-center space-y-10">
          
          <FadeInWhenVisible delay="0.2s">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight break-keep">
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
