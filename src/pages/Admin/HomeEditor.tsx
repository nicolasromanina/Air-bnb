import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { TextEditor } from "@/components/admin/TextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { IconPicker } from "@/components/admin/IconPicker";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const HomeEditor: React.FC = () => {
  const { content, updateNestedContent } = useContent();
  const { hero, welcome } = content.home;

  const updateHero = (data: Partial<typeof hero>) => {
    updateNestedContent("home", "hero", data);
  };

  const updateWelcome = (data: Partial<typeof welcome>) => {
    updateNestedContent("home", "welcome", data);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Page Accueil"
        subtitle="Modifiez le contenu de la page d'accueil"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Hero Section */}
        <SectionCard
          title="Section Hero"
          description="Le bloc principal en haut de la page"
        >
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                Titre (une ligne par élément)
              </label>
              {hero.title.map((line, index) => (
                <div key={index} className="mb-2">
                  <TextEditor
                    label={`Ligne ${index + 1}`}
                    value={line}
                    onChange={(value) => {
                      const newTitle = [...hero.title];
                      newTitle[index] = value;
                      updateHero({ title: newTitle });
                    }}
                  />
                </div>
              ))}
            </div>

            <TextEditor
              label="Sous-titre"
              value={hero.subtitle}
              onChange={(value) => updateHero({ subtitle: value })}
              multiline
            />

            <TextEditor
              label="Bouton CTA"
              value={hero.ctaButton}
              onChange={(value) => updateHero({ ctaButton: value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImageUploader
                label="Image principale"
                value={hero.images.main}
                onChange={(value) =>
                  updateHero({ images: { ...hero.images, main: value } })
                }
                aspectRatio="3/4"
              />
              <ImageUploader
                label="Image secondaire"
                value={hero.images.secondary}
                onChange={(value) =>
                  updateHero({ images: { ...hero.images, secondary: value } })
                }
                aspectRatio="3/4"
              />
              <ImageUploader
                label="Image tertiaire"
                value={hero.images.tertiary}
                onChange={(value) =>
                  updateHero({ images: { ...hero.images, tertiary: value } })
                }
                aspectRatio="3/4"
              />
            </div>
          </div>
        </SectionCard>

        {/* Testimonial */}
        <SectionCard
          title="Témoignage"
          description="Bloc de témoignage client"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader
              label="Photo du client"
              value={hero.testimonial.image}
              onChange={(value) =>
                updateHero({ testimonial: { ...hero.testimonial, image: value } })
              }
              aspectRatio="1/1"
            />
            <div className="space-y-4">
              <TextEditor
                label="Nom / Titre"
                value={hero.testimonial.name}
                onChange={(value) =>
                  updateHero({ testimonial: { ...hero.testimonial, name: value } })
                }
              />
              <TextEditor
                label="Citation"
                value={hero.testimonial.quote}
                onChange={(value) =>
                  updateHero({ testimonial: { ...hero.testimonial, quote: value } })
                }
                multiline
              />
            </div>
          </div>
        </SectionCard>

        {/* Welcome Section */}
        <SectionCard
          title="Section Bienvenue"
          description="Bloc de bienvenue avec images et texte"
        >
          <TextEditor
            label="Titre"
            value={welcome.title}
            onChange={(value) => updateWelcome({ title: value })}
          />
          <TextEditor
            label="Description"
            value={welcome.description}
            onChange={(value) => updateWelcome({ description: value })}
            multiline
          />
          <TextEditor
            label="Bouton CTA"
            value={welcome.ctaButton}
            onChange={(value) => updateWelcome({ ctaButton: value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ImageUploader
              label="Image vidéo"
              value={welcome.images.video}
              onChange={(value) =>
                updateWelcome({ images: { ...welcome.images, video: value } })
              }
            />
            <ImageUploader
              label="Photo 1"
              value={welcome.images.photo1}
              onChange={(value) =>
                updateWelcome({ images: { ...welcome.images, photo1: value } })
              }
              aspectRatio="1/1"
            />
            <ImageUploader
              label="Photo 2"
              value={welcome.images.photo2}
              onChange={(value) =>
                updateWelcome({ images: { ...welcome.images, photo2: value } })
              }
              aspectRatio="1/1"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              Caractéristiques
            </label>
            {welcome.features.map((feature, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-shrink-0 w-32">
                  <IconPicker
                    label="Icône"
                    value={feature.icon}
                    onChange={(value) => {
                      const newFeatures = [...welcome.features];
                      newFeatures[index] = { ...feature, icon: value };
                      updateWelcome({ features: newFeatures });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <TextEditor
                    label="Label"
                    value={feature.label}
                    onChange={(value) => {
                      const newFeatures = [...welcome.features];
                      newFeatures[index] = { ...feature, label: value };
                      updateWelcome({ features: newFeatures });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default HomeEditor;
