import React, { useEffect, useMemo, useState } from 'react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';

type Tx = {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'refunded';
  date: string;
  customer: string;
};

const PaymentsPage: React.FC = () => {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState<Tx | null>(null);
  const toast = useToast();

  const totals = useMemo(() => {
    const total = txs.reduce((s, t) => s + (t.status === 'paid' ? t.amount : 0), 0);
    const pending = txs.reduce((s, t) => s + (t.status === 'pending' ? t.amount : 0), 0);
    const refunded = txs.reduce((s, t) => s + (t.status === 'refunded' ? t.amount : 0), 0);
    return { total, pending, refunded };
  }, [txs]);

  const doRefund = (tx: Tx) => setConfirmTarget(tx);
  const confirmRefund = () => {
    if (!confirmTarget) return;
    // Call API to refund (admin)
    const target = confirmTarget;
    setConfirmTarget(null);
    (async () => {
      try {
        const res = await api.refundAdminPayment(target.id, 'Refund from admin dashboard');
        if (res.success) {
          setTxs((s) => s.map(t => t.id === target.id ? { ...t, status: 'refunded' } : t));
          toast.push({ title: 'Remboursement effectué', description: `Transaction ${target.id} remboursée.` });
        } else {
          toast.push({ title: 'Erreur', description: res.error || 'Impossible de rembourser.' });
        }
      } catch (err) {
        toast.push({ title: 'Erreur', description: 'Erreur réseau lors du remboursement.' });
      }
    })();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await api.getAdminPayments(page, 50);
        if (!mounted) return;
        if (res.success && res.data) {
          const items = res.data.data.map((p: any) => ({
            id: p.id || p._id || String(p.paymentId || p.id),
            reservationId: p.reservationId || p.metadata?.reservationId || p.reservation?.id || '',
            amount: p.amount_total ? p.amount_total / 100 : (p.amount || p.totalPrice || 0),
            currency: (p.currency || 'EUR').toUpperCase(),
            status: p.status || p.paymentStatus || 'pending',
            date: p.createdAt || p.date || p.created || '',
            customer: p.customerEmail || p.customerName || (p.customer && p.customer.email) || '—',
          } as Tx));

          setTxs(items);
          setTotalPages(res.data.pagination?.pages || 1);
        } else {
          toast.push({ title: 'Erreur', description: res.error || 'Impossible de récupérer les paiements.' });
        }
      } catch (error) {
        toast.push({ title: 'Erreur', description: 'Erreur réseau lors de la récupération des paiements.' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [page]);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Revenue total</div>
          <div className="text-2xl font-bold text-green-700">{totals.total}€</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">En attente</div>
          <div className="text-2xl font-bold text-yellow-600">{totals.pending}€</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Remboursé</div>
          <div className="text-2xl font-bold text-red-600">{totals.refunded}€</div>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Client</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Date</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {txs.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-3 text-sm">{t.id}</td>
                <td className="p-3">{t.customer}</td>
                <td className="p-3">{t.amount} {t.currency}</td>
                <td className="p-3">{t.date}</td>
                <td className="p-3">{t.status}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {t.status === 'paid' && <button onClick={() => doRefund(t)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Rembourser</button>}
                    <Link to={`/admin/reservations/${t.reservationId}`} className="text-pink-600">Réservation</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!confirmTarget}
        title="Confirmer remboursement"
        description={`Voulez-vous rembourser la transaction ${confirmTarget?.id} ?`}
        onCancel={() => setConfirmTarget(null)}
        onConfirm={confirmRefund}
      />
    </div>
  );
};

export default PaymentsPage;
