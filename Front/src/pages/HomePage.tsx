import HeroSearch from "../components/home/HeroSearch";
import NoticeCarousel from "../components/home/NoticeCarousel";
import RelatedSites from "../components/home/RelatedSites";

export default function HomePage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 pb-20 flex flex-col gap-30">
      
      <section className="flex justify-center pt-16"> 
        <HeroSearch />
      </section>

      <section> 
        <NoticeCarousel />
      </section>

      <section> 
        <RelatedSites />
      </section>

    </main>
  );
}