import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import WelcomeSection from "@/components/WelcomeSection";

const Index = () => {
  return (
    <main className="relative">
      {/* Gray background on right side extending from top */}
      <div className="absolute top-0 right-0 w-1/2 h-[800px] bg-hero-gray hidden lg:block" />
      
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
      </div>
      
      <WelcomeSection />
    </main>
  );
};

export default Index;
