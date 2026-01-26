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
  basePrice?: number | string;
  optionsPrice?: number | string;
  selectedOptions?: Array<{
    optionId: string;
    name: string;
    price: number;
    quantity: number;
    pricingType: string;
  }>;
}

const ReservationCard = ({
  image,
  title,
  includes = [],
  apartmentNumber,
  date,
  price,
  nights,
  pricePerNight,
  basePrice,
  optionsPrice,
  selectedOptions = []
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

          {/* Affichage des options sélectionnées */}
          {selectedOptions && selectedOptions.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs font-semibold text-green-700 mb-1">Options :</p>
              <div className="space-y-1">
                {selectedOptions.map((option, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-xs text-green-700">{option.name}</span>
                    <span className="text-xs font-medium text-green-700">
                      {(option.price * option.quantity).toFixed(2)}€
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Répartition des coûts */}
          {basePrice && optionsPrice && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Logement :</span>
                <span className="font-medium text-foreground">{basePrice}€</span>
              </div>
              {Number(optionsPrice) > 0 && (
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Options :</span>
                  <span className="font-medium text-green-600">{optionsPrice}€</span>
                </div>
              )}
              <div className="flex justify-between text-xs border-t border-border pt-1 mt-1">
                <span className="font-semibold text-foreground">Total :</span>
                <span className="font-bold text-primary">{price}</span>
              </div>
            </div>
          )}
          
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