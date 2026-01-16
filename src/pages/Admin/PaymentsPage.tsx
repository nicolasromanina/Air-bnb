import React from 'react';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    'Complété': 'bg-green-100 text-green-600',
    'En attente': 'bg-orange-100 text-orange-600',
    'Remboursé': 'bg-red-100 text-red-600',
  };
  return <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${styles[status]}`}>{status}</span>;
};

const PaymentsPage = () => {
  const payments = [
    { id: '1', client: 'Jon Doe Lorem', email: 'jon.doe@example.com', apartment: '205', amount: 800, method: 'Mastercard', status: 'Complété' },
    { id: '2', client: 'Jane Smith', email: 'jane.s@example.com', apartment: '102', amount: 1200, method: 'Visa', status: 'En attente' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[28px] font-bold">Historique des Paiements</h1>
          <p className="text-gray-400 text-[14px]">Suivi détaillé des transactions financières.</p>
        </div>
        <button className="bg-[#FF2D75] text-white px-6 py-3 rounded-[10px] font-bold text-[14px] shadow-lg shadow-[#FF2D75]/20 hover:scale-105 transition-transform">
          Exporter CSV
        </button>
      </header>

      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="p-5 text-[12px] font-bold uppercase text-gray-400">Client</th>
              <th className="p-5 text-[12px] font-bold uppercase text-gray-400">Appartement</th>
              <th className="p-5 text-[12px] font-bold uppercase text-gray-400">Montant</th>
              <th className="p-5 text-[12px] font-bold uppercase text-gray-400">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="p-5">
                  <p className="font-bold text-[14px]">{p.client}</p>
                  <p className="text-[12px] text-gray-400">{p.email}</p>
                </td>
                <td className="p-5 text-[14px] font-medium">N° {p.apartment}</td>
                <td className="p-5 text-[15px] font-bold">{p.amount}€</td>
                <td className="p-5"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage;