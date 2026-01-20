import { X } from "lucide-react";

interface Reservation {
  id: number;
  title: string;
  apartmentNumber: string;
  price: string;
}

interface DeleteConfirmationModalProps {
  reservation: Reservation;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal = ({
  reservation,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative bg-card rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-border">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Confirmer la suppression</h3>
          <p className="text-sm text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="font-medium">{reservation.title}</div>
          <div className="text-sm text-muted-foreground">{reservation.apartmentNumber}</div>
          <div className="text-sm font-medium text-primary mt-1">{reservation.price}</div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-input hover:bg-accent transition-colors text-sm font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm font-medium font-semibold"
          >
            Supprimer la réservation
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;