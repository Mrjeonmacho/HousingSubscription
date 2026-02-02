// Front/src/components/notices/hero/NoticeHeroCarousel.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Notice } from "../../../pages/NoticesPage";
import { categoryLabel } from "../../../utils/noticeFormat";
import { getNoticeComputedStatusText } from "../../../utils/noticeComputedText";

type NoticeHeroCarouselProps = {
  items: Notice[];
  autoPlayMs?: number; // 기본 5000ms, 0이면 자동재생 off
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

  // 실제 "선택된" 인덱스 (인디케이터/버튼 기준)
  const [index, setIndex] = useState(0);

  // 화면에 표시될 텍스트(공고) 인덱스 (배경 페이드 완료 시점에 맞춰 변경)
  const [visibleIndex, setVisibleIndex] = useState(0);

  const pausedRef = useRef(false);

  // 배경 페이드 상태
  const [bgFront, setBgFront] = useState(() => getHeroBgByIndex(0));
  const [bgBack, setBgBack] = useState<string | null>(null);
  const [fading, setFading] = useState(false);

  // 전환 중 타이머/raf 정리용
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const current = useMemo(() => {
    if (count === 0) return null;
    const safe = Math.min(visibleIndex, count - 1);
    return slides[safe] ?? null;
  }, [slides, visibleIndex, count]);

  // 이미지 프리로드 + (가능하면) 디코드까지
  useEffect(() => {
    HERO_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      (img as HTMLImageElement).decode?.().catch(() => {});
    });
  }, []);

  // items(슬라이드 목록) 바뀌면 안전하게 리셋
  const slidesKey = useMemo(
    () => slides.map((s) => String(s.id)).join("|"),
    [slides]
  );

  useEffect(() => {
    // 기존 전환(애니메이션) 정리
    if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    rafRef.current = null;
    timeoutRef.current = null;

// 핵심 수정: 상태 업데이트를 다음 틱으로 미뤄서 렌더링 충돌(Cascading Update) 방지
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

      // 기존 전환 정리
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
      rafRef.current = null;
      timeoutRef.current = null;

      // 인디케이터/버튼의 active는 즉시 반영
      setIndex(normalized);

      // 배경 페이드 준비
      const nextSrc = getHeroBgByIndex(normalized);
      setBgBack(nextSrc);

      // 다음 프레임에 opacity 전환 시작
      rafRef.current = window.requestAnimationFrame(() => {
        setFading(true);
      });

      // 페이드 완료 시점에 front 교체 + 텍스트도 동기화
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

  // 자동재생: setIndex 직접 호출하지 말고 go()로만 이동 (전환 동기화 유지)
  useEffect(() => {
    if (!autoPlayMs || autoPlayMs <= 0) return;
    if (!canSlide) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      go(index + 1);
    }, autoPlayMs);

    return () => window.clearInterval(id);
  }, [autoPlayMs, canSlide, go, index]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!current) {
    return (
      <section className="rounded-[15px] bg-[#3f5f4c] text-white p-10 md:p-14">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold">
          <span>✨</span>
          <span>모집중 공고 없음</span>
        </div>

        <h2 className="mt-10 text-3xl md:text-5xl font-extrabold leading-tight">
          현재 모집중인 공고가 없습니다
        </h2>

        <div className="mt-8 flex items-center gap-3 text-white/80">
          <div className="h-5 w-5 rounded bg-white/20" />
          <span>마감일: -</span>
        </div>

        <div className="mt-12">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-full bg-white/50 px-8 py-4 text-base font-semibold text-black/70"
          >
            공고 자세히 보기 <span aria-hidden>→</span>
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <span className="h-2 w-8 rounded-full bg-white/70" />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden rounded-[15px] bg-[#3f5f4c] text-white"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {/* 배경 레이어 (img 2장 겹치기 + opacity 페이드) */}
      <div className="absolute inset-0">
        <img
          src={bgFront}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{
            transform: "translateZ(0)",
            willChange: "opacity",
          }}
          draggable={false}
        />

        {bgBack && (
          <img
            src={bgBack}
            alt=""
            aria-hidden
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[${FADE_MS}ms] ${
              fading ? "opacity-100" : "opacity-0"
            }`}
            style={{
              transform: "translateZ(0)",
              willChange: "opacity",
            }}
            draggable={false}
          />
        )}
      </div>

      <div className="absolute inset-0 bg-black/40" />

      {/* 콘텐츠 */}
      <div className="relative p-6 md:p-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold">
          <span>
            {categoryLabel(current.category ?? undefined)} |{" "}
            {getNoticeComputedStatusText(current)}
          </span>
        </div>

        <h2 className="mt-6 text-2xl md:text-4xl font-extrabold leading-tight">
          {current.title}
        </h2>

        <div className="mt-8 flex items-center gap-3 text-white/85">
          <span className="material-symbols-outlined text-white/85 text-xl">
            event
          </span>
          <span className="text-lg">마감일 : {formatDate(current.endDate)}</span>
        </div>

        <div className="mt-12 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/notices/${current.id}`)}
            className="cursor-pointer inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold text-black/80 hover:bg-white/90 transition-colors"
          >
            공고 자세히 보기 <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      {canSlide && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="이전 공고"
            className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 transition-colors"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="다음 공고"
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 transition-colors"
          >
            ›
          </button>
        </>
      )}

      {canSlide && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => {
            const active = i === index; // 인디케이터는 "선택된" index 기준
            return (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`슬라이드 ${i + 1}`}
                className={`cursor-pointer h-2.5 rounded-full transition-all ${
                  active ? "w-10 bg-white/90" : "w-2.5 bg-white/25"
                }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
