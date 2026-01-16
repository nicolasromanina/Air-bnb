import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// --- Icons (SVG) ---
const DashboardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const PaymentIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;

// --- Sidebar Item Sub-component ---
const SidebarLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link to={to} className={`flex items-center gap-4 px-4 py-3 rounded-[12px] transition-all ${
      active ? 'bg-[#FF2D75] text-white shadow-md shadow-[#FF2D75]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-black'
    }`}>
      {icon}
      <span className="text-[14px] font-bold">{label}</span>
    </Link>
  );
};

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-['Montserrat'] text-[#111827]">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col fixed h-full z-10">
        <div className="p-8">
          <img src="/Logo.png" alt="Logo" className="h-[35px] w-auto" />
        </div>
        
        <nav className="flex-1 px-6 space-y-2 mt-4">
          <SidebarLink to="/dashboard" icon={<DashboardIcon />} label="Vue d'ensemble" />
          <SidebarLink to="/payments" icon={<PaymentIcon />} label="Paiements" />
          <SidebarLink to="/clients" icon={<UsersIcon />} label="Clients" />
        </nav>

        <div className="p-6 border-t border-gray-50">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[12px]">
            <div className="w-10 h-10 bg-[#FF2D75] rounded-full flex items-center justify-center text-white font-bold">A</div>
            <div>
              <p className="text-[13px] font-bold">Admin User</p>
              <p className="text-[11px] text-gray-400">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 ml-[280px] p-10 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;