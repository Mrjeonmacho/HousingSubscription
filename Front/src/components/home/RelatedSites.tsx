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

  // 수정: mt-12 제거 (HomePage에서 mt-24로 제어), 상단 여백 제거하여 깔끔하게 변경
  return (
    <section className="bg-gray-50 dark:bg-white/5 py-10 px-4 rounded-[1rem] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="overflow-hidden mb-8 -mx-2"> 
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {SITES.map((site) => (
              <div
                key={site.id}
                className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-2"
              >
                <a
                  href={site.url}
                  className="flex items-center justify-between bg-white dark:bg-white/10 px-6 py-4 rounded-xl transition-shadow cursor-pointer border border-gray-100 dark:border-white/5 group h-full"
                >
                  <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                    {site.title}
                  </span>
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prevSlide}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-primary transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>

          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === idx
                    ? "bg-primary scale-110"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-primary transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
}
