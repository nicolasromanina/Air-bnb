import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { TextEditor } from "@/components/admin/TextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { IconPicker } from "@/components/admin/IconPicker";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

const ApartmentDetailEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const detail = content.apartmentDetail;

  const updateDetail = (data: Partial<typeof detail>) => {
    updateContent("apartmentDetail", data);
  };

  const addFeature = () => {
    updateDetail({
      features: [
        ...detail.features,
        { icon: "star", title: "Nouvelle fonctionnalité", description: "Description" },
      ],
    });
  };

  const removeFeature = (index: number) => {
    const newFeatures = detail.features.filter((_, i) => i !== index);
    updateDetail({ features: newFeatures });
  };

  const addAmenity = () => {
    updateDetail({
      amenities: [...detail.amenities, { icon: "star", label: "Nouvel équipement" }],
    });
  };

  const removeAmenity = (index: number) => {
    const newAmenities = detail.amenities.filter((_, i) => i !== index);
    updateDetail({ amenities: newAmenities });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Détails Appartement"
        subtitle="Configurez la page de détail d'un appartement"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Basic Info */}
        <SectionCard title="Informations générales" description="Titre et prix">
          <TextEditor
            label="Titre de l'appartement"
            value={detail.title}
            onChange={(value) => updateDetail({ title: value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Prix</Label>
              <Input
                type="number"
                value={detail.price}
                onChange={(e) => updateDetail({ price: Number(e.target.value) })}
              />
            </div>
            <TextEditor
              label="Unité de prix"
              value={detail.priceUnit}
              onChange={(value) => updateDetail({ priceUnit: value })}
            />
          </div>

          <TextEditor
            label="Description"
            value={detail.description}
            onChange={(value) => updateDetail({ description: value })}
            multiline
          />
        </SectionCard>

        {/* Images */}
        <SectionCard title="Galerie d'images" description="Images de l'appartement">
          <div className="grid grid-cols-2 gap-4">
            {detail.images.map((image, index) => (
              <div key={index} className="relative">
                <ImageUploader
                  label={`Image ${index + 1}`}
                  value={image}
                  onChange={(value) => {
                    const newImages = [...detail.images];
                    newImages[index] = value;
                    updateDetail({ images: newImages });
                  }}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Features */}
        <SectionCard title="Caractéristiques" description="Points forts de l'appartement">
          <div className="space-y-4">
            {detail.features.map((feature, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg space-y-3 bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Caractéristique {index + 1}</span>
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
                      const newFeatures = [...detail.features];
                      newFeatures[index] = { ...feature, icon: value };
                      updateDetail({ features: newFeatures });
                    }}
                  />
                  <div className="md:col-span-3">
                    <TextEditor
                      label="Titre"
                      value={feature.title}
                      onChange={(value) => {
                        const newFeatures = [...detail.features];
                        newFeatures[index] = { ...feature, title: value };
                        updateDetail({ features: newFeatures });
                      }}
                    />
                  </div>
                </div>

                <TextEditor
                  label="Description"
                  value={feature.description}
                  onChange={(value) => {
                    const newFeatures = [...detail.features];
                    newFeatures[index] = { ...feature, description: value };
                    updateDetail({ features: newFeatures });
                  }}
                  multiline
                />
              </div>
            ))}

            <Button onClick={addFeature} variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Ajouter une caractéristique
            </Button>
          </div>
        </SectionCard>

        {/* Amenities */}
        <SectionCard title="Équipements" description="Liste des équipements disponibles">
          <div className="space-y-3">
            {detail.amenities.map((amenity, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-shrink-0 w-32">
                  <IconPicker
                    label=""
                    value={amenity.icon}
                    onChange={(value) => {
                      const newAmenities = [...detail.amenities];
                      newAmenities[index] = { ...amenity, icon: value };
                      updateDetail({ amenities: newAmenities });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <TextEditor
                    label=""
                    value={amenity.label}
                    onChange={(value) => {
                      const newAmenities = [...detail.amenities];
                      newAmenities[index] = { ...amenity, label: value };
                      updateDetail({ amenities: newAmenities });
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAmenity(index)}
                  className="text-destructive hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button onClick={addAmenity} variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un équipement
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default ApartmentDetailEditor;
