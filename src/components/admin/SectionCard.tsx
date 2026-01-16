import React, { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  children,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
      >
        <div className="text-left">
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="p-5 pt-0 border-t border-border">
          <div className="pt-5 space-y-5">{children}</div>
        </div>
      )}
    </div>
  );
};
