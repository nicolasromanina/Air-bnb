import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { RotateCcw, Download, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";

const SettingsEditor: React.FC = () => {
  const { content, resetContent, saveContent } = useContent();

  const handleExport = () => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "sweethome-content.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Export réussi", {
      description: "Le fichier a été téléchargé.",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedContent = JSON.parse(e.target?.result as string);
        localStorage.setItem("sweethome_admin_content", JSON.stringify(importedContent));
        window.location.reload();
        toast.success("Import réussi", {
          description: "Le contenu a été importé avec succès.",
        });
      } catch (error) {
        toast.error("Erreur d'import", {
          description: "Le fichier n'est pas valide.",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tout le contenu ?")) {
      resetContent();
      toast.success("Réinitialisation effectuée", {
        description: "Le contenu a été remis par défaut.",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Paramètres"
        subtitle="Configuration du dashboard"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Export/Import */}
        <SectionCard
          title="Sauvegarde du contenu"
          description="Exportez ou importez vos données"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleExport} variant="outline" className="gap-2 flex-1">
              <Download className="w-4 h-4" />
              Exporter le contenu (JSON)
            </Button>
            <label className="flex-1">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button variant="outline" className="gap-2 w-full" asChild>
                <span>
                  <Upload className="w-4 h-4" />
                  Importer du contenu
                </span>
              </Button>
            </label>
          </div>
        </SectionCard>

        {/* Reset */}
        <SectionCard
          title="Zone dangereuse"
          description="Actions irréversibles"
        >
          <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  Réinitialiser tout le contenu
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Cette action supprimera toutes vos modifications et remettra le contenu par défaut. Cette action est irréversible.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Info */}
        <SectionCard title="À propos" description="Informations système">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Stockage</span>
              <span className="font-medium text-foreground">LocalStorage</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Pages gérées</span>
              <span className="font-medium text-foreground">8</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Framework</span>
              <span className="font-medium text-foreground">React + TypeScript</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default SettingsEditor;
