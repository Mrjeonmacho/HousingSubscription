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

type HeroSlide = {
  id: string; // 인디케이터/키 용도 (가상 슬라이드는 id가 달라야 함)
  notice: Notice;
  bgSrc: string;
};

export default function NoticeHeroCarousel({
  items,
  autoPlayMs = 5000,
}: NoticeHeroCarouselProps) {
  const navigate = useNavigate();

  // ✅ 공고 1개면 "가상 슬라이드" 생성 (배경만 다르게)
  const slides: HeroSlide[] = useMemo(() => {
    const srcItems = items ?? [];
    if (srcItems.length === 0) return [];

    // 2개 이상이면: 기존처럼 공고별 슬라이드 + 배경은 index 기반
    if (srcItems.length > 1) {
      return srcItems.slice(0, 5).map((notice, i) => ({
        id: `notice-${notice.id}`,
        notice,
        bgSrc: getHeroBgByIndex(i),
      }));
    }

    // 1개면: 같은 공고를 배경만 바꿔서 여러 장처럼
    const only = srcItems[0];
    const virtualCount = Math.min(5, HERO_IMAGES.length); // 최대 5장
    return Array.from({ length: virtualCount }, (_, i) => ({
      id: `virtual-${only.id}-${i}`,
      notice: only,
      bgSrc: HERO_IMAGES[i],
    }));
  }, [items]);

  const count = slides.length;
  const canSlide = count > 1;

  const [index, setIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const pausedRef = useRef(false);

  // ✅ 타입 넓혀두기(리터럴 유니온 오류 방지)
  const [bgFront, setBgFront] = useState<string>(() => getHeroBgByIndex(0));
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

  const slidesKey = useMemo(() => slides.map((s) => s.id).join("|"), [slides]);

  const swapBackground = useCallback((nextSrc: string) => {
    if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    rafRef.current = null;
    timeoutRef.current = null;

    setBgBack(nextSrc);

    rafRef.current = window.requestAnimationFrame(() => {
      setFading(true);
    });

    timeoutRef.current = window.setTimeout(() => {
      setBgFront(nextSrc);
      setBgBack(null);
      setFading(false);
      timeoutRef.current = null;
    }, FADE_MS);
  }, []);

  // slides 변경 시 초기화
  useEffect(() => {
    if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    rafRef.current = null;
    timeoutRef.current = null;

    const resetTimer = setTimeout(() => {
      setIndex(0);
      setVisibleIndex(0);

      const first = slides[0]?.bgSrc ?? getHeroBgByIndex(0);
      setBgFront(first);
      setBgBack(null);
      setFading(false);
    }, 0);

    return () => clearTimeout(resetTimer);
  }, [slidesKey, slides]);

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

      const nextSrc = slides[normalized]?.bgSrc ?? getHeroBgByIndex(normalized);
      swapBackground(nextSrc);

      timeoutRef.current = window.setTimeout(() => {
        setVisibleIndex(normalized);
        timeoutRef.current = null;
      }, FADE_MS);
    },
    [count, index, slides, swapBackground]
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  // ✅ 오토플레이는 "슬라이드" 기준으로만 동작 (가상 슬라이드 포함)
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
  // [Render] 데이터 없음
  // --------------------------------------------------------------------------
  if (!current) {
    return (
      <section className="relative overflow-hidden rounded-[1.2rem] bg-gray-900 text-white shadow-lg min-h-[340px] md:min-h-[450px] isolate">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#062015] via-[#04150E] to-[#020A06]" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/15 blur-[120px] rounded-full" />
          <div className="absolute inset-0 bg-[#02120A]/20" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-end px-12 py-12 md:px-28 lg:px-32 pb-24">
          <div className="animate-fade-in-up flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold backdrop-blur-md shadow-lg mb-5">
              <span className="text-gray-400">STATUS</span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="text-white/70">준비 중</span>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed md:leading-relaxed lg:leading-relaxed tracking-tight text-white/90 drop-shadow-sm">
              현재 진행 중이거나 예정된 공고가 없습니다.
              <br />
              <span className="block mt-2">곧 새로운 소식으로 찾아올게요!</span>
            </h2>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 opacity-30">
          <div className="h-1.5 w-8 bg-white/50 rounded-full" />
        </div>
      </section>
    );
  }

  // --------------------------------------------------------------------------
  // [Render] 메인 캐러셀
  // --------------------------------------------------------------------------
  const currentNotice = current.notice;

  return (
    <section
      className="group relative overflow-hidden rounded-[1.2rem] bg-gray-900 text-white shadow-lg isolate transform transition-transform duration-300 min-h-[340px] md:min-h-[450px]"
      onClick={() => navigate(`/notices/${currentNotice.id}`)}
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
        {/* ✅ 가상 슬라이드도 key가 바뀌어서 텍스트 애니메이션이 자연스럽게 재실행 */}
        <div key={current.id} className="animate-fade-in-up flex flex-col items-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-md shadow-lg">
            <span className="text-primary-300">
              {categoryLabel(currentNotice.category ?? undefined)}
            </span>
            <span className="h-3 w-[1px] bg-white/30" />
            <span className="text-white/90">
              {getNoticeComputedStatusText(currentNotice)}
            </span>
          </div>

          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
            {currentNotice.title}
          </h2>

          <div className="mt-6 flex items-center gap-2 text-white/80 font-medium bg-black/20 px-3 py-1 rounded-lg backdrop-blur-sm">
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            <span>마감일 : {formatDate(currentNotice.endDate)}</span>
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

      {/* ✅ 공고 1개여도 (가상 슬라이드가 2장 이상이면) 버튼/인디케이터 표시 */}
      {canSlide && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="이전 슬라이드"
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
            aria-label="다음 슬라이드"
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

      {canSlide && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={slides[i].id}
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
