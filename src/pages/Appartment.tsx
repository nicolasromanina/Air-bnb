import Navbar from "@/components/Navbar";
import HeroSection from "@/components/appartment/HeroSection";
import RoomsSection from "@/components/appartment/RoomsSection";
import FeatureSection from "@/components/appartment/FeatureSection";
import ShowcaseSection from "@/components/appartment/ShowcaseSection";
import VideoSection from "@/components/appartment/VideoSection";
import FinalSection from "@/components/appartment/FinalSection";
import Footer from "@/components/Footer";


const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <RoomsSection />
      <FeatureSection />
      <ShowcaseSection />
      <VideoSection />
      <FinalSection />
      <Footer />
    </main>
  );
};

export default Index;
