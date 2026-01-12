import Hero from "./components/Home/Hero";
import Header from "./components/ui/Header";

export default function Home() {
  return (
    <div className="bg-brand-bg dark:bg-dark-bg min-h-screen transition-colors">
      <Header />
      <main>
      <Hero/>
      </main>
    </div>
  );
}