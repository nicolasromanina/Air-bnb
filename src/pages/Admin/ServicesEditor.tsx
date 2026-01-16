import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { TextEditor } from "@/components/admin/TextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { IconPicker } from "@/components/admin/IconPicker";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const ServicesEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const services = content.services;

  const updateServices = (data: Partial<typeof services>) => {
    updateContent("services", data);
  };

  const addFeature = () => {
    updateServices({
      features: [
        ...services.features,
        { icon: "star", title: "Nouveau service", description: "Description du service" },
      ],
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = services.features.filter((_, i) => i !== index);
    updateServices({ features: newFeatures });
  };

  const addFaq = () => {
    updateServices({
      faq: [
        ...services.faq,
        { question: "Nouvelle question ?", answer: "Réponse à la question." },
      ],
    });
  };

  const removeFaq = (index: number) => {
    const newFaq = services.faq.filter((_, i) => i !== index);
    updateServices({ faq: newFaq });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Page Services"
        subtitle="Modifiez le contenu de la page services"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Hero Section */}
        <SectionCard title="Section Hero" description="En-tête de la page services">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                Titre (une ligne par élément)
              </label>
              {services.hero.title.map((line, index) => (
                <div key={index} className="mb-2">
                  <TextEditor
                    label={`Ligne ${index + 1}`}
                    value={line}
                    onChange={(value) => {
                      const newTitle = [...services.hero.title];
                      newTitle[index] = value;
                      updateServices({ hero: { ...services.hero, title: newTitle } });
                    }}
                  />
                </div>
              ))}
            </div>

            <TextEditor
              label="Description"
              value={services.hero.description}
              onChange={(value) =>
                updateServices({ hero: { ...services.hero, description: value } })
              }
              multiline
            />

            <ImageUploader
              label="Image Hero"
              value={services.hero.image}
              onChange={(value) =>
                updateServices({ hero: { ...services.hero, image: value } })
              }
            />
          </div>
        </SectionCard>

        {/* Features */}
        <SectionCard
          title="Services & Fonctionnalités"
          description="Liste des services proposés"
        >
          <div className="space-y-6">
            {services.features.map((feature, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg space-y-4 bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    Service {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <IconPicker
                    label="Icône"
                    value={feature.icon}
                    onChange={(value) => {
                      const newFeatures = [...services.features];
                      newFeatures[index] = { ...feature, icon: value };
                      updateServices({ features: newFeatures });
                    }}
                  />
                  <div className="md:col-span-3">
                    <TextEditor
                      label="Titre"
                      value={feature.title}
                      onChange={(value) => {
                        const newFeatures = [...services.features];
                        newFeatures[index] = { ...feature, title: value };
                        updateServices({ features: newFeatures });
                      }}
                    />
                  </div>
                </div>

                <TextEditor
                  label="Description"
                  value={feature.description}
                  onChange={(value) => {
                    const newFeatures = [...services.features];
                    newFeatures[index] = { ...feature, description: value };
                    updateServices({ features: newFeatures });
                  }}
                  multiline
                />
              </div>
            ))}

            <Button onClick={addFeature} variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un service
            </Button>
          </div>
        </SectionCard>

        {/* FAQ */}
        <SectionCard title="FAQ" description="Questions fréquemment posées">
          <div className="space-y-4">
            {services.faq.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg space-y-3 bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    Question {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFaq(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <TextEditor
                  label="Question"
                  value={item.question}
                  onChange={(value) => {
                    const newFaq = [...services.faq];
                    newFaq[index] = { ...item, question: value };
                    updateServices({ faq: newFaq });
                  }}
                />

                <TextEditor
                  label="Réponse"
                  value={item.answer}
                  onChange={(value) => {
                    const newFaq = [...services.faq];
                    newFaq[index] = { ...item, answer: value };
                    updateServices({ faq: newFaq });
                  }}
                  multiline
                />
              </div>
            ))}

            <Button onClick={addFaq} variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Ajouter une question
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default ServicesEditor;
