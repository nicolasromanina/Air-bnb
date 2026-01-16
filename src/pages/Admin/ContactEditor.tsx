import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionCard } from "@/components/admin/SectionCard";
import { TextEditor } from "@/components/admin/TextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useContent } from "@/context/ContentContext";

const ContactEditor: React.FC = () => {
  const { content, updateContent } = useContent();
  const contact = content.contact;

  const updateContact = (data: Partial<typeof contact>) => {
    updateContent("contact", data);
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Page Contact"
        subtitle="Modifiez les informations de contact"
      />

      <div className="p-6 space-y-6 max-w-4xl">
        {/* Contact Info */}
        <SectionCard title="Informations de contact" description="Coordonnées affichées">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextEditor
              label="Email"
              value={contact.email}
              onChange={(value) => updateContact({ email: value })}
            />
            <TextEditor
              label="Téléphone"
              value={contact.phone}
              onChange={(value) => updateContact({ phone: value })}
            />
          </div>
          <TextEditor
            label="Adresse"
            value={contact.address}
            onChange={(value) => updateContact({ address: value })}
          />
        </SectionCard>

        {/* Form Labels */}
        <SectionCard title="Labels du formulaire" description="Textes des placeholders">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextEditor
              label="Placeholder Nom"
              value={contact.formFields.name}
              onChange={(value) =>
                updateContact({ formFields: { ...contact.formFields, name: value } })
              }
            />
            <TextEditor
              label="Placeholder Téléphone"
              value={contact.formFields.phone}
              onChange={(value) =>
                updateContact({ formFields: { ...contact.formFields, phone: value } })
              }
            />
            <TextEditor
              label="Placeholder Email"
              value={contact.formFields.email}
              onChange={(value) =>
                updateContact({ formFields: { ...contact.formFields, email: value } })
              }
            />
            <TextEditor
              label="Placeholder Adresse"
              value={contact.formFields.address}
              onChange={(value) =>
                updateContact({ formFields: { ...contact.formFields, address: value } })
              }
            />
          </div>
          <TextEditor
            label="Placeholder Message"
            value={contact.formFields.message}
            onChange={(value) =>
              updateContact({ formFields: { ...contact.formFields, message: value } })
            }
          />
          <TextEditor
            label="Texte du bouton"
            value={contact.submitButton}
            onChange={(value) => updateContact({ submitButton: value })}
          />
        </SectionCard>

        {/* Image */}
        <SectionCard title="Image de la section" description="Photo d'accompagnement">
          <ImageUploader
            label="Image contact"
            value={contact.image}
            onChange={(value) => updateContact({ image: value })}
            aspectRatio="4/3"
          />
        </SectionCard>
      </div>
    </div>
  );
};

export default ContactEditor;
