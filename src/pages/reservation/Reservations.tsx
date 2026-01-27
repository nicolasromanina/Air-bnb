import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useReservations } from "@/hooks/useReservations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Calendar,
  MapPin,
  Users,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Reservation {
  _id: string;
  apartmentId: number;
  title?: string;
  image?: string;
  checkIn: string;
  checkOut: string;
  nights?: number;
  guests?: number;
  totalPrice?: number;
  basePrice?: number;
  status?: string;
  createdAt?: string;
}

const Reservations = () => {
  const { isAuthenticated, user } = useAuth();
  const { getUserReservations: fetchReservations, deleteReservation } = useReservations();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Vous devez être connecté pour voir vos réservations");
      setLoading(false);
      return;
    }

    loadReservations();
  }, [isAuthenticated, filterStatus]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const status = filterStatus === "all" ? undefined : filterStatus;
      const response = await fetchReservations(1, 50, status);

      if (response) {
        // La réponse peut être un array ou un objet avec les réservations
        const reservations = Array.isArray(response) 
          ? response 
          : (response as any).reservations || [];
        setReservations(reservations);
      } else {
        setError("Impossible de charger les réservations");
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur lors du chargement des réservations");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      await deleteReservation(id);
      setReservations(reservations.filter((r) => r._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "confirmed":
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold text-green-700">Confirmée</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700">En attente</span>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-700">Annulée</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
            <span className="text-xs font-semibold text-gray-700">En cours</span>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDatetime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "confirmed":
        return "border-l-4 border-l-green-500 bg-green-50";
      case "pending":
        return "border-l-4 border-l-yellow-500 bg-yellow-50";
      case "cancelled":
        return "border-l-4 border-l-red-500 bg-red-50";
      default:
        return "border-l-4 border-l-blue-500 bg-blue-50";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-card rounded-xl p-8 shadow-sm border border-border text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Authentification requise</h1>
            <p className="text-muted-foreground mb-6">
              Vous devez être connecté pour voir vos réservations.
            </p>
            <Link
              to="/auth?returnUrl=/reservations"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />

      <main className="container mx-auto px-4 py-12 lg:py-20">
        {/* En-tête */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-black text-foreground mb-3">
            MES RÉSERVATIONS
          </h1>
          <p className="text-muted-foreground text-lg">
            Bienvenue {user?.firstName || "client"} ! Gérez vos réservations ici.
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-8 flex flex-wrap gap-3">
          {["all", "confirmed", "pending", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground border border-border hover:bg-secondary"
              }`}
            >
              {status === "all" && "Toutes"}
              {status === "confirmed" && "Confirmées"}
              {status === "pending" && "En attente"}
              {status === "cancelled" && "Annulées"}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des réservations...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
            <p className="text-destructive font-semibold">{error}</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="bg-card rounded-lg p-12 text-center border border-border">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Aucune réservation
            </h2>
            <p className="text-muted-foreground mb-6">
              {filterStatus === "all"
                ? "Vous n'avez pas encore de réservation."
                : `Vous n'avez pas de réservation ${
                    filterStatus === "confirmed"
                      ? "confirmée"
                      : filterStatus === "pending"
                      ? "en attente"
                      : "annulée"
                  }.`}
            </p>
            <Link
              to="/appartement"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Découvrir les appartements
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation._id}
                className={`rounded-lg overflow-hidden shadow-sm border border-border transition-all ${getStatusColor(
                  reservation.status
                )}`}
              >
                {/* En-tête cliquable */}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === reservation._id ? null : reservation._id)
                  }
                  className="w-full p-6 hover:bg-black/5 transition-colors text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Titre et image */}
                      <div className="flex items-start gap-4 mb-4">
                        {reservation.image && (
                          <img
                            src={reservation.image}
                            alt={reservation.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground">
                            {reservation.title || `Appartement ${reservation.apartmentId}`}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>Appartement {reservation.apartmentId}</span>
                          </div>
                        </div>
                      </div>

                      {/* Infos principales */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">
                            CHECK-IN
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {formatDate(reservation.checkIn)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">
                            CHECK-OUT
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {formatDate(reservation.checkOut)}
                          </p>
                        </div>
                        {reservation.nights && (
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold mb-1">
                              DURÉE
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {reservation.nights} nuit{reservation.nights > 1 ? "s" : ""}
                            </p>
                          </div>
                        )}
                        {reservation.totalPrice && (
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold mb-1">
                              MONTANT
                            </p>
                            <p className="text-sm font-bold text-primary">
                              {reservation.totalPrice.toFixed(2)}€
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Statut et chevron */}
                    <div className="flex items-center gap-3">
                      {getStatusBadge(reservation.status)}
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          expandedId === reservation._id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Détails étendus */}
                {expandedId === reservation._id && (
                  <div className="border-t border-border/50 px-6 py-4 bg-white/50 dark:bg-black/10">
                    {/* Détails */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                      {reservation.guests && (
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">
                            PERSONNES
                          </p>
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-foreground">
                              {reservation.guests}
                            </span>
                          </div>
                        </div>
                      )}

                      {reservation.basePrice && (
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold mb-1">
                            PRIX / NUIT
                          </p>
                          <p className="font-semibold text-foreground">
                            {reservation.basePrice}€
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-muted-foreground font-semibold mb-1">
                          RÉSERVATION
                        </p>
                        <p className="font-semibold text-foreground text-sm">
                          {reservation.createdAt
                            ? formatDatetime(reservation.createdAt)
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Récapitulatif des coûts */}
                    {(reservation.basePrice || reservation.totalPrice) && (
                      <div className="bg-muted rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-foreground mb-3">Récapitulatif</h4>
                        <div className="space-y-2 text-sm">
                          {reservation.basePrice && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Logement ({reservation.nights || 1} nuit
                                {(reservation.nights || 1) > 1 ? "s" : ""})
                              </span>
                              <span className="font-semibold">
                                {(
                                  reservation.basePrice * (reservation.nights || 1)
                                ).toFixed(2)}€
                              </span>
                            </div>
                          )}
                          {reservation.totalPrice && reservation.basePrice && (
                            <>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Options supplémentaires</span>
                                <span>
                                  {(
                                    reservation.totalPrice -
                                    reservation.basePrice * (reservation.nights || 1)
                                  ).toFixed(2)}€
                                </span>
                              </div>
                              <div className="border-t border-border/50 pt-2 flex justify-between font-bold">
                                <span>Total</span>
                                <span className="text-primary">
                                  {reservation.totalPrice.toFixed(2)}€
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex gap-3 flex-wrap">
                      <Link
                        to={`/apartment/${reservation.apartmentId}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Voir le logement
                      </Link>

                      {reservation.status !== "cancelled" && (
                        <button
                          onClick={() => setDeleteConfirm(reservation._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-semibold hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Annuler
                        </button>
                      )}
                    </div>

                    {/* Confirmation suppression */}
                    {deleteConfirm === reservation._id && (
                      <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                        <p className="text-destructive font-semibold mb-3">
                          Êtes-vous sûr de vouloir annuler cette réservation?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteReservation(reservation._id)}
                            className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg font-semibold hover:bg-destructive/90 transition-colors"
                          >
                            Oui, annuler
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="flex-1 px-4 py-2 bg-card border border-border rounded-lg font-semibold hover:bg-secondary transition-colors"
                          >
                            Non, garder
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Reservations;
