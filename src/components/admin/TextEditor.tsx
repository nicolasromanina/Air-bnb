import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  required?: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </Label>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] resize-none border-border focus:border-primary focus:ring-primary"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-border focus:border-primary focus:ring-primary"
        />
      )}
    </div>
  );
};
