import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, FileText, FileSpreadsheet, FileBarChart, Calendar, User, Building, CheckCircle, XCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; pages: number } | null>(null);
  const { toast } = useToast();
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; type: 'confirm' | 'cancel' } | null>(null);

  // Débounce search -> q
  useEffect(() => {
    const t = setTimeout(() => setQ(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await api.getAdminBookings({ page, limit, q });
      if (res.success && res.data) {
        const data = res.data as any;
        const items = data.data || data;
        const meta = data.meta || data.pagination || null;
        setBookings(items || []);
        if (meta) {
          const pages = Math.max(1, Math.ceil((meta.total || 0) / (meta.limit || limit)));
          setPagination({ 
            page: meta.page || page, 
            limit: meta.limit || limit, 
            total: meta.total || 0, 
            pages 
          });
        } else {
          setPagination(null);
        }
      }
    };
    fetchBookings();
  }, [page, limit, q]);

  const confirm = (id: string) => setConfirmTarget({ id, type: 'confirm' });
  const cancel = (id: string) => setConfirmTarget({ id, type: 'cancel' });

  const performConfirmAction = async () => {
    if (!confirmTarget) return;
    const { id, type } = confirmTarget;
    
    try {
      if (type === 'confirm') {
        const res = await api.confirmBooking(id);
        if (res.success) {
          setBookings(b => b.map(x => x._id === id ? res.data.data : x));
          toast({
            title: 'Réservation confirmée',
            description: 'Le client a été notifié.',
          });
        } else {
          toast({
            title: 'Erreur',
            description: 'Impossible de confirmer',
            variant: 'destructive',
          });
        }
      } else {
        const res = await api.cancelBooking(id);
        if (res.success) {
          setBookings(b => b.map(x => x._id === id ? res.data.data : x));
          toast({
            title: 'Réservation annulée',
            description: 'Le client a été notifié.',
          });
        } else {
          toast({
            title: 'Erreur',
            description: 'Impossible d\'annuler',
            variant: 'destructive',
          });
        }
      }
    } finally {
      setConfirmTarget(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: 'En attente', variant: 'secondary' },
      confirmed: { label: 'Confirmée', variant: 'default' },
      cancelled: { label: 'Annulée', variant: 'destructive' },
      completed: { label: 'Terminée', variant: 'outline' },
    };
    
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const totalPages = pagination?.pages ?? 1;

  return (
    <div className="space-y-6">
      {/* Titre de la page */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Réservations</h1>
        <p className="text-muted-foreground">
          Gérez et suivez toutes les réservations de votre propriété
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par client, email, appart..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={limit.toString()} 
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Lignes par page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 par page</SelectItem>
                <SelectItem value="20">20 par page</SelectItem>
                <SelectItem value="50">50 par page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Appartement</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucune réservation trouvée
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {b.user?.firstName} {b.user?.lastName}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {b.user?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="font-medium">{b.title}</span>
                        <span className="text-sm text-muted-foreground">
                          Appartement {b.apartmentNumber}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {format(new Date(b.checkIn), "dd MMM yyyy", { locale: fr })}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          → {format(new Date(b.checkOut), "dd MMM yyyy", { locale: fr })}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {b.totalPrice} €
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(b.status)}
                      <div className="flex gap-1">
                        {b.status !== 'confirmed' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => confirm(b._id)}
                            title="Confirmer"
                          >
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </Button>
                        )}
                        {b.status !== 'cancelled' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => cancel(b._id)}
                            title="Annuler"
                          >
                            <XCircle className="h-3 w-3 text-red-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/reservations/${b._id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {bookings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {pagination ? (
              <>
                Page {pagination.page} sur {pagination.pages} • {pagination.total} réservation(s)
              </>
            ) : (
              'Chargement des informations...'
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Précédent
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Page</span>
              <Select value={page.toString()} onValueChange={(value) => setPage(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <SelectItem key={p} value={p.toString()}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">sur {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={!!confirmTarget} onOpenChange={() => setConfirmTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmTarget?.type === 'confirm' 
                ? 'Confirmer la réservation' 
                : 'Annuler la réservation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget?.type === 'confirm'
                ? 'Confirmer cette réservation enverra un email au client.'
                : 'Annuler cette réservation mettra le statut à annulé et enverra un email.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={performConfirmAction}
              className={confirmTarget?.type === 'confirm' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'}
            >
              {confirmTarget?.type === 'confirm' ? 'Confirmer' : 'Annuler'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingsPage;