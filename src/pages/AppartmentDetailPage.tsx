import Navbar from "@/components/Navbar";
import AppartmentDetail from "@/components/appartmentDetail/AppartmentDetail";
import GallerySection from "@/components/appartmentDetail/GallerySection";
import LastSection from "@/components/appartmentDetail/LastSection";
function AppartmentDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <br />
      <br />
      <br />
      <AppartmentDetail />
      <GallerySection />
      <LastSection />
    </div>
  );
}

export default AppartmentDetailPage;