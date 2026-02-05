// Front/src/components/home/RelatedSites.tsx

import { useState, useEffect } from "react";

const SITES = [
  { id: 1, title: "SH홈페이지", url: "https://www.i-sh.co.kr/main/index.do" },
  { id: 2, title: "인터넷청약", url: "https://www.i-sh.co.kr/app/index.do" },
  { id: 3, title: "영구임대주택", url: "https://www.i-sh.co.kr/perm/index.do" },
  { id: 4, title: "재개발임대주택", url: "https://www.i-sh.co.kr/rev/index.do" },
  { id: 5, title: "도시정비포털", url: "https://www.i-sh.co.kr/city/index.do" },
  { id: 6, title: "서울주거포털", url: "https://housing.seoul.go.kr/" },
  { id: 7, title: "서울주거상담", url: "https://www.seoulhousing.kr/" },
  { id: 8, title: "청년몽땅정보통", url: "https://youth.seoul.go.kr/index.do" },
];

export default function RelatedSites() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.ceil(SITES.length / itemsPerPage) - 1;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* 타이틀 영역 (심플하게) */}
        <div className="mb-8 flex items-end justify-between px-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              관련 사이트
            </h2>
            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
              서울시 주거 정보가 모여있는 곳들을 확인해보세요.
            </p>
          </div>

          {/* 컨트롤러 (우측 상단 배치로 변경하여 깔끔함 유지) */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={prevSlide}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors bg-white dark:bg-transparent dark:border-gray-700"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>
            <button
              onClick={nextSlide}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors bg-white dark:bg-transparent dark:border-gray-700"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* 슬라이더 영역 */}
        <div className="overflow-hidden -mx-3 p-2"> 
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" // 더 고급스러운 움직임
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {SITES.map((site) => (
              <div
                key={site.id}
                className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3"
              >
                <a
                  href={site.url}
                  target="_blank" // [기능 추가] 새 창으로 열기
                  rel="noopener noreferrer" // 보안 권장 사항
                  className="
                    group flex items-center justify-between
                    h-[80px] px-6 rounded-2xl
                    bg-white dark:bg-white/5
                    border border-gray-100 dark:border-white/10
                    shadow-[0_2px_10px_rgba(0,0,0,0.03)]
                    hover:border-primary/50 hover:shadow-[0_8px_30px_rgba(var(--primary-rgb),0.1)]
                    hover:-translate-y-1
                    transition-all duration-300
                  "
                >
                  <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors text-[16px]">
                    {site.title}
                  </span>
                  
                  {/* 트렌디한 대각선 화살표 아이콘 */}
                  <div className="
                    w-8 h-8 rounded-full 
                    bg-gray-50 dark:bg-white/10 
                    flex items-center justify-center
                    group-hover:bg-primary group-hover:text-white
                    transition-all duration-300
                  ">
                    <span className="material-symbols-outlined text-[18px] group-hover:rotate-45 transition-transform duration-300">
                      arrow_outward
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 모바일용 컨트롤러 (화면 작을 때만 하단 표시) */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
            {/* ... (기존 하단 점 로직 유지하되 스타일만 심플하게) */}
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
        </div>

      </div>
    </section>
  );
}
