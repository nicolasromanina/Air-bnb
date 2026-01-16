import Navbar from "@/components/Navbar";
import HeroSection from "@/components/appartment/HeroSection";
import RoomsSection from "@/components/appartment/RoomsSection";
import FeatureSection from "@/components/appartment/FeatureSection";
import ShowcaseSection from "@/components/appartment/ShowcaseSection";
import VideoSection from "@/components/appartment/VideoSection";
import FinalSection from "@/components/appartment/FinalSection";
import PerfectShow from "@/components/appartment/PerfectShow";
import Footer from "@/components/Footer";


const Appartment = () => {
  return (
    <main className="min-h-screen bg-background" id="appartements">
      <Navbar />
          <br />
        <br />
        <br />
      <HeroSection />
      <RoomsSection />
      <FeatureSection />
      <ShowcaseSection />
      <PerfectShow />
      <VideoSection />
      <FinalSection />
      <Footer />
    </main>
  );
};

export default Appartment;
