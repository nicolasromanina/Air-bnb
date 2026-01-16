import HeroSection from "@/components/home/HeroSection";
import Navbar from "@/components/Navbar";
import WelcomeSection from "@/components/home/WelcomeSection";
import MarqueeSection from "@/components/home/MarqueeSection";
import StatsSection from "@/components/home/StatsSection";
import VideoSection from "@/components/home/VideoSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import DestinationSearch from "@/components/home/DestinationSearch";
import MarqueeBlackSection from "@/components/home/MarqueeBlackSection";
import ThreeCardsSection from "@/components/home/ThreeCardsSection";
import FeatureRoom from "@/components/home/FeatureRoom";
import LogoSection from "@/components/home/LogoSection";
import Footer from "@/components/Footer";
const Index = () => {
  return (
    <main className="relative bg-white min-h-screen overflow-x-hidden">
      
      {/* ----- PLAQUE GRISE DÉCORATIVE ----- */}
      <div className="absolute 
        top-0             /* Commence tout en haut (derrière Navbar) */
        right-[8%]           /* Alignée à droite */
        w-[44%]           /* Largeur de la plaque */
        h-[730px]         /* Hauteur : elle descend jusque sous le collage */
        bg-[#E5E7EB]      /* Couleur grise */
        hidden lg:block   /* Visible uniquement sur grand écran */
        z-0"              /* Niveau 0 : elle est au fond */
      />
      
      {/* ----- CONTENU (NAVBAR + HERO) ----- */}
      <div className="relative z-10"> {/* z-10 : passe devant la plaque grise */}
        <Navbar />
        <HeroSection />
      </div>

      {/* Reste du site */}
      <div className="relative z-20 bg-white">
        <WelcomeSection />
        <MarqueeSection />
        <DestinationSearch />
        <FeatureRoom />
        <MarqueeBlackSection />
        <VideoSection />
        <ServicesSection />
        <FeaturesSection />
        <StatsSection />
        <LogoSection />
        <ThreeCardsSection />
        <Footer />
      </div>
    </main>
  );
};
export default Index;
