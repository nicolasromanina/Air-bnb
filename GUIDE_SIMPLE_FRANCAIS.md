# 🎉 ENVOI AUTOMATIQUE D'EMAILS - GUIDE FRANÇAIS

## Quoi de Neuf?

Vos clients recevront maintenant **automatiquement un bel email de confirmation** quand ils réservent un appartement. ✉️

## 3 Étapes pour Activer

### 1️⃣ Préparer Gmail

1. Ouvrir https://myaccount.google.com/
2. Cliquer sur **Sécurité** (menu de gauche)
3. Chercher **Mots de passe d'application**
4. Sélectionner **Mail** et **Windows**
5. Copier le mot de passe généré

### 2️⃣ Configurer le Backend

Ajouter ces lignes au fichier `.env` du dossier `backend`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=le-mot-de-passe-copie
SMTP_SECURE=false

ADMIN_EMAIL=admin@votresite.com
CONTACT_EMAIL=contact@votresite.com
CONTACT_PHONE=+33 00 00 000
COMPANY_NAME=Votre Entreprise
```

### 3️⃣ Redémarrer

```bash
cd backend
npm run dev
```

## ✨ Et Voilà!

À partir de maintenant:
- Client créé une réservation
- Email s'envoie **automatiquement** ✓
- En quelques secondes il le reçoit
- Avec tous les détails

## 📧 Quoi dans l'Email?

L'email contient automatiquement:
- ✓ Confirmation de réservation
- ✓ Numéro unique
- ✓ Nom du logement
- ✓ Dates (arrivée/départ)
- ✓ Nombre de nuits
- ✓ Nombre de personnes
- ✓ Prix détaillé
- ✓ Options supplémentaires
- ✓ Contact d'aide

## 🔐 Alternative à Gmail

Si vous préférez un autre service:

**SendGrid** (Recommandé pour Production):
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.votre-clé
SMTP_SECURE=false
```

**Mailgun**:
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@votre-domaine
SMTP_PASS=votre-mot-de-passe
SMTP_SECURE=false
```

## 🧪 Tester

1. Configurer les variables `.env`
2. Redémarrer: `npm run dev`
3. Créer une réservation sur l'app
4. Vérifier la boîte mail
5. L'email arrive! 📧

## 🆘 Ça ne fonctionne pas?

**Email non reçu?**
- [ ] Vérifier le dossier Spam
- [ ] Vérifier les logs: `npm run dev`
- [ ] Vérifier les identifiants Gmail

**Erreur?**
- [ ] Pour Gmail: mot de passe d'APPLICATION (pas le mot de passe principal)
- [ ] Vérifier que `SMTP_HOST=smtp.gmail.com` exactement
- [ ] Vérifier que `SMTP_PORT=587`

## 📚 Documentation Complète

Voir les fichiers:
- `RESUME_EMAIL_IMPLEMENTATION.md` - Résumé rapide
- `QUICK_EMAIL_SETUP.md` - Configuration
- `EMAIL_SETUP_GUIDE.md` - Détails complets
- `IMPLEMENTATION_FLOW.md` - Diagrammes

## 🎯 Résultat

```
AVANT:
Client réserve → Rien
Pas de confirmation email 😞

APRÈS:
Client réserve → Email reçu immédiatement! 
Tous les détails de la réservation 😊
```

## 💡 Petites Astuces

1. **Tester avant déploiement** - Créer une réservation en local
2. **Vérifier les logs** - Voir `RESERVATION_EMAIL_SENT` dans les logs
3. **Personnaliser** - Modifier les couleurs ou contenu dans le code
4. **Fournisseur autre** - SendGrid pour plus de flexibilité

---

**C'est tout! Les emails s'envoient maintenant automatiquement.** 🚀

Pour questions, voir la documentation complète dans les fichiers `.md`
