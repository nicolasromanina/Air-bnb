import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { TextEditor } from "@/components/admin/TextEditor";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Star } from "lucide-react";

const PricingEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const pricing = content.pricing;

  const updatePricing = (data: Partial<typeof pricing>) => {
    updateContent("pricing", data);
  };

  const addPlan = () => {
    updatePricing({
      plans: [
        ...pricing.plans,
        {
          name: "Nouveau forfait",
          price: 200,
          period: "nuit",
          features: ["Fonctionnalité 1", "Fonctionnalité 2"],
        },
      ],
    });
  };

  const removePlan = (index: number) => {
    const newPlans = pricing.plans.filter((_, i) => i !== index);
    updatePricing({ plans: newPlans });
  };

  const addFeatureToPlan = (planIndex: number) => {
    const newPlans = [...pricing.plans];
    newPlans[planIndex].features.push("Nouvelle fonctionnalité");
    updatePricing({ plans: newPlans });
  };

  const removeFeatureFromPlan = (planIndex: number, featureIndex: number) => {
    const newPlans = [...pricing.plans];
    newPlans[planIndex].features = newPlans[planIndex].features.filter(
      (_, i) => i !== featureIndex
    );
    updatePricing({ plans: newPlans });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Page Prix"
        subtitle="Gérez vos tarifs et forfaits"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Header */}
        <SectionCard title="En-tête de section" description="Texte d'introduction">
          <TextEditor
            label="Titre"
            value={pricing.title}
            onChange={(value) => updatePricing({ title: value })}
          />
          <TextEditor
            label="Description"
            value={pricing.description}
            onChange={(value) => updatePricing({ description: value })}
            multiline
          />
        </SectionCard>

        {/* Plans */}
        <SectionCard title="Forfaits" description="Configurez vos offres tarifaires">
          <div className="space-y-6">
            {pricing.plans.map((plan, planIndex) => (
              <div
                key={planIndex}
                className={`p-5 border rounded-xl space-y-4 ${
                  plan.isPopular
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      Forfait {planIndex + 1}
                    </span>
                    {plan.isPopular && (
                      <span className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3" />
                        Populaire
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePlan(planIndex)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TextEditor
                    label="Nom du forfait"
                    value={plan.name}
                    onChange={(value) => {
                      const newPlans = [...pricing.plans];
                      newPlans[planIndex] = { ...plan, name: value };
                      updatePricing({ plans: newPlans });
                    }}
                  />
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Prix (€)</Label>
                    <Input
                      type="number"
                      value={plan.price}
                      onChange={(e) => {
                        const newPlans = [...pricing.plans];
                        newPlans[planIndex] = { ...plan, price: Number(e.target.value) };
                        updatePricing({ plans: newPlans });
                      }}
                    />
                  </div>
                  <TextEditor
                    label="Période"
                    value={plan.period}
                    onChange={(value) => {
                      const newPlans = [...pricing.plans];
                      newPlans[planIndex] = { ...plan, period: value };
                      updatePricing({ plans: newPlans });
                    }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={plan.isPopular || false}
                    onCheckedChange={(checked) => {
                      const newPlans = [...pricing.plans];
                      newPlans[planIndex] = { ...plan, isPopular: checked };
                      updatePricing({ plans: newPlans });
                    }}
                  />
                  <Label className="text-sm text-muted-foreground">
                    Marquer comme "Populaire"
                  </Label>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Fonctionnalités incluses</Label>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2 items-center">
                      <Input
                        value={feature}
                        onChange={(e) => {
                          const newPlans = [...pricing.plans];
                          newPlans[planIndex].features[featureIndex] = e.target.value;
                          updatePricing({ plans: newPlans });
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeatureFromPlan(planIndex, featureIndex)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addFeatureToPlan(planIndex)}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter une fonctionnalité
                  </Button>
                </div>
              </div>
            ))}

            <Button onClick={addPlan} variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un forfait
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default PricingEditor;
