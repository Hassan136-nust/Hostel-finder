import Hero from "./components/Home/Hero";
import HostelGrid from "./components/Home/HostelGrid";
import FeaturedHostels from "./components/Home/FeaturedHostels";
import AnnouncementsBanner from "./components/Home/AnnouncementsBanner";
import ReviewsSection from "./components/Home/ReviewsSection";
import Footer from "./components/ui/Footer";
import Header from "./components/ui/Header";

export default function Home() {
  return (
    <div className="bg-brand-bg dark:bg-dark-bg min-h-screen transition-colors">
      <Header />
      <AnnouncementsBanner />
      <main>
        <Hero />
        <FeaturedHostels />
        <HostelGrid />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
}