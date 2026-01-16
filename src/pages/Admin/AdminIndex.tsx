import { Link } from "react-router-dom";
import { useContent } from "@/context/ContentContext";
import { ArrowRight, Settings, Home, Briefcase, Building2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminIndex = () => {
  const { content } = useContent();

  return (
    <div className="min-h-screen bg-background font-montserrat">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background via-background to-muted overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 mb-8 shadow-sm">
            <Settings className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Dashboard Administration
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[0.95] tracking-tight mb-6">
            Gérez le contenu de
            <span className="block text-primary">SweetHome</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Un panneau d'administration moderne et intuitif pour modifier les textes,
            images et contenus de votre application sans toucher au code.
          </p>

          {/* CTA */}
          <Link to="/admin">
            <Button size="lg" className="gap-2 text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
              Accéder au Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pages disponibles à éditer
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Modifiez facilement le contenu de chaque page de votre site
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Home, title: "Accueil", desc: "Hero, Welcome, Témoignages" },
              { icon: Briefcase, title: "Services", desc: "Liste des services, FAQ" },
              { icon: Building2, title: "Appartements", desc: "Liste et détails" },
              { icon: Mail, title: "Contact", desc: "Formulaire et infos" },
            ].map((item, i) => (
              <div
                key={i}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-foreground to-foreground/90 rounded-3xl p-10 md:p-16 text-center text-background">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à personnaliser votre site ?
            </h2>
            <p className="text-background/70 max-w-xl mx-auto mb-8">
              Toutes les modifications sont sauvegardées localement et prêtes à être
              utilisées par votre application front-end.
            </p>
            <Link to="/admin">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-base px-8 py-6 rounded-xl"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-foreground">SweetHome Admin</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 SweetHome. Dashboard d'administration.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminIndex;
