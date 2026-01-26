import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut, Calendar, Settings, User, Menu as MenuIcon } from "lucide-react";

const UserMenu = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (!isAuthenticated) return null;

  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        title={`${user?.firstName} ${user?.lastName}`}
      >
        <div className="w-8 h-8 bg-[#FF1B7C] text-white rounded-full flex items-center justify-center text-sm font-bold">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-semibold text-gray-800">
          {user?.firstName}
        </span>
        <MenuIcon size={18} className="text-gray-600" />
      </button>

      {/* Menu Déroulant */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[1001]">
          {/* En-tête du menu */}
          <div className="px-4 py-3 border-b bg-gray-50">
            <p className="font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
          </div>

          {/* Éléments du menu */}
          <div className="py-2">
            <button
              onClick={() => {
                navigate("/reservations");
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#FF1B7C] transition-colors flex items-center gap-3"
            >
              <Calendar size={18} />
              Mes réservations
            </button>

            {user?.role === "admin" && (
              <button
                onClick={() => {
                  navigate("/admin");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#FF1B7C] transition-colors flex items-center gap-3"
              >
                <Settings size={18} />
                Tableau de bord admin
              </button>
            )}

            <button
              onClick={() => {
                navigate("/profile");
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#FF1B7C] transition-colors flex items-center gap-3"
            >
              <User size={18} />
              Mon profil
            </button>
          </div>

          {/* Déconnexion */}
          <div className="border-t">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
