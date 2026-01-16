import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { TextEditor } from "@/components/admin/TextEditor";
import { CheckCircle, CreditCard } from "lucide-react";

const PaymentEditor: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Page Paiement"
        subtitle="Personnalisez la page de paiement"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        <SectionCard title="En-tête de page" description="Texte affiché sur la page de paiement">
          <TextEditor
            label="Titre"
            value="Finalisez votre réservation"
            onChange={() => {}}
          />
          <TextEditor
            label="Description"
            value="Entrez vos informations de paiement pour confirmer votre réservation."
            onChange={() => {}}
            multiline
          />
        </SectionCard>

        <SectionCard title="Formulaire de paiement" description="Labels des champs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextEditor
              label="Label carte bancaire"
              value="Numéro de carte"
              onChange={() => {}}
            />
            <TextEditor
              label="Label date d'expiration"
              value="Date d'expiration"
              onChange={() => {}}
            />
            <TextEditor
              label="Label CVV"
              value="Code de sécurité (CVV)"
              onChange={() => {}}
            />
            <TextEditor
              label="Label nom du titulaire"
              value="Nom du titulaire"
              onChange={() => {}}
            />
          </div>
        </SectionCard>

        <SectionCard title="Bouton de confirmation" description="Texte du bouton">
          <TextEditor
            label="Texte du bouton"
            value="Payer maintenant"
            onChange={() => {}}
          />
        </SectionCard>

        <div className="bg-muted/50 rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Note</h4>
              <p className="text-sm text-muted-foreground">
                La page de paiement utilise généralement un système de paiement tiers (Stripe, PayPal, etc.). 
                Les éléments éditables ici concernent uniquement les textes d'interface utilisateur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentEditor;
