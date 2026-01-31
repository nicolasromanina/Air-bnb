import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Save, User, LogOut, Loader2, AlertCircle, CheckCircle2, Eye, RotateCcw } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const { isDirty, isSaving, isLoading, saveContent, resetContent } = useContent();

  const handleSave = async () => {
    await saveContent();
  };

  const handleReset = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les modifications ?")) {
      await resetContent();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Title section */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          {/* Status badges */}
          {isLoading && (
            <Badge variant="outline" className="gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Chargement...
            </Badge>
          )}
          {isDirty && !isLoading && (
            <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300 bg-amber-50">
              <AlertCircle className="w-3 h-3" />
              Non sauvegardé
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Preview button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("/", "_blank")}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Prévisualiser</span>
          </Button>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={!isDirty || isSaving || isLoading}
            size="sm"
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sauvegarde...
              </>
            ) : isDirty ? (
              <>
                <Save className="w-4 h-4" />
                Sauvegarder
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                À jour
              </>
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {user?.name || "Admin"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};