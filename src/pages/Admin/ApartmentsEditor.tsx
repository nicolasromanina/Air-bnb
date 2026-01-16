import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { TextEditor } from "@/components/admin/TextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const ApartmentsEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const apartments = content.apartments;

  const updateApartments = (data: Partial<typeof apartments>) => {
    updateContent("apartments", data);
  };

  const addRoom = () => {
    updateApartments({
      rooms: [
        ...apartments.rooms,
        {
          image: "",
          title: "Nouvel appartement",
          description: "Description de l'appartement",
          guests: "jusqu'à 4 invités",
          bedrooms: "2 chambres à coucher",
        },
      ],
    });
  };

  const removeRoom = (index: number) => {
    const newRooms = apartments.rooms.filter((_, i) => i !== index);
    updateApartments({ rooms: newRooms });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Page Appartements"
        subtitle="Gérez la liste des appartements"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Hero */}
        <SectionCard title="Section Hero" description="En-tête de la page">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">
                Titre (une ligne par élément)
              </label>
              {apartments.hero.title.map((line, index) => (
                <div key={index} className="mb-2">
                  <TextEditor
                    label={`Ligne ${index + 1}`}
                    value={line}
                    onChange={(value) => {
                      const newTitle = [...apartments.hero.title];
                      newTitle[index] = value;
                      updateApartments({ hero: { ...apartments.hero, title: newTitle } });
                    }}
                  />
                </div>
              ))}
            </div>

            <TextEditor
              label="Description"
              value={apartments.hero.description}
              onChange={(value) =>
                updateApartments({ hero: { ...apartments.hero, description: value } })
              }
              multiline
            />

            <ImageUploader
              label="Image Hero"
              value={apartments.hero.image}
              onChange={(value) =>
                updateApartments({ hero: { ...apartments.hero, image: value } })
              }
            />
          </div>
        </SectionCard>

        {/* Section Header */}
        <SectionCard title="En-tête de section" description="Texte au-dessus de la liste">
          <TextEditor
            label="Titre de section"
            value={apartments.sectionTitle}
            onChange={(value) => updateApartments({ sectionTitle: value })}
          />
          <TextEditor
            label="Description de section"
            value={apartments.sectionDescription}
            onChange={(value) => updateApartments({ sectionDescription: value })}
            multiline
          />
        </SectionCard>

        {/* Rooms List */}
        <SectionCard title="Liste des appartements" description="Gérez vos appartements">
          <div className="space-y-6">
            {apartments.rooms.map((room, index) => (
              <div
                key={index}
                className="p-4 border border-border rounded-lg space-y-4 bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    Appartement {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRoom(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUploader
                    label="Image"
                    value={room.image}
                    onChange={(value) => {
                      const newRooms = [...apartments.rooms];
                      newRooms[index] = { ...room, image: value };
                      updateApartments({ rooms: newRooms });
                    }}
                    aspectRatio="4/3"
                  />
                  <div className="space-y-3">
                    <TextEditor
                      label="Titre"
                      value={room.title}
                      onChange={(value) => {
                        const newRooms = [...apartments.rooms];
                        newRooms[index] = { ...room, title: value };
                        updateApartments({ rooms: newRooms });
                      }}
                    />
                    <TextEditor
                      label="Description"
                      value={room.description}
                      onChange={(value) => {
                        const newRooms = [...apartments.rooms];
                        newRooms[index] = { ...room, description: value };
                        updateApartments({ rooms: newRooms });
                      }}
                    />
                    <TextEditor
                      label="Capacité"
                      value={room.guests}
                      onChange={(value) => {
                        const newRooms = [...apartments.rooms];
                        newRooms[index] = { ...room, guests: value };
                        updateApartments({ rooms: newRooms });
                      }}
                    />
                    <TextEditor
                      label="Chambres"
                      value={room.bedrooms}
                      onChange={(value) => {
                        const newRooms = [...apartments.rooms];
                        newRooms[index] = { ...room, bedrooms: value };
                        updateApartments({ rooms: newRooms });
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={addRoom} variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un appartement
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default ApartmentsEditor;
