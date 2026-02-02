import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Notice } from "../../../pages/NoticesPage";
import { categoryLabel, statusLabel } from "../../../utils/noticeFormat";

type NoticeHeroCarouselProps = {
  items: Notice[];
  autoPlayMs?: number; // 기본 5000ms, 0이면 자동재생 off
};

function formatDate(dateStr: string | null) {
  return dateStr ?? "-";
}

export default function NoticeHeroCarousel({
  items,
  autoPlayMs = 5000,
}: NoticeHeroCarouselProps) {
  const navigate = useNavigate();

  const slides = useMemo(() => {
    const base = items ?? [];
    const receiving = base.filter((n) => n.status === "RECEIVING");

    receiving.sort((a, b) => (b.regDate ?? "").localeCompare(a.regDate ?? ""));
    return receiving.slice(0, 5);
  }, [items]);

  const count = slides.length;
  const canSlide = count > 1;

  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);

  const activeIndex = useMemo(() => {
    if (count === 0) return 0;
    return Math.min(index, count - 1);
  }, [index, count]);

  const current = useMemo(() => {
    if (count === 0) return null;
    return slides[activeIndex];
  }, [slides, activeIndex, count]);

  const go = (nextIndex: number) => {
    if (count === 0) return;
    const normalized = ((nextIndex % count) + count) % count;
    setIndex(normalized);
  };

  const prev = () => go(activeIndex - 1);
  const next = () => go(activeIndex + 1);

  useEffect(() => {
    if (!autoPlayMs || autoPlayMs <= 0) return;
    if (!canSlide) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setIndex((v) => (v + 1) % count);
    }, autoPlayMs);

    return () => window.clearInterval(id);
  }, [autoPlayMs, canSlide, count]);

  if (!current) {
    return (
      <section className="rounded-[32px] bg-[#3f5f4c] text-white p-10 md:p-14">
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
            공고 자세히 보기 →
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
      className="relative overflow-hidden rounded-[32px] bg-[#3f5f4c] text-white"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <div className="p-6 md:p-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold">
          <span>
            {categoryLabel(current.category ?? undefined)} |{" "}
            {statusLabel(current.status ?? undefined)}
          </span>
        </div>

        <h2 className="mt-6 text-2xl md:text-4xl font-extrabold leading-tight">
          {current.title}
        </h2>

        <div className="mt-8 flex items-center gap-3 text-white/85">
          <span className="material-symbols-outlined text-white/85 text-xl">
            event
          </span>
          <span className="text-lg">
            마감일 : {formatDate(current.endDate)}
          </span>
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
            const active = i === activeIndex;
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
