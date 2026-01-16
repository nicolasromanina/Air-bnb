import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  Building2,
  FileText,
  CreditCard,
  CheckCircle,
  Tag,
  Mail,
  Settings,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Accueil", href: "/admin/home", icon: Home },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Appartements", href: "/admin/apartments", icon: Building2 },
  { label: "Détails Appartement", href: "/admin/apartment-detail", icon: FileText },
  { label: "Paiement", href: "/admin/payment", icon: CreditCard },
  { label: "Confirmation", href: "/admin/confirmation", icon: CheckCircle },
  { label: "Prix", href: "/admin/pricing", icon: Tag },
  { label: "Contact", href: "/admin/contact", icon: Mail },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          
              <img src="./Logo.png" alt="SWEETHOME" className="h-10 w-auto" />
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors ${
            collapsed ? "absolute right-2" : ""
          }`}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 px-3 mb-3">
            Pages
          </p>
        )}
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/admin" && location.pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border">
        <NavLink
          to="/admin/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Paramètres</span>}
        </NavLink>
      </div>
    </aside>
  );
};
