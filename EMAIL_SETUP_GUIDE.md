# Guide de Configuration des Emails Automatiques

## 📧 Envoi Automatique d'Email lors de Réservation

Ce guide explique comment configurer le système d'envoi automatique d'emails pour les confirmations de réservation.

## 🔧 Configuration SMTP Requise

### Variables d'Environnement (.env backend)

Pour que le système d'envoi d'email fonctionne, vous devez configurer les variables d'environnement SMTP suivantes dans votre fichier `.env` :

```bash
# Configuration SMTP (serveur mail)
SMTP_HOST=smtp.gmail.com              # Adresse du serveur SMTP
SMTP_PORT=587                         # Port SMTP (587 pour TLS, 465 pour SSL)
SMTP_USER=votre-email@gmail.com       # Email d'authentification
SMTP_PASS=votre-mot-de-passe          # Mot de passe ou token d'authentification
SMTP_SECURE=false                     # true pour SSL (port 465), false pour TLS (port 587)

# Email administrateur et contact
ADMIN_EMAIL=admin@votresite.com       # Email pour les notifications administrateur
CONTACT_EMAIL=contact@votresite.com   # Email de contact affichée aux utilisateurs
CONTACT_PHONE=+33 00 00 000           # Numéro de téléphone de contact

# Informations de l'entreprise
COMPANY_NAME=Votre Nom d'Entreprise  # Nom de l'entreprise dans les emails
```

## 📮 Fournisseurs SMTP Recommandés

### Gmail
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=mot-de-passe-application    # Générer dans les paramètres Google
```

⚠️ **Important**: Pour Gmail, activez l'authentification à deux facteurs et générez un mot de passe d'application spécifique.

### SendGrid
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxx    # Votre clé API SendGrid
```

### Mailgun
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@votre-domaine.mailgun.org
SMTP_PASS=votre-mot-de-passe-mailgun
```

### OVH
```
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=votre-email@votre-domaine.com
SMTP_PASS=votre-mot-de-passe
```

## 🚀 Fonctionnement Automatique

### Quand l'Email est Envoyé ?

L'email de confirmation est envoyé **automatiquement** au moment où :
1. L'utilisateur crée une réservation
2. La réservation est validée et enregistrée en base de données
3. L'email est envoyé au client sans intervention manuelle

### Contenu de l'Email

L'email de confirmation contient :
- ✅ Numéro de confirmation de réservation
- 🏠 Détails du logement (titre, numéro, chambres)
- 📅 Dates d'arrivée et de départ
- 👥 Nombre de nuits et de personnes
- 💰 Détail complet du tarif
- 📋 Options supplémentaires (si présentes)
- 📞 Informations de contact

### Format de l'Email

L'email est envoyé en deux formats :
- **HTML** : Version stylisée avec mise en page
- **Texte brut** : Version sans HTML pour la compatibilité

## ⚙️ Configuration du Backend

### 1. Vérifier l'Installation
```bash
npm list nodemailer
# Devrait afficher: nodemailer@6.9.4 (ou version plus récente)
```

### 2. Tester la Configuration
```bash
# Depuis le dossier backend
npm run test:email  # (Si la commande existe)

# Ou vérifier les logs du serveur:
npm run dev  # Lancer le serveur en mode développement
```

### 3. Logs de Confirmation

Lors d'une réservation, vous devriez voir dans les logs :
```
[LOG] SENDING_RESERVATION_EMAIL { reservationId: '...', userEmail: 'client@email.com' }
[LOG] RESERVATION_EMAIL_SENT { reservationId: '...', userEmail: 'client@email.com' }
```

## 🔍 Dépannage

### L'email ne s'envoie pas

**Problème**: L'email n'est pas reçu par le client

**Solutions**:
1. Vérifier les logs du serveur pour les erreurs SMTP
2. Vérifier que `SMTP_HOST`, `SMTP_USER` et `SMTP_PASS` sont corrects
3. Vérifier le port SMTP (587 pour TLS, 465 pour SSL)
4. Vérifier que le paramètre `SMTP_SECURE` correspond au port
5. Vérifier l'email de l'utilisateur en base de données
6. Essayer avec un compte test d'abord

### Erreur: "Invalid credentials"

**Cause**: Les identifiants SMTP sont incorrects

**Solution**: Vérifier que `SMTP_USER` et `SMTP_PASS` sont exacts. Pour Gmail, utiliser un mot de passe d'application.

### Erreur: "Network error"

**Cause**: Impossible de se connecter au serveur SMTP

**Solution**: 
- Vérifier le `SMTP_HOST` et le `SMTP_PORT`
- Vérifier la connexion internet
- Vérifier les pare-feu/firewall

### Erreur: "Connection timeout"

**Cause**: Le serveur SMTP ne répond pas

**Solution**: Essayer avec un port différent ou un serveur SMTP différent

## 📝 Structure du Code

### Services/Email
- **File**: `backend/src/services/email.service.ts`
- **Méthode**: `sendReservationConfirmationEmail()`
- **Appelé depuis**: `backend/src/services/reservation.service.ts`

### Points d'Intégration
1. Lors de la création d'une réservation dans `createReservation()`
2. L'email est envoyé après que la réservation soit sauvegardée
3. Les erreurs d'envoi ne bloquent pas la création de réservation

## 🔐 Sécurité

- ✅ Les mots de passe SMTP ne sont jamais loggés
- ✅ Les emails sont validés avant envoi
- ✅ Les informations sensibles restent confidentielles
- ✅ Les erreurs d'email n'exposent pas d'informations

## 📊 Monitoring

Pour monitorer les emails envoyés :

1. **Logs du serveur** : Vérifier les logs pour les messages `SENDING_RESERVATION_EMAIL`
2. **Base de données** : Vérifier que les réservations sont créées
3. **Boîte mail** : Vérifier la réception des emails clients

## 🚀 Déploiement en Production

### Render.com

Si vous deployez sur Render.com, ajouter les variables d'environnement :

1. Aller dans Settings → Environment
2. Ajouter les variables SMTP
3. Redéployer l'application

### Autres Plateformes

- **Heroku**: Variables via `heroku config:set`
- **Railway**: Variables dans les paramètres du projet
- **Cloud Run**: Variables dans les secrets
- **AWS**: Variables dans les paramètres de déploiement

## ✅ Checklist de Configuration

- [ ] `SMTP_HOST` configuré correctement
- [ ] `SMTP_PORT` configuré correctement
- [ ] `SMTP_USER` est un email valide
- [ ] `SMTP_PASS` est correct (mot de passe application pour Gmail)
- [ ] `SMTP_SECURE` correspond au port
- [ ] `ADMIN_EMAIL` configuré
- [ ] `CONTACT_EMAIL` configuré
- [ ] `COMPANY_NAME` configuré
- [ ] Tests d'envoi réussis
- [ ] Application redéployée avec les nouvelles variables

## 📞 Support

Pour toute question ou problème :
1. Consulter les logs du serveur
2. Vérifier la syntaxe des variables d'environnement
3. Essayer avec un fournisseur SMTP différent
4. Consulter la documentation du fournisseur SMTP
