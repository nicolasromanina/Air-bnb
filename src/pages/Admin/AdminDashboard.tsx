import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { 
  Home, 
  Briefcase, 
  Building2, 
  FileText, 
  CreditCard, 
  CheckCircle,
  Tag,
  Mail,
  TrendingUp,
  Edit3,
  Image,
  Type,
  Settings,
  Sliders
} from "lucide-react";
import { Link } from "react-router-dom";

const pages = [
  { label: "Accueil", href: "/admin/home", icon: Home, description: "Gérer le contenu de la page d'accueil" },
  { label: "Services", href: "/admin/services", icon: Briefcase, description: "Modifier les services proposés" },
  { label: "Configuration Appartements", href: "/admin/apartment-config", icon: Sliders, description: "Paramètres de recherche et filtres" },
  { label: "Appartements", href: "/admin/apartments", icon: Building2, description: "Liste des appartements" },
  { label: "Détails Appartement", href: "/admin/apartment-detail", icon: FileText, description: "Page de détail d'un appartement" },
  { label: "Paiement", href: "/admin/payment", icon: CreditCard, description: "Page de paiement" },
  { label: "Confirmation", href: "/admin/confirmation", icon: CheckCircle, description: "Confirmation de paiement" },
  { label: "Prix", href: "/admin/pricing", icon: Tag, description: "Tarifs et forfaits" },
  { label: "Contact", href: "/admin/contact", icon: Mail, description: "Formulaire de contact" },
];

const stats = [
  { label: "Pages gérées", value: "8", icon: Edit3, color: "bg-primary/10 text-primary" },
  { label: "Images", value: "24+", icon: Image, color: "bg-success/10 text-success" },
  { label: "Textes éditables", value: "50+", icon: Type, color: "bg-blue-500/10 text-blue-500" },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader title="Dashboard" subtitle="Gérez le contenu de votre site SweetHome" />
      
      <div className="p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-5 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pages Grid */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Pages à gérer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.href}
                  to={page.href}
                  className="group bg-card border border-border rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      Éditer →
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{page.label}</h3>
                  <p className="text-sm text-muted-foreground">{page.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 rounded-xl p-6">
          <h3 className="font-semibold text-foreground mb-2">💡 Conseils rapides</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Cliquez sur une page pour modifier son contenu</li>
            <li>• Toutes les modifications sont sauvegardées localement</li>
            <li>• Utilisez le bouton "Prévisualiser" pour voir vos changements en temps réel</li>
            <li>• Le bouton "Réinitialiser" restaure le contenu par défaut</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
