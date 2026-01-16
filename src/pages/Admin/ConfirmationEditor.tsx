import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { TextEditor } from "@/components/admin/TextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { CheckCircle } from "lucide-react";

const ConfirmationEditor: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Page Confirmation"
        subtitle="Personnalisez la page de confirmation de paiement"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        <SectionCard title="Message de succès" description="Contenu affiché après un paiement réussi">
          <TextEditor
            label="Titre principal"
            value="Réservation confirmée !"
            onChange={() => {}}
          />
          <TextEditor
            label="Message de confirmation"
            value="Merci pour votre réservation. Vous recevrez un email de confirmation avec tous les détails de votre séjour."
            onChange={() => {}}
            multiline
          />
        </SectionCard>

        <SectionCard title="Détails de la réservation" description="Informations affichées">
          <div className="space-y-4">
            <TextEditor
              label="Label numéro de réservation"
              value="Numéro de réservation"
              onChange={() => {}}
            />
            <TextEditor
              label="Label date d'arrivée"
              value="Date d'arrivée"
              onChange={() => {}}
            />
            <TextEditor
              label="Label date de départ"
              value="Date de départ"
              onChange={() => {}}
            />
            <TextEditor
              label="Label montant payé"
              value="Montant total"
              onChange={() => {}}
            />
          </div>
        </SectionCard>

        <SectionCard title="Actions" description="Boutons disponibles">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextEditor
              label="Bouton retour accueil"
              value="Retour à l'accueil"
              onChange={() => {}}
            />
            <TextEditor
              label="Bouton télécharger confirmation"
              value="Télécharger le récapitulatif"
              onChange={() => {}}
            />
          </div>
        </SectionCard>

        <div className="bg-success/10 rounded-xl p-6 border border-success/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Page de confirmation</h4>
              <p className="text-sm text-muted-foreground">
                Cette page s'affiche automatiquement après un paiement réussi. 
                Elle contient un résumé de la réservation et les prochaines étapes pour le client.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationEditor;
