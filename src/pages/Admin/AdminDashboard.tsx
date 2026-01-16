import React, { useState } from 'react';

// --- Types ---
interface PaymentRecord {
  id: string;
  client: string;
  email: string;
  apartment: string;
  amount: number;
  date: string;
  method: 'Visa' | 'Mastercard' | 'Paypal';
  status: 'Complété' | 'En attente' | 'Remboursé';
}

// --- Icons (SVG Inline) ---
const DashboardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const PaymentIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const UsersIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

const AdminDashboard: React.FC = () => {
  const [payments] = useState<PaymentRecord[]>([
    { id: '1', client: 'Jon Doe Lorem', email: 'jon.doe@example.com', apartment: '205', amount: 800, date: '12 Jan 2024', method: 'Mastercard', status: 'Complété' },
    { id: '2', client: 'Jane Smith', email: 'jane.s@example.com', apartment: '102', amount: 1200, date: '14 Jan 2024', method: 'Visa', status: 'En attente' },
    { id: '3', client: 'Alex Martin', email: 'alex.m@example.com', apartment: '404', amount: 950, date: '15 Jan 2024', method: 'Paypal', status: 'Complété' },
    { id: '4', client: 'Marc Durand', email: 'm.durand@test.com', apartment: '301', amount: 600, date: '16 Jan 2024', method: 'Visa', status: 'Remboursé' },
  ]);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-['Montserrat'] text-[#111827]">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col fixed h-full">
        <div className="p-8">
          <img src="/Logo.png" alt="Logo" className="h-[35px] w-auto" />
        </div>
        
        <nav className="flex-1 px-6 space-y-2 mt-4">
          <SidebarItem icon={<DashboardIcon />} label="Vue d'ensemble" active />
          <SidebarItem icon={<PaymentIcon />} label="Paiements" />
          <SidebarItem icon={<UsersIcon />} label="Clients" />
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

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-[280px] p-10">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-[28px] font-bold">Gestion des paiements</h1>
            <p className="text-gray-400 text-[14px]">Gérez et suivez toutes les transactions de la plateforme.</p>
          </div>
          <button className="bg-[#FF2D75] text-white px-6 py-3 rounded-[10px] font-bold text-[14px] hover:bg-[#e62969] transition-all shadow-lg shadow-[#FF2D75]/20">
            Exporter Rapport (CSV)
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Revenus Totaux" value="24,500€" change="+12.5%" />
          <StatCard title="Paiements en attente" value="1,200€" change="-3%" color="text-orange-500" />
          <StatCard title="Transactions" value="142" change="+18" />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-[18px]">Historique des transactions</h3>
            <input 
              type="text" 
              placeholder="Rechercher un client ou un appartement..." 
              className="bg-[#F3F4F6] px-4 py-2 rounded-[8px] text-[13px] w-[300px] outline-none border border-transparent focus:border-[#FF2D75]/20"
            />
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-5 text-[12px] font-bold uppercase text-gray-400 tracking-wider">Client</th>
                <th className="p-5 text-[12px] font-bold uppercase text-gray-400 tracking-wider">Appartement</th>
                <th className="p-5 text-[12px] font-bold uppercase text-gray-400 tracking-wider">Montant</th>
                <th className="p-5 text-[12px] font-bold uppercase text-gray-400 tracking-wider">Méthode</th>
                <th className="p-5 text-[12px] font-bold uppercase text-gray-400 tracking-wider">Statut</th>
                <th className="p-5 text-[12px] font-bold uppercase text-gray-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-5">
                    <p className="font-bold text-[14px]">{p.client}</p>
                    <p className="text-[12px] text-gray-400">{p.email}</p>
                  </td>
                  <td className="p-5 text-[14px] font-medium text-gray-600">N° {p.apartment}</td>
                  <td className="p-5 text-[15px] font-bold">{p.amount}€</td>
                  <td className="p-5">
                    <span className="text-[12px] bg-gray-100 px-3 py-1 rounded-full font-medium">{p.method}</span>
                  </td>
                  <td className="p-5">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="p-5 text-right">
                    <button className="text-[#FF2D75] text-[13px] font-bold hover:underline">Voir détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="p-5 border-t border-gray-50 flex justify-center">
            <button className="text-[13px] font-bold text-gray-400 hover:text-black transition-colors">Charger plus de résultats</button>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-components ---

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-[12px] cursor-pointer transition-all ${active ? 'bg-[#FF2D75] text-white shadow-md shadow-[#FF2D75]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}>
    {icon}
    <span className="text-[14px] font-bold">{label}</span>
  </div>
);

const StatCard = ({ title, value, change, color = "text-green-500" }: { title: string, value: string, change: string, color?: string }) => (
  <div className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm">
    <p className="text-gray-400 text-[12px] font-bold uppercase tracking-wider mb-2">{title}</p>
    <div className="flex items-end gap-3">
      <h2 className="text-[28px] font-black leading-none">{value}</h2>
      <span className={`text-[12px] font-bold ${color}`}>{change}</span>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: PaymentRecord['status'] }) => {
  const styles = {
    'Complété': 'bg-green-100 text-green-600',
    'En attente': 'bg-orange-100 text-orange-600',
    'Remboursé': 'bg-red-100 text-red-600',
  };
  return <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${styles[status]}`}>{status}</span>;
};

export default AdminDashboard;