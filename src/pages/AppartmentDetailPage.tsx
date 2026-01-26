import Navbar from "@/components/Navbar";
import NavbarSpacer from "@/components/NavbarSpacer";
import AppartmentDetail from "@/components/appartmentDetail/AppartmentDetail";
import GallerySection from "@/components/appartmentDetail/GallerySection";
import LastSection from "@/components/appartmentDetail/LastSection";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apartmentDetailApi, ApartmentDetailData } from '@/services/apartmentDetailApi';
import { Loader } from 'lucide-react';

function AppartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [detailData, setDetailData] = useState<ApartmentDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && !isNaN(parseInt(id))) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const apartmentId = parseInt(id || '0');
      if (apartmentId > 0) {
        const response = await apartmentDetailApi.getDetailByApartmentId(apartmentId);
        if (response.success) {
          setDetailData(response.data);
        }
      }
    } catch (error) {
      console.error('Erreur chargement détails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <NavbarSpacer />
      <AppartmentDetail />
      {detailData && (
        <>
          <GallerySection 
            title={detailData.gallery.title}
            subtitle={detailData.gallery.subtitle}
            images={detailData.gallery.images}
            buttonText={detailData.gallery.buttonText}
          />
          <LastSection 
            title={detailData.lastSection.title}
            description={detailData.lastSection.description}
            features={detailData.lastSection.features}
            image={detailData.lastSection.image}
            tagline={detailData.lastSection.tagline}
          />
        </>
      )}
      {!detailData && (
        <>
          <GallerySection />
          <LastSection />
        </>
      )}
    </div>
  );
}

export default AppartmentDetailPage;