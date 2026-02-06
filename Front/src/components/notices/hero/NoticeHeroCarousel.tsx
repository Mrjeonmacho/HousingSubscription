// Front/src/components/notices/hero/NoticeHeroCarousel.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Notice } from "../../../pages/NoticesPage";
import { categoryLabel } from "../../../utils/noticeFormat";
import { getNoticeComputedStatusText } from "../../../utils/noticeComputedText";

type NoticeHeroCarouselProps = {
  items: Notice[];
  autoPlayMs?: number; 
};

const HERO_IMAGES = [
  "/hero/hero-1.jpg",
  "/hero/hero-2.jpg",
  "/hero/hero-3.jpg",
  "/hero/hero-4.jpg",
  "/hero/hero-5.jpg",
] as const;

const FADE_MS = 420;

function getHeroBgByIndex(index: number) {
  return HERO_IMAGES[index % HERO_IMAGES.length];
}

function formatDate(dateStr: string | null) {
  return dateStr ?? "-";
}

export default function NoticeHeroCarousel({
  items,
  autoPlayMs = 5000,
}: NoticeHeroCarouselProps) {
  const navigate = useNavigate();

  const slides = useMemo(() => (items ?? []).slice(0, 5), [items]);
  const count = slides.length;
  const canSlide = count > 1;

  const [index, setIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const pausedRef = useRef(false);

  const [bgFront, setBgFront] = useState(() => getHeroBgByIndex(0));
  const [bgBack, setBgBack] = useState<string | null>(null);
  const [fading, setFading] = useState(false);

  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const current = useMemo(() => {
    if (count === 0) return null;
    const safe = Math.min(visibleIndex, count - 1);
    return slides[safe] ?? null;
  }, [slides, visibleIndex, count]);

  useEffect(() => {
    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      (img as HTMLImageElement).decode?.().catch(() => {});
    });
  }, []);

  const slidesKey = useMemo(
    () => slides.map((s) => String(s.id)).join("|"),
    [slides]
  );

  useEffect(() => {
    if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    rafRef.current = null;
    timeoutRef.current = null;

    const resetTimer = setTimeout(() => {
      setIndex(0);
      setVisibleIndex(0);
      setBgFront(getHeroBgByIndex(0));
      setBgBack(null);
      setFading(false);
    }, 0);

    return () => clearTimeout(resetTimer);
  }, [slidesKey]);

  const go = useCallback(
    (nextIndex: number) => {
      if (count === 0) return;
      const normalized = ((nextIndex % count) + count) % count;
      if (normalized === index) return;

      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
      rafRef.current = null;
      timeoutRef.current = null;

      setIndex(normalized);
      const nextSrc = getHeroBgByIndex(normalized);
      setBgBack(nextSrc);

      rafRef.current = window.requestAnimationFrame(() => {
        setFading(true);
      });

      timeoutRef.current = window.setTimeout(() => {
        setBgFront(nextSrc);
        setBgBack(null);
        setFading(false);
        setVisibleIndex(normalized);
        timeoutRef.current = null;
      }, FADE_MS);
    },
    [count, index]
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    if (!autoPlayMs || autoPlayMs <= 0) return;
    if (!canSlide) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      go(index + 1);
    }, autoPlayMs);

    return () => window.clearInterval(id);
  }, [autoPlayMs, canSlide, go, index]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  // --------------------------------------------------------------------------
  // [Render] 데이터 없음 (NoticeHeroCarousel.tsx 내부)
  // --------------------------------------------------------------------------
  if (!current) {
    return (
      <section className="relative overflow-hidden rounded-[1.2rem] bg-gray-900 text-white shadow-lg min-h-[340px] md:min-h-[450px] isolate">
        {/* 1. 배경 레이어: 메인 캐러셀의 깊이감과 톤을 유지 */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#062015] via-[#04150E] to-[#020A06]" />
          {/* 장식용 빛 효과 (글래스모피즘 느낌 강조) */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/15 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[#02120A]/20" />
        </div>

        {/* 2. 콘텐츠 영역: 메인 캐러셀과 동일한 정렬 및 애니메이션 적용 */}
        <div className="relative z-10 flex h-full flex-col justify-end px-12 py-12 md:px-28 lg:px-32 pb-24">
          <div className="animate-fade-in-up flex flex-col items-start">
            
            {/* 상태 배지: 메인 캐러셀의 카테고리 뱃지 스타일 차용 */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold backdrop-blur-md shadow-lg mb-5">
              <span className="text-gray-400">STATUS</span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="text-white/70">준비 중</span>
            </div>

            {/* 메인 텍스트: 줄바꿈 처리를 통해 가독성 확보 */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed md:leading-relaxed lg:leading-relaxed tracking-tight text-white/90 drop-shadow-sm">
              현재 진행 중이거나 예정된 공고가 없습니다. 
              <br /> 
              <span className="block mt-2">곧 새로운 소식으로 찾아올게요!</span>
            </h2>
          </div>
        </div>

        {/* 3. 하단 장식 (캐러셀의 인디케이터와 시각적 균형) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 opacity-30">
          <div className="h-1.5 w-8 bg-white/50 rounded-full" />
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // [Render] 메인 캐러셀
  // --------------------------------------------------------------------------
  return (
    <section
      className="group relative overflow-hidden rounded-[1.2rem] bg-gray-900 text-white shadow-lg isolate transform transition-transform duration-300 min-h-[340px] md:min-h-[450px]"
      onClick={() => navigate(`/notices/${current.id}`)}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* 배경 레이어 */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgFront}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[2000ms] ease-out hover:scale-105"
          style={{ willChange: "transform, opacity" }}
          draggable={false}
        />
        {bgBack && (
          <img
            src={bgBack}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{
              opacity: fading ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
              willChange: "opacity",
            }}
            draggable={false}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02120A]/90 via-[#041A10]/50 to-[#072615]/35" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end px-12 py-12 md:px-28 lg:px-32 pb-24">
        
        <div key={current.id} className="animate-fade-in-up flex flex-col items-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-md shadow-lg">
            <span className="text-primary-300">
              {categoryLabel(current.category ?? undefined)}
            </span>
            <span className="h-3 w-[1px] bg-white/30" />
            <span className="text-white/90">
              {getNoticeComputedStatusText(current)}
            </span>
          </div>

          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
            {current.title}
          </h2>

          <div className="mt-6 flex items-center gap-2 text-white/80 font-medium bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span>마감일 : {formatDate(current.endDate)}</span>
          </div>
        </div>
      </div>

      {/* 공고 보러 가기 버튼 */}
      <div className="absolute bottom-10 right-10 z-20 md:bottom-20 md:right-25">
        <div
          className="
            pointer-events-none inline-flex items-center gap-2
            rounded-full border border-white/20 bg-white/10
            px-5 py-2 text-sm font-semibold text-white/90
            backdrop-blur-md shadow-lg
            transition-all duration-300
            group-hover:bg-white group-hover:text-black group-hover:scale-[1.02]
          "
          aria-hidden
        >
          <span>공고 보러 가기</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </div>
      </div>

      {/* 좌우 네비게이션 버튼 */}
      {canSlide && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="이전 공고"
            className="
              absolute left-4 top-1/2 -translate-y-1/2 z-20
              flex h-12 w-12 items-center justify-center rounded-full 
              border border-white/10 bg-black/20 text-white/70 backdrop-blur-md
              transition-all duration-300 
              hover:bg-white hover:text-black hover:scale-110
              md:left-8 opacity-0 group-hover:opacity-100
            "
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="다음 공고"
            className="
              absolute right-4 top-1/2 -translate-y-1/2 z-20
              flex h-12 w-12 items-center justify-center rounded-full 
              border border-white/10 bg-black/20 text-white/70 backdrop-blur-md
              transition-all duration-300 
              hover:bg-white hover:text-black hover:scale-110
              md:right-8 opacity-0 group-hover:opacity-100
            "
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </>
      )}

      {/* 인디케이터 (Pagination) */}
      {canSlide && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  go(i);
                }}
                aria-label={`슬라이드 ${i + 1}`}
                className={`
                  h-1.5 rounded-full transition-all duration-500 ease-out cursor-pointer
                  ${active ? "w-8 bg-white" : "w-1.5 bg-white/30 hover:bg-white/50"}
                `}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
