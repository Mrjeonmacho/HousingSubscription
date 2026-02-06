// Front/src/pages/HomePage.tsx
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react"; 

import HeroSearch from "../components/home/HeroSearch";
import NoticeCarousel from "../components/home/NoticeCarousel";
import RelatedSites from "../components/home/RelatedSites";

// import ConciergeFloatingButton from "../components/home/ConciergeFloatingButton";

// ----------------------------------------------------------------------
// [Internal Component] Scroll Reveal
// ----------------------------------------------------------------------
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
}

function ScrollRevealSection({ children, className = "" }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-1000 ease-out transform
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ----------------------------------------------------------------------
// [Main Page Component]
// ----------------------------------------------------------------------
export default function HomePage() {
  const [showScrollIcon, setShowScrollIcon] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIcon(false);
      } else {
        setShowScrollIcon(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 pb-20 flex flex-col gap-20">
      <section className="min-h-[calc(100vh-400px)] flex flex-col justify-center items-center pt-10"> 
        <HeroSearch />

        <div 
          className={`
            mt-20 flex flex-col items-center animate-bounce text-gray-400
            transition-opacity duration-500 ease-in-out
            ${showScrollIcon ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
           <span className="text-sm font-medium mb-1">Scroll Down</span>
           <span className="material-symbols-outlined text-3xl">keyboard_arrow_down</span>
        </div>
      </section>

      <ScrollRevealSection>
        <NoticeCarousel />
      </ScrollRevealSection>

      <ScrollRevealSection>
        <RelatedSites />
      </ScrollRevealSection>

      {/* <ConciergeFloatingButton /> */}

    </main>
  );
}
