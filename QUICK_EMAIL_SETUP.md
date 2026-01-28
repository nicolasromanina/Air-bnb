# ✉️ Configuration Rapide : Envoi Automatique d'Emails

## 📋 Résumé des Changements

L'application envoie maintenant **automatiquement un email de confirmation** quand un client crée une réservation.

## 🎯 Ce qui a été Implémenté

1. **Méthode d'envoi d'email** dans `backend/src/services/email.service.ts`
   - Méthode: `sendReservationConfirmationEmail()`
   - Email stylisé avec tous les détails de réservation

2. **Intégration automatique** dans `backend/src/services/reservation.service.ts`
   - L'email s'envoie automatiquement lors de la création d'une réservation
   - Les erreurs d'email ne bloquent pas la réservation

3. **Template d'email** professionnel avec:
   - Header coloré au thème de l'app (#FF2D75)
   - Numéro de confirmation
   - Détails du logement
   - Dates et durée
   - Résumé du tarif complet
   - Options supplémentaires
   - Informations de contact

## 🚀 Pour Commencer

### Étape 1: Variables d'Environnement

Ajouter au fichier `.env` du backend:

```bash
# Gmail (le plus simple)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
SMTP_SECURE=false

# Information de l'entreprise
ADMIN_EMAIL=admin@votresite.com
CONTACT_EMAIL=contact@votresite.com
CONTACT_PHONE=+33 00 00 000
COMPANY_NAME=Votre Entreprise
```

### Étape 2: Utiliser Gmail

Pour Gmail, créer un mot de passe d'application:

1. Aller sur https://myaccount.google.com/
2. Sécurité → Mots de passe d'application
3. Sélectionner "Mail" et "Windows"
4. Copier le mot de passe généré
5. Utiliser ce mot de passe pour `SMTP_PASS`

### Étape 3: Redémarrer le Backend

```bash
cd backend
npm run dev
```

### Étape 4: Tester

Créer une réservation depuis l'app → l'email arrive au client ! 🎉

## 📧 Contenu de l'Email

L'email contient automatiquement:

```
✓ Réservation Confirmée!

LOGEMENT RÉSERVÉ
- Titre: [Nom de l'appartement]
- Numéro: [Numéro]
- Chambres: [Nombre]

DATES DE SÉJOUR
- Arrivée: [Date]
- Départ: [Date]
- Durée: [X nuits]
- Personnes: [Nombre]

RÉSUMÉ DU TARIF
- Prix/nuit: [Montant]€
- Nuits: [Nombre]
- Sous-total: [Montant]€
- Options: [Montant]€ (si applicable)
- TOTAL: [Montant]€

BESOIN D'AIDE?
Email: [Email de contact]
Téléphone: [Téléphone]
```

## 🔧 Autres Fournisseurs

### SendGrid (Recommandé pour Production)
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx
SMTP_SECURE=false
```

### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@votre-domaine.mailgun.org
SMTP_PASS=votre-mot-de-passe
SMTP_SECURE=false
```

### OVH
```bash
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASS=votre-mot-de-passe
SMTP_SECURE=true
```

## 🐛 Dépannage

### Email non reçu ?
- Vérifier les logs du serveur: `npm run dev`
- Vérifier le dossier Spam de l'email
- Vérifier que SMTP_HOST/PORT/USER/PASS sont corrects

### Erreur "Invalid credentials" ?
- Mot de passe incorrect
- Pour Gmail: utiliser mot de passe d'application
- Vérifier l'email SMTP_USER

### Erreur "Connection timeout" ?
- Port SMTP incorrect (utiliser 587 ou 465)
- Vérifier SMTP_HOST
- Vérifier la connexion internet

## 📁 Fichiers Modifiés

- `backend/src/services/email.service.ts` - Nouvelle méthode d'envoi
- `backend/src/services/reservation.service.ts` - Intégration automatique

## 📚 Documentation Complète

Voir le fichier `EMAIL_SETUP_GUIDE.md` pour la documentation complète.

## ✅ Checklist

- [ ] Variables d'environnement SMTP ajoutées au `.env`
- [ ] Mot de passe d'application généré (si Gmail)
- [ ] Backend redémarré
- [ ] Test d'une réservation effectué
- [ ] Email reçu par le client

---

**Tous les détails de réservation s'envoient automatiquement avec un email beau et professionnel !** 🚀
