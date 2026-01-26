import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Calendar, 
  User, 
  Mail, 
  FileText, 
  FileSpreadsheet, 
  Building, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  MessageSquare,
  ArrowRightLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminReservationDetail: React.FC = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const [showConfirm, setShowConfirm] = useState<{ open: boolean; type: 'confirm' | 'cancel' }>({ open: false, type: 'confirm' });

  useEffect(() => {
    const fetchReservation = async () => {
      if (!id) return;
      const res = await api.getAdminBooking(id);
      if (res.success && res.data) setReservation(res.data.data);
    };
    fetchReservation();
  }, [id]);

  const performAction = async () => {
    if (!id) return;
    setLoading(true);
    try {
      if (showConfirm.type === 'confirm') {
        const res = await api.confirmBooking(id);
        if (res.success && res.data) setReservation(res.data.data);
        if (res.success) {
          toast({
            title: 'Réservation confirmée',
            description: 'La réservation a été confirmée.',
          });
        }
      } else {
        const res = await api.cancelBooking(id);
        if (res.success && res.data) setReservation(res.data.data);
        if (res.success) {
          toast({
            title: 'Réservation annulée',
            description: 'La réservation a été annulée.',
          });
        }
      }
    } catch (e) {
      toast({
        title: 'Erreur',
        description: 'Action impossible',
        variant: 'destructive',
      });
    }
    setLoading(false);
    setShowConfirm({ open: false, type: 'confirm' });
  };

  const sendEmail = async () => {
    if (!reservation) return;
    if (!message || message.trim().length === 0) {
      toast({
        title: 'Message vide',
        description: 'Veuillez saisir un message avant d\'envoyer.',
        variant: 'destructive',
      });
      return;
    }

    const userId = reservation.user?._id || reservation.user?.id || reservation.user;
    const payload = { userIds: [String(userId)], subject: "Message de l'administration", message };
    const res = await api.sendAdminCommunication(payload);
    if (res.success) {
      toast({
        title: 'Email envoyé',
        description: 'Le message a été transmis au client.',
      });
      setMessage('');
    } else {
      const errMsg = res.error || res.message || 'Impossible d\'envoyer l\'email';
      // If validation errors from server, show them
      if ((res as any).errors && Array.isArray((res as any).errors)) {
        const first = (res as any).errors[0];
        toast({
          title: 'Erreur',
          description: first.msg || errMsg,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erreur',
          description: errMsg,
          variant: 'destructive',
        });
      }
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
      <Badge variant={config.variant} className="text-sm">
        {config.label}
      </Badge>
    );
  };

  if (!reservation) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Détails de la Réservation</h1>
          <p className="text-muted-foreground">
            Gestion de la réservation #{reservation._id?.slice(-8)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(reservation.status)}
          <Button
            variant="outline"
            size="sm"
            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
            onClick={() => setShowConfirm({ open: true, type: 'confirm' })}
            disabled={loading || reservation.status === 'confirmed'}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmer
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
            onClick={() => setShowConfirm({ open: true, type: 'cancel' })}
            disabled={loading || reservation.status === 'cancelled'}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Annuler
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Détails de la réservation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appartement */}
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <h3 className="font-semibold">{reservation.title}</h3>
                  <p className="text-sm text-muted-foreground">Appartement {reservation.apartmentNumber}</p>
                </div>
              </div>

              {/* Client */}
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <h3 className="font-semibold">
                    {reservation.user?.firstName} {reservation.user?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{reservation.user?.email}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {format(new Date(reservation.checkIn), "dd MMMM yyyy", { locale: fr })}
                    </span>
                    <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {format(new Date(reservation.checkOut), "dd MMMM yyyy", { locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Séjour de {Math.ceil((new Date(reservation.checkOut).getTime() - new Date(reservation.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nuits
                  </p>
                </div>
              </div>

              {/* Prix */}
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <h3 className="text-2xl font-bold">
                    {reservation.totalPrice} {reservation.currency || 'EUR'}
                  </h3>
                  <p className="text-sm text-muted-foreground">Prix total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Options sélectionnées (détails) */}
          {(reservation.additionalOptions?.length || reservation.selectedOptions?.length) && (
            <Card>
              <CardHeader>
                <CardTitle>Options sélectionnées</CardTitle>
                <CardDescription>Détails et coûts des options ajoutées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(reservation.additionalOptions || reservation.selectedOptions || []).map((opt: any, i: number) => {
                  const name = opt.name || opt.optionName || opt.title || 'Option';
                  const qty = opt.quantity ?? opt.qty ?? 1;
                  const unit = opt.price ?? opt.unitPrice ?? 0;
                  const subtotal = Number(unit) * Number(qty);
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="text-sm text-muted-foreground">{opt.pricingType ? (opt.pricingType === 'per_day' ? 'Prix par nuit' : opt.pricingType === 'per_guest' ? 'Prix par personne' : 'Prix fixe') : ''}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">{qty} × {unit}€</div>
                        <div className="font-semibold">{subtotal.toFixed(2)}€</div>
                      </div>
                    </div>
                  );
                })}

                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Coût total options</span>
                    <span className="font-bold">{(reservation.additionalOptionsPrice ?? reservation.optionsPrice ?? 0).toFixed(2)}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {reservation.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Notes additionnelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{reservation.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar actions */}
        <div className="space-y-6">
         

          {/* Envoyer email */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Envoyer un email
              </CardTitle>
              <CardDescription>Contacter le client</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Écrivez votre message au client..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] mb-4"
              />
              <Button 
                onClick={sendEmail} 
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={!message.trim()}
              >
                <Mail className="h-4 w-4 mr-2" />
                Envoyer l'email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs de confirmation */}
      <AlertDialog open={showConfirm.open} onOpenChange={() => setShowConfirm({ open: false, type: 'confirm' })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showConfirm.type === 'confirm' 
                ? 'Confirmer la réservation' 
                : 'Annuler la réservation'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showConfirm.type === 'confirm'
                ? 'Voulez-vous confirmer cette réservation et prévenir le client par email ? Cette action est irréversible.'
                : 'Voulez-vous annuler cette réservation et prévenir le client par email ? Cette action est irréversible.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={performAction}
              disabled={loading}
              className={showConfirm.type === 'confirm' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'}
            >
              {loading ? 'Traitement...' : (showConfirm.type === 'confirm' ? 'Confirmer' : 'Annuler')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminReservationDetail;