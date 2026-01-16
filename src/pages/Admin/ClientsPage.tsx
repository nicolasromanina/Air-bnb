import React from 'react';

const ClientsPage = () => {
  const clients = [
    { name: 'Jon Doe Lorem', email: 'jon.doe@example.com', reservations: 4, spent: '3,200€', joinDate: 'Jan 2023' },
    { name: 'Jane Smith', email: 'jane.s@gmail.com', reservations: 2, spent: '2,400€', joinDate: 'Mars 2023' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-[28px] font-bold">Base Clients</h1>
          <p className="text-gray-400 text-[14px]">Liste complète des utilisateurs enregistrés.</p>
        </div>
        <button className="bg-[#FF2D75] text-white px-6 py-3 rounded-[10px] font-bold text-[13px] shadow-lg shadow-[#FF2D75]/20">
          Ajouter un client
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {clients.map((client, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center font-bold text-[#FF2D75] text-xl uppercase">
                {client.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-[16px]">{client.name}</h3>
                <p className="text-[12px] text-gray-400">{client.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
              <div>
                <p className="text-[10px] font-bold text-gray-300 uppercase">Réservations</p>
                <p className="text-[16px] font-bold">{client.reservations}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-300 uppercase">Total dépensé</p>
                <p className="text-[16px] font-bold text-[#FF2D75]">{client.spent}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;