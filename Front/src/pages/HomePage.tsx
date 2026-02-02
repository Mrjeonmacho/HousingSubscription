import HeroSearch from "../components/home/HeroSearch";
// import QuickCards from "../components/home/QuickCards";
import NoticeCarousel from "../components/home/NoticeCarousel";
import LoginCard from "../components/home/LoginCard";
import RelatedSites from "../components/home/RelatedSites";

export default function HomePage() {
  return (
    <>
      <section className="flex flex-row lg:flex-row items-center justify-center gap-8 max-w-7xl mx-auto py-8">
        <div className="flex-1 w-full">
          <HeroSearch />
        </div>
        <div className="flex items-center w-auto">
          <LoginCard />
        </div>
      </section>
      {/* <QuickCards /> */}
      <NoticeCarousel />
      <RelatedSites />
    </>
  );
}
