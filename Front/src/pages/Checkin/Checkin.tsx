import { useRef, useState } from "react";
import CheckinIntro from "../../components/checkin/CheckinIntro";
import CheckinCards from "../../components/checkin/CheckinCards";

export default function Checkin() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardSectionRef = useRef<HTMLDivElement>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const handleCheckinComplete = () => {
    setIsCheckedIn(true);
    setTimeout(() => {
      cardSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div 
      ref={scrollRef}
      className={`w-full h-[calc(100dvh-64px)] overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar ${
        !isCheckedIn ? "overflow-hidden" : ""
      }`}
    >
      <CheckinIntro onComplete={handleCheckinComplete} />

      {isCheckedIn && (
        <div ref={cardSectionRef} className="h-full w-full snap-start">
          <CheckinCards />
        </div>
      )}
    </div>
  );
}