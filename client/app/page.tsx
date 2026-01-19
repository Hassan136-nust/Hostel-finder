import Hero from "./components/Home/Hero";
import HostelGrid from "./components/Home/HostelGrid";
import Header from "./components/ui/Header";

export default function Home() {
  return (
    <div className="bg-brand-bg dark:bg-dark-bg min-h-screen transition-colors">
      <Header />
      <main>
        <Hero />
        <HostelGrid />
      </main>
    </div>
  );
}