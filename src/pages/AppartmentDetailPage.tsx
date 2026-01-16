import Navbar from "@/components/Navbar";
import NavbarSpacer from "@/components/NavbarSpacer";
import AppartmentDetail from "@/components/appartmentDetail/AppartmentDetail";
import GallerySection from "@/components/appartmentDetail/GallerySection";
import LastSection from "@/components/appartmentDetail/LastSection";
function AppartmentDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <NavbarSpacer />
      <AppartmentDetail />
      <GallerySection />
      <LastSection />
    </div>
  );
}

export default AppartmentDetailPage;