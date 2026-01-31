import React, { useState } from "react";
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
  LogOut,
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const styles = {
    sidebar: {
      background: "linear-gradient(180deg, #000000 0%, #1a1a1a 100%)",
      boxShadow: collapsed 
        ? "4px 0 15px rgba(236, 72, 153, 0.15)" 
        : "4px 0 25px rgba(236, 72, 153, 0.2)",
      borderRight: "1px solid rgba(255, 255, 255, 0.05)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translateZ(0)",
      willChange: "width",
    },
    header: {
      background: "linear-gradient(90deg, #000000 0%, #1a1a1a 100%)",
      borderBottom: "1px solid rgba(236, 72, 153, 0.2)",
      boxShadow: "0 2px 10px rgba(236, 72, 153, 0.1)",
    },
    logoContainer: {
      background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
      boxShadow: "0 2px 10px rgba(236, 72, 153, 0.3)",
      transition: "all 0.3s ease",
    },
    logoText: {
      background: "linear-gradient(90deg, #ffffff 0%, #fce7f3 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      fontWeight: "800",
      letterSpacing: "1px",
      textShadow: "0 2px 4px rgba(236, 72, 153, 0.3)",
    },
    toggleButton: {
      background: "rgba(236, 72, 153, 0.1)",
      border: "1px solid rgba(236, 72, 153, 0.2)",
      backdropFilter: "blur(10px)",
      transition: "all 0.2s ease",
    },
    sectionHeader: {
      background: "rgba(236, 72, 153, 0.05)",
      borderLeft: "3px solid #ec4899",
      paddingLeft: "12px",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      fontWeight: "700",
      textShadow: "0 1px 2px rgba(236, 72, 153, 0.2)",
      color: "#fce7f3",
    },
    navItem: {
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      borderRadius: "10px",
      margin: "4px 6px",
    },
    navItemActive: {
      background: "linear-gradient(90deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.15) 100%)",
      border: "1px solid rgba(236, 72, 153, 0.3)",
      boxShadow: "0 4px 12px rgba(236, 72, 153, 0.15)",
      position: "relative",
    },
    navItemHover: {
      background: "rgba(236, 72, 153, 0.1)",
      border: "1px solid rgba(236, 72, 153, 0.2)",
      transform: "translateX(4px)",
    },
    iconActive: {
      color: "#ec4899",
      filter: "drop-shadow(0 2px 4px rgba(236, 72, 153, 0.4))",
    },
    footer: {
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(26,26,26,0.9) 100%)",
      borderTop: "1px solid rgba(236, 72, 153, 0.15)",
      backdropFilter: "blur(10px)",
    },
    tooltip: {
      background: "#ec4899",
      color: "#ffffff",
      padding: "6px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      whiteSpace: "nowrap",
      zIndex: "9999",
    },
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {!collapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
          style={{ backdropFilter: "blur(2px)" }}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full transition-all duration-300 z-50 ${
          collapsed ? "w-[80px]" : "w-[280px]"
        }`}
        style={styles.sidebar}
      >
        {/* Header */}
        <div 
          className="h-16 flex items-center justify-between px-5 relative"
          style={styles.header}
        >
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105"
                style={styles.logoContainer}
              >
                <span className="text-white font-bold text-lg">SH</span>
              </div>
              <span className="font-bold text-lg tracking-wide" style={styles.logoText}>
                SWEETHOME
              </span>
            </div>
          ) : (
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto cursor-pointer hover:scale-105"
              style={styles.logoContainer}
            >
              <span className="text-white font-bold text-lg">SH</span>
            </div>
          )}
          
          <button
            onClick={onToggle}
            className={`p-2 rounded-xl hover:scale-105 active:scale-95 ${
              collapsed ? "absolute right-4" : ""
            }`}
            style={styles.toggleButton}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" style={{ color: "#ec4899" }} />
            ) : (
              <ChevronLeft className="w-5 h-5" style={{ color: "#ec4899" }} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-128px)]">
          {navItems.map((item, index) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/admin" && location.pathname.startsWith(item.href));
            const Icon = item.icon;
            const showSection = item.section && !collapsed;
            const prevItem = navItems[index - 1];
            const showSectionHeader = showSection && (!prevItem || prevItem.section !== item.section);
            const isHovered = hoveredItem === item.href;

            return (
              <React.Fragment key={item.href}>
                {showSectionHeader && (
                  <p 
                    className="text-xs px-4 py-2 my-2 first:mt-0"
                    style={styles.sectionHeader}
                  >
                    {item.section}
                  </p>
                )}
                
                {/* Tooltip pour état réduit */}
                {collapsed && (
                  <div className="relative group">
                    <NavLink
                      to={item.href}
                      className="flex items-center justify-center"
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-pink-500/20 to-rose-500/10 border border-pink-500/30"
                            : "hover:bg-pink-500/10 hover:border-pink-500/20 border border-transparent"
                        }`}
                        style={{
                          ...styles.navItem,
                          ...(isActive ? styles.navItemActive : {}),
                          ...(isHovered ? styles.navItemHover : {}),
                        }}
                      >
                        <Icon 
                          className="w-6 h-6 flex-shrink-0" 
                          style={isActive ? styles.iconActive : { color: "#f3f4f6" }}
                        />
                      </div>
                    </NavLink>
                    
                    {/* Tooltip */}
                    <div
                      className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                      style={styles.tooltip}
                    >
                      {item.label}
                    </div>
                  </div>
                )}

                {/* État étendu */}
                {!collapsed && (
                  <NavLink
                    to={item.href}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all group"
                    style={{
                      ...styles.navItem,
                      ...(isActive ? styles.navItemActive : {}),
                    }}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="relative">
                      <Icon 
                        className="w-6 h-6 flex-shrink-0 transition-all group-hover:scale-110" 
                        style={isActive ? styles.iconActive : { color: "#f3f4f6" }}
                      />
                      {isActive && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                      )}
                    </div>
                    <span 
                      className={`text-sm font-medium transition-all ${
                        isActive 
                          ? "text-white font-semibold" 
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                    )}
                  </NavLink>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer */}
        <div 
          className="absolute bottom-0 left-0 right-0 p-4"
          style={styles.footer}
        >
          <div className="space-y-3">
            <NavLink
              to="/admin/settings"
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3 px-4 py-3 rounded-xl"
              } transition-all group`}
              style={styles.navItem}
            >
              <Settings 
                className="w-6 h-6" 
                style={{ 
                  color: location.pathname === "/admin/settings" ? "#ec4899" : "#f3f4f6" 
                }} 
              />
              {!collapsed && (
                <span 
                  className={`text-sm font-medium ${
                    location.pathname === "/admin/settings" 
                      ? "text-white font-semibold" 
                      : "text-gray-300 group-hover:text-white"
                  }`}
                >
                  Paramètres
                </span>
              )}
            </NavLink>
            
            <button
              className={`flex items-center ${
                collapsed ? "justify-center" : "gap-3 px-4 py-3 rounded-xl"
              } transition-all w-full text-gray-300 hover:text-white hover:bg-pink-500/10 group`}
              style={styles.navItem}
              onClick={() => {
                // Logique de déconnexion
                console.log("Déconnexion");
              }}
            >
              <LogOut className="w-6 h-6" />
              {!collapsed && (
                <span className="text-sm font-medium">
                  Déconnexion
                </span>
              )}
            </button>
          </div>
          
          {/* Version info */}
          {!collapsed && (
            <div className="mt-4 pt-4 border-t border-pink-500/10">
              <p className="text-xs text-gray-500 text-center">
                v1.0.0 • SweetHome Admin
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};