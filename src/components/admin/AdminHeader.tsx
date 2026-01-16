import React from "react";
import { Save, RotateCcw, Eye, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/context/ContentContext";
import { toast } from "sonner";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const { saveContent, resetContent, isDirty } = useContent();

  const handleSave = () => {
    saveContent();
    toast.success("Modifications sauvegardées", {
      description: "Vos changements ont été enregistrés avec succès.",
    });
  };

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les modifications ?")) {
      resetContent();
      toast.info("Contenu réinitialisé", {
        description: "Le contenu a été remis à ses valeurs par défaut.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
              Modifications non sauvegardées
            </span>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("/", "_blank")}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Prévisualiser</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
