import { Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

interface ReservationCardProps {
  image: string;
  title: string;
  includes: string[];
  apartmentNumber: string;
  date: string;
  price: string;
  nights?: number;
  pricePerNight?: number;
}

const ReservationCard = ({
  image,
  title,
  includes,
  apartmentNumber,
  date,
  price,
  nights,
  pricePerNight
}: ReservationCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    // Logique de suppression ici
    console.log("Suppression de la réservation");
    localStorage.removeItem('currentReservation');
    setShowDeleteModal(false);
    window.location.reload();
  };

  return (
    <>
      <div className="flex gap-4 p-4 bg-card rounded-xl border border-border">
        <img
          src={image}
          alt={title}
          className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight text-foreground">{title}</h3>
            <span className="font-bold text-sm flex-shrink-0 text-primary">{price}</span>
          </div>
          
          {/* Affichage du nombre de nuits et prix par nuit */}
          {nights && pricePerNight && (
            <div className="mt-1 flex gap-4">
              <span className="text-xs text-muted-foreground">
                {nights} nuit(s) × {pricePerNight}€/nuit
              </span>
            </div>
          )}
          
          <div className="mt-2">
            <span className="text-xs font-semibold text-foreground">Inclus : </span>
            <div className="inline">
              {includes.map((item, index) => (
                <span key={index} className="text-xs text-muted-foreground">
                  {item}
                  {index < includes.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">{apartmentNumber}</span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="text-destructive hover:text-destructive/80 transition-colors"
                aria-label="Supprimer"
              >
                <Trash2 size={16} />
              </button>
              <span className="text-xs text-muted-foreground">{date}</span>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          reservation={{
            id: 1,
            title,
            apartmentNumber,
            price,
          }}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
};

export default ReservationCard;