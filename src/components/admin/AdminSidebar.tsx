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
  Menu,
  PanelBottom,
  Users,
  CalendarCheck,
  Wallet,
  Scale,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  // Gestion section
  { label: "Clients", href: "/admin/users", icon: Users, section: "Gestion" },
  { label: "Réservations", href: "/admin/bookings", icon: CalendarCheck },
  // CMS section
 
  { label: "Accueil", href: "/admin/home", icon: Home, section: "CMS" },
  { label: "Services", href: "/admin/services", icon: Briefcase },
  { label: "Appartements", href: "/admin/apartments", icon: Building2 },
  { label: "Détails Appart", href: "/admin/apartment-details", icon: FileText },
  { label: "Contact", href: "/admin/contact", icon: Mail },
  { label: "Pied de page", href: "/admin/footer", icon: PanelBottom },
  // Légal section
  { label: "Mentions Légales", href: "/admin/legal-editor", icon: Scale, section: "Légal" },
  { label: "Politique de Confidentialité", href: "/admin/policy-editor", icon: Scale },
  { label: "Conditions Générales", href: "/admin/general-conditions-editor", icon: Scale },
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-sm tracking-wide">SWEETHOME</span>
          </div>
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
        {navItems.map((item, index) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/admin" && location.pathname.startsWith(item.href));
          const Icon = item.icon;
          const showSection = item.section && !collapsed;
          const prevItem = navItems[index - 1];
          const showSectionHeader = showSection && (!prevItem || prevItem.section !== item.section);

          return (
            <React.Fragment key={item.href}>
              {showSectionHeader && (
                <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50 px-3 mb-2 mt-4 first:mt-0">
                  {item.section}
                </p>
              )}
              <NavLink
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
            </React.Fragment>
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
