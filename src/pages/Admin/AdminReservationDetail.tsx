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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ArrowRightLeft,
  Send,
  History,
  FileText,
  Clock,
  Check,
  AlertCircle,
  Copy,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
}

interface CommunicationHistory {
  _id: string;
  type: 'email' | 'sms' | 'notification';
  subject: string;
  content: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  sentBy: {
    name: string;
    email: string;
  };
  metadata?: {
    emailId?: string;
    error?: string;
  };
}

const AdminReservationDetail: React.FC = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [sendCopyToAdmin, setSendCopyToAdmin] = useState(false);
  const [communicationHistory, setCommunicationHistory] = useState<CommunicationHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { toast } = useToast();
  const [showConfirm, setShowConfirm] = useState<{ open: boolean; type: 'confirm' | 'cancel' }>({ open: false, type: 'confirm' });

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'confirmation',
      name: 'Confirmation de réservation',
      subject: 'Confirmation de votre réservation #{bookingNumber}',
      content: `Bonjour {firstName},

Nous avons le plaisir de vous confirmer votre réservation n°{bookingNumber} du {checkIn} au {checkOut}.

Appartement : {apartmentName} (n°{apartmentNumber})
Adresse : {apartmentAddress}

Montant total : {totalPrice}€

Nous vous remercions pour votre confiance et restons à votre disposition pour toute information complémentaire.

Cordialement,
L'équipe de gestion`,
      variables: ['firstName', 'bookingNumber', 'checkIn', 'checkOut', 'apartmentName', 'apartmentNumber', 'apartmentAddress', 'totalPrice']
    },
    {
      id: 'arrival_info',
      name: 'Informations arrivée',
      subject: 'Informations pour votre arrivée - Réservation #{bookingNumber}',
      content: `Bonjour {firstName},

Nous vous remercions de votre réservation et vous communiquons ci-dessous les informations pour votre arrivée :

📍 Adresse : {apartmentAddress}
🗝️ Récupération des clés : {checkInInstructions}
📞 Contact sur place : {contactPhone}
🕒 Heure d\'arrivée conseillée : À partir de 15h
🕘 Heure de départ : Avant 11h

Nous vous souhaitons un excellent séjour !

Cordialement,
L'équipe de gestion`,
      variables: ['firstName', 'bookingNumber', 'apartmentAddress', 'checkInInstructions', 'contactPhone']
    },
    {
      id: 'payment_reminder',
      name: 'Rappel de paiement',
      subject: 'Rappel - Paiement pour votre réservation #{bookingNumber}',
      content: `Bonjour {firstName},

Nous vous rappelons que le paiement pour votre réservation n°{bookingNumber} est en attente.

Montant à régler : {totalPrice}€
Date limite : {paymentDueDate}

Vous pouvez effectuer le paiement via le lien suivant : {paymentLink}

En cas de difficulté, n'hésitez pas à nous contacter.

Cordialement,
L'équipe de gestion`,
      variables: ['firstName', 'bookingNumber', 'totalPrice', 'paymentDueDate', 'paymentLink']
    },
    {
      id: 'cancellation',
      name: 'Annulation de réservation',
      subject: 'Annulation de votre réservation #{bookingNumber}',
      content: `Bonjour {firstName},

Nous vous confirmons l'annulation de votre réservation n°{bookingNumber} prévue du {checkIn} au {checkOut}.

Conformément à nos conditions générales, voici le détail du remboursement :
{refundDetails}

Nous espérons vous accueillir à nouveau prochainement.

Cordialement,
L'équipe de gestion`,
      variables: ['firstName', 'bookingNumber', 'checkIn', 'checkOut', 'refundDetails']
    }
  ];

  useEffect(() => {
    const fetchReservation = async () => {
      if (!id) return;
      try {
        const res = await api.getAdminBooking(id);
        if (res.success && res.data) {
          setReservation(res.data.data);
          // Charger l'historique des communications
          fetchCommunicationHistory(res.data.data._id);
        }
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger la réservation',
          variant: 'destructive',
        });
      }
    };
    fetchReservation();
  }, [id]);

  const fetchCommunicationHistory = async (bookingId: string) => {
    setLoadingHistory(true);
    try {
      const res = await api.getBookingCommunications(bookingId);
      if (res.success && res.data) {
        setCommunicationHistory(res.data);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (!template || !reservation) return;

    setSelectedTemplate(templateId);
    setSubject(template.subject);

    let content = template.content;
    
    // Remplacer les variables
    const variables = {
      firstName: reservation.user?.firstName || 'Client',
      lastName: reservation.user?.lastName || '',
      bookingNumber: reservation._id?.slice(-8) || reservation.bookingNumber || '',
      checkIn: format(new Date(reservation.checkIn), "dd/MM/yyyy"),
      checkOut: format(new Date(reservation.checkOut), "dd/MM/yyyy"),
      apartmentName: reservation.title || 'Appartement',
      apartmentNumber: reservation.apartmentNumber || '',
      apartmentAddress: reservation.address || 'Adresse non spécifiée',
      totalPrice: reservation.totalPrice || '0',
      currency: reservation.currency || 'EUR',
      // Variables par défaut (à remplacer par les vraies données)
      checkInInstructions: 'Veuillez récupérer les clés à l\'accueil',
      contactPhone: '+33 1 23 45 67 89',
      paymentDueDate: format(new Date(), "dd/MM/yyyy"),
      paymentLink: `${window.location.origin}/payment/${reservation._id}`,
      refundDetails: 'Le remboursement sera effectué dans les 5-10 jours ouvrés.'
    };

    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), String(value));
    });

    setMessage(content);
  };

  const sendEmail = async () => {
    if (!reservation) return;
    
    if (!message.trim()) {
      toast({
        title: 'Message vide',
        description: 'Veuillez saisir un message avant d\'envoyer.',
        variant: 'destructive',
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        title: 'Sujet vide',
        description: 'Veuillez saisir un sujet pour l\'email.',
        variant: 'destructive',
      });
      return;
    }

    setEmailLoading(true);

    try {
      const userId = reservation.user?._id || reservation.user?.id || reservation.user;
      const payload = {
        userIds: [String(userId)],
        subject: subject.trim(),
        message: message.trim(),
        bookingId: reservation._id,
        sendCopyToAdmin,
        templateUsed: selectedTemplate || 'custom'
      };

      const res = await api.sendAdminCommunication(payload);
      
      if (res.success) {
        toast({
          title: 'Email envoyé',
          description: 'Le message a été transmis au client.',
          duration: 3000,
        });
        
        // Réinitialiser le formulaire
        setMessage('');
        setSubject('');
        setSelectedTemplate('');
        
        // Recharger l'historique
        fetchCommunicationHistory(reservation._id);
        
        // Optionnellement, sauvegarder comme brouillon
        saveAsDraft(false);
      } else {
        throw new Error(res.error || 'Erreur lors de l\'envoi');
      }
    } catch (error: any) {
      console.error('Erreur envoi email:', error);
      
      // Gestion des erreurs détaillée
      let errorMessage = 'Impossible d\'envoyer l\'email';
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = errors.map((e: any) => e.msg || e.message).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
      
      // Sauvegarder comme brouillon
      saveAsDraft(true);
    } finally {
      setEmailLoading(false);
    }
  };

  const saveAsDraft = (isError: boolean) => {
    // Sauvegarde locale des brouillons
    const drafts = JSON.parse(localStorage.getItem('emailDrafts') || '[]');
    drafts.push({
      id: Date.now(),
      bookingId: reservation?._id,
      subject,
      message,
      createdAt: new Date().toISOString(),
      isError
    });
    
    // Garder seulement les 10 derniers brouillons
    if (drafts.length > 10) drafts.shift();
    
    localStorage.setItem('emailDrafts', JSON.stringify(drafts));
  };

  const loadDraft = (draftId: number) => {
    const drafts = JSON.parse(localStorage.getItem('emailDrafts') || '[]');
    const draft = drafts.find((d: any) => d.id === draftId);
    if (draft) {
      setSubject(draft.subject);
      setMessage(draft.message);
    }
  };

  const performAction = async () => {
    if (!reservation) return;

    setLoading(true);
    try {
      if (showConfirm.type === 'confirm') {
        const res = await api.confirmBooking(reservation._id);
        if (res.success) {
          toast({
            title: 'Réservation confirmée',
            description: 'Le client a reçu un email de confirmation.',
            duration: 3000,
          });
          // Recharger les données
          const updated = await api.getAdminBooking(reservation._id);
          if (updated.success) {
            setReservation(updated.data);
          }
        } else {
          throw new Error(res.error || 'Erreur lors de la confirmation');
        }
      } else if (showConfirm.type === 'cancel') {
        const res = await api.cancelBooking(reservation._id);
        if (res.success) {
          toast({
            title: 'Réservation annulée',
            description: 'Le client a reçu une notification d\'annulation.',
            duration: 3000,
          });
          // Recharger les données
          const updated = await api.getAdminBooking(reservation._id);
          if (updated.success) {
            setReservation(updated.data);
          }
        } else {
          throw new Error(res.error || 'Erreur lors de l\'annulation');
        }
      }
      setShowConfirm({ open: false, type: 'confirm' });
    } catch (error: any) {
      console.error('Erreur action:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setLoading(false);
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

  const getCommunicationStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copié',
        description: 'Le texte a été copié dans le presse-papier',
        duration: 2000,
      });
    });
  };

  const exportCommunicationHistory = () => {
    const csvContent = [
      ['Date', 'Type', 'Sujet', 'Statut', 'Envoyé par'],
      ...communicationHistory.map(comm => [
        format(new Date(comm.sentAt), 'dd/MM/yyyy HH:mm'),
        comm.type,
        comm.subject,
        comm.status,
        comm.sentBy.name
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `communications_${reservation._id.slice(-8)}_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
          {/* ... (le reste du code reste inchangé) ... */}
        </div>

        {/* Sidebar actions */}
        <div className="space-y-6">
          <Tabs defaultValue="compose" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="compose" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Envoyer
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Historique
              </TabsTrigger>
            </TabsList>

            <TabsContent value="compose">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contacter le client
                  </CardTitle>
                  <CardDescription>
                    Envoyez un email à {reservation.user?.firstName} {reservation.user?.lastName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Template selector */}
                  <div className="space-y-2">
                    <Label htmlFor="template">Modèle d'email</Label>
                    <Select value={selectedTemplate} onValueChange={applyTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un modèle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Personnalisé</SelectItem>
                        {emailTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3" />
                              {template.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Sujet de l'email"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Écrivez votre message au client..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[200px] font-mono text-sm"
                    />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{message.length} caractères</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => copyToClipboard(message)}
                        disabled={!message.trim()}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copier
                      </Button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="send-copy"
                        checked={sendCopyToAdmin}
                        onCheckedChange={setSendCopyToAdmin}
                      />
                      <Label htmlFor="send-copy" className="text-sm">
                        Recevoir une copie
                      </Label>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Copie à l'administrateur
                    </div>
                  </div>

                  {/* Send button */}
                  <Button
                    onClick={sendEmail}
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={emailLoading || !message.trim() || !subject.trim()}
                  >
                    {emailLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer l'email
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Historique des communications
                    </CardTitle>
                    {communicationHistory.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportCommunicationHistory}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    Tous les messages envoyés pour cette réservation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-muted-foreground">Chargement...</div>
                    </div>
                  ) : communicationHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Aucune communication enregistrée</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {communicationHistory.map((comm) => (
                        <div
                          key={comm._id}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getCommunicationStatusIcon(comm.status)}
                              <span className="font-medium">{comm.subject}</span>
                              <Badge variant="outline" className="text-xs">
                                {comm.type}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(comm.sentAt), "dd/MM/yyyy HH:mm")}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {comm.content}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Envoyé par {comm.sentBy.name}
                            </span>
                            {comm.metadata?.error && (
                              <span className="text-red-600">
                                Erreur: {comm.metadata.error}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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