import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Users as UsersIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZES = [10, 20, 50];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await api.getAdminUsers(page, limit, q);
      if (!mounted) return;
      setLoading(false);
      if (res.success && res.data) {
        setUsers(res.data.data || []);
        setTotal(res.data.meta?.total || 0);
      } else {
        toast.push({ title: 'Erreur', description: res.error || 'Impossible de charger les utilisateurs', variant: 'destructive' });
      }
    })();
    return () => { mounted = false; };
  }, [page, limit, q]);

  const changeRole = async (id: string, role: string) => {
    try {
      const res = await api.updateUserRole(id, { role });
      if (res.success && res.data) {
        setUsers((prev) => prev.map(u => u._id === id ? res.data.data : u));
        toast.push({ title: 'Rôle modifié', description: `Le rôle a été mis à jour en ${role}` });
      } else {
        toast.push({ title: 'Erreur', description: 'Impossible de modifier le rôle', variant: 'destructive' });
      }
    } catch (e) {
      toast.push({ title: 'Erreur', description: 'Erreur réseau', variant: 'destructive' });
    }
  };

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-pink-600 flex items-center gap-2"><UsersIcon /> Gestion des utilisateurs</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Rechercher par nom ou email" className="pl-8 pr-3 py-2 border rounded w-64" />
          </div>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="border p-2 rounded">
            {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rôle</th>
              <th className="p-3">Réservations</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-6 text-center">Chargement...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center">Aucun utilisateur trouvé</td></tr>
            ) : (
              users.map(u => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.firstName} {u.lastName}</td>
                  <td className="p-3 text-sm text-gray-700">{u.email}</td>
                  <td className="p-3">
                    <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)} className="border px-2 py-1 rounded">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="support">Support</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </td>
                  <td className="p-3">{u.reservationsCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">Page {page} / {pages} — {total} utilisateurs</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50"><ChevronLeft /></button>
          {[...Array(pages)].slice(Math.max(0, page-3), page+2).map((_, i) => {
            const pNum = Math.max(1, Math.min(pages, (page-3) + i + 1));
            return (
              <button key={pNum} onClick={() => setPage(pNum)} className={`px-3 py-1 border rounded ${pNum === page ? 'bg-pink-600 text-white' : ''}`}>{pNum}</button>
            );
          })}
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="px-3 py-1 border rounded disabled:opacity-50"><ChevronRight /></button>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
