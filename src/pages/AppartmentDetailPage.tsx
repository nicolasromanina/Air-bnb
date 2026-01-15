import Navbar from "@/components/Navbar";
import AppartmentDetail from "@/components/appartmentDetail/AppartmentDetail";
import GallerySection from "@/components/appartmentDetail/GallerySection";
function AppartmentDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <AppartmentDetail />
      <GallerySection />
    </div>
  );
}

export default AppartmentDetailPage;