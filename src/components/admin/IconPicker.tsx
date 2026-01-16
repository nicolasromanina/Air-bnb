import React, { useState } from "react";
import {
  Home,
  Bed,
  Wifi,
  Car,
  Waves,
  TreePine,
  Tv,
  Armchair,
  Book,
  Utensils,
  Umbrella,
  Crown,
  Star,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Search,
  Settings,
  Check,
  type LucideIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  bed: Bed,
  wifi: Wifi,
  car: Car,
  waves: Waves,
  trees: TreePine,
  tv: Tv,
  armchair: Armchair,
  book: Book,
  utensils: Utensils,
  umbrella: Umbrella,
  crown: Crown,
  star: Star,
  heart: Heart,
  phone: Phone,
  mail: Mail,
  mappin: MapPin,
  calendar: Calendar,
  users: Users,
  search: Search,
  settings: Settings,
};

interface IconPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  label,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const SelectedIcon = iconMap[value] || Home;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 border-border"
          >
            <SelectedIcon className="w-5 h-5" />
            <span className="capitalize">{value || "Choisir une icône"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(iconMap).map(([key, Icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={`p-2.5 rounded-lg transition-all hover:bg-muted ${
                  value === key
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 mx-auto" />
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Home;
};
