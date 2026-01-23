import HeroSearch from "../components/home/HeroSearch";
import QuickCards from "../components/home/QuickCards";
import NoticeCarousel from "../components/home/NoticeCarousel";
import LoginCard from "../components/home/LoginCard";

export default function HomePage() {
  return (
    <>
      <section className="flex flex-row lg:flex-row items-start justify-center gap-8 max-w-7xl mx-auto py-8">
        <div className="flex-1">
          <HeroSearch />
        </div>
        <div className="flex items-center w-full lg:w-auto h-full">
          <LoginCard />
        </div>
      </section>
      <QuickCards />
      <NoticeCarousel />
    </>
  );
}
