# 📊 Flow Diagramme - Envoi Automatique d'Email

## Flux de Réservation avec Email Automatique

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT - INTERFACE                           │
│                                                                   │
│  1. Sélectionne dates, logement, options                        │
│  2. Clique sur "Réserver maintenant"                            │
│  3. Confirmation de réservation                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND (React/TypeScript)                         │
│                                                                   │
│  POST /api/reservations                                          │
│  - apartmentId                                                   │
│  - dates (checkIn, checkOut)                                     │
│  - guests, bedrooms, nights                                      │
│  - totalPrice                                                    │
│  - selectedOptions                                               │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│            BACKEND - Reservation Controller                      │
│                                                                   │
│  POST /api/reservations                                          │
│  ↓ validations                                                   │
│  ↓ créer objet ReservationData                                   │
│  ↓ appeler reservationService.createReservation()               │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│         BACKEND - Reservation Service                            │
│                                                                   │
│  createReservation()                                             │
│  ├─ Valider les dates                                            │
│  ├─ Vérifier disponibilité                                       │
│  ├─ Normaliser options supplémentaires                           │
│  ├─ CRÉER la réservation en base de données                      │
│  │  await reservation.save()                                     │
│  │                                                                │
│  └─ 🔄 NOUVEAU: Envoyer email automatiquement                    │
│     │                                                             │
│     ├─ Récupérer infos utilisateur                               │
│     ├─ Appeler emailService.sendReservationConfirmationEmail()  │
│     ├─ L'email s'envoie EN ARRIÈRE-PLAN                          │
│     └─ Les erreurs ne bloquent pas la réservation               │
│                                                                   │
│  ↓ retour Reservation avec ID                                    │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ├─────────────────────┐
                            │                     │
                            ↓                     ↓
        ┌──────────────────────────┐   ┌────────────────────┐
        │   Réponse au Frontend     │   │   Email Service   │
        │                           │   │                   │
        │  ✅ Réservation créée    │   │  📧 SMTP CONFIG   │
        │  - ID                     │   │  ├─ Host          │
        │  - Status: pending        │   │  ├─ Port          │
        │  - Total Price            │   │  ├─ User          │
        │                           │   │  └─ Password      │
        └──────────────────────────┘   │                   │
                                        │  Envoie via      │
                                        │  Nodemailer      │
                                        │                   │
                                        │  ├─ HTML format │
                                        │  ├─ Text format │
                                        │  └─ Attachements │
                                        │                   │
                                        └────────────────────┘
                                                 │
                                                 ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SMTP SERVER                                   │
│                                                                   │
│  Gmail / SendGrid / Mailgun / OVH / etc.                        │
│                                                                   │
│  Valide et achemine l'email                                      │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                  CLIENT EMAIL BOX                                │
│                                                                   │
│  📧 Confirmation reçue                                           │
│                                                                   │
│  ✓ Réservation Confirmée!                                        │
│                                                                   │
│  Numéro: ABC123456                                               │
│  Logement: Apartment 5                                           │
│  Dates: 15 Feb - 20 Feb (5 nuits)                               │
│  Total: 1,250€                                                   │
│                                                                   │
│  📞 Besoin d'aide? contact@example.com                           │
└─────────────────────────────────────────────────────────────────┘
```

## Détail du Process d'Email

```
┌─ emailService.sendReservationConfirmationEmail()
│
├─ 1. PRÉPARATION DES DONNÉES
│  └─ Récupère: firstName, lastName, title, dates, prix, options
│
├─ 2. FORMATAGE DE LA DATE
│  └─ Convertit Date en format français lisible
│
├─ 3. CONSTRUCTION DU HTML
│  ├─ En-tête coloré (#FF2D75)
│  ├─ Numéro de confirmation
│  ├─ Détails du logement
│  ├─ Dates et durée
│  ├─ Résumé du tarif avec tableau
│  ├─ Options supplémentaires (si présentes)
│  ├─ Informations de contact
│  └─ Pied de page professionnel
│
├─ 4. CONSTRUCTION DU TEXTE BRUT
│  └─ Version sans HTML pour compatibilité
│
├─ 5. CRÉATION DE L'OBJET EMAIL
│  ├─ To: email du client
│  ├─ Subject: "Confirmation de réservation - [Nom du logement]"
│  ├─ HTML: version formatée
│  └─ Text: version brute
│
├─ 6. ENVOI VIA SMTP
│  └─ transporter.sendMail(mailOptions)
│
├─ 7. GESTION DES ERREURS
│  ├─ Si succès: return true
│  └─ Si erreur: log et return false (ne pas bloquer)
│
└─ ✅ EMAIL ENVOYÉ
```

## Résilience et Gestion des Erreurs

```
SCENARIO 1: Email envoie avec succès
├─ Réservation créée ✓
├─ Email envoyé ✓
└─ Client reçoit confirmation ✓

SCENARIO 2: Erreur d'email (SMTP indisponible)
├─ Réservation créée ✓ (pas affectée)
├─ Email échoue ✗ (loggé)
├─ Erreur ne bloque pas la réservation
└─ Client a quand même sa réservation en base
   (Rappel: la réservation est créée AVANT d'envoyer l'email)

SCENARIO 3: Email invalide du client
├─ Réservation créée ✓
├─ Email échoue ✗ (adresse invalide)
├─ Erreur loggée
└─ Admin peut être notifié séparément si besoin

SCENARIO 4: Configuration SMTP manquante
├─ Réservation créée ✓
├─ Email échoue ✗ (config non disponible)
├─ Erreur loggée clairement
└─ Message: "Check SMTP_HOST, SMTP_PORT, etc."
```

## Variables d'Environnement Requises

```
┌─ SMTP Configuration
├─ SMTP_HOST        → Adresse du serveur (ex: smtp.gmail.com)
├─ SMTP_PORT        → Port SMTP (587 ou 465)
├─ SMTP_USER        → Email d'authentification
├─ SMTP_PASS        → Mot de passe ou token
├─ SMTP_SECURE      → true/false selon port
│
├─ Contact Information
├─ ADMIN_EMAIL      → Email admin pour notifications
├─ CONTACT_EMAIL    → Email affiché dans les emails
├─ CONTACT_PHONE    → Téléphone dans l'email
│
└─ Company Info
   └─ COMPANY_NAME  → Nom affiché dans l'email
```

## Structure des Données d'Email

```
reservationData = {
  firstName: string              // Prénom du client
  lastName: string               // Nom du client
  title: string                  // Nom du logement
  apartmentNumber: string        // Numéro d'appartement
  checkIn: Date                  // Date d'arrivée
  checkOut: Date                 // Date de départ
  nights: number                 // Nombre de nuits
  guests: number                 // Nombre de personnes
  bedrooms: number               // Nombre de chambres
  totalPrice: number             // Prix total
  pricePerNight: number          // Prix par nuit
  additionalOptionsPrice?: number // Prix des options
  additionalOptions?: Array<{    // Détail des options
    name: string
    price: number
    quantity: number
  }>
  reservationId: string          // ID unique de la réservation
}
```

## Timeline d'Exécution

```
T+0ms     → Client clique "Réserver"
T+50ms    → Requête arrive au backend
T+100ms   → Validation des données
T+150ms   → Vérification de disponibilité
T+200ms   → Création en base de données ✓
T+250ms   → Récupération infos utilisateur
T+300ms   → Construction email HTML
T+350ms   → Construction email texte
T+400ms   → Connexion SMTP
T+450ms   → Envoi email
T+550ms   → Confirmation reçue du serveur ✓
T+600ms   → Réponse au client (Réservation créée)
T+700ms   → Email arrive chez le client (quelques secondes)

⏱️  Total: ~600ms avant réponse au client
📧 Email arrive: quelques secondes après
```

## Logs Attendus dans la Console

```
[DEBUG] CreateReservation() called
[DEBUG] Validating reservation data...
[DEBUG] Checking for overlapping reservations...
[DEBUG] Saving reservation to database...
[INFO]  RESERVATION_CREATED { reservationId: '507f1f77...' }
[INFO]  SENDING_RESERVATION_EMAIL { reservationId: '507f1f77...', userEmail: 'client@example.com' }
[DEBUG] Fetching user data for email...
[DEBUG] Generating HTML email content...
[DEBUG] Sending email via SMTP...
[INFO]  RESERVATION_EMAIL_SENT { reservationId: '507f1f77...', userEmail: 'client@example.com' }
[SUCCESS] Response sent to client
```

## Support des Options Supplémentaires

```
Si la réservation inclut des options:

Options Array:
├─ Option 1: Petit déjeuner
│  ├─ Prix: 15€/personne
│  ├─ Quantité: 2 personnes
│  └─ Total: 30€
│
├─ Option 2: Nettoyage
│  ├─ Prix: 50€/nuit
│  ├─ Quantité: 5 nuits
│  └─ Total: 250€
│
└─ Option 3: Parking
   ├─ Prix: 20€/nuit
   ├─ Quantité: 5 nuits
   └─ Total: 100€

Résumé dans l'email:
Sous-total logement: 1,000€
Options supplémentaires: 380€
TOTAL: 1,380€
```

---

**Ce flow garantit une expérience utilisateur fluide avec email automatique et sécurité de la réservation.**
