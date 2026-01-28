# 🔄 Guide de Migration MongoDB

## Vue d'ensemble

Ce guide explique comment migrer votre base de données MongoDB pour supporter le nouveau système d'annulation de réservation.

**Compatibilité:** Les changements sont **backwards compatible** - aucune donnée existante ne sera supprimée.

---

## ✅ Qu'est-ce qui Change?

### Schema Reservation

**AVANT:**
```javascript
{
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  // 30+ autres champs...
  // Aucun champ pour tracking des actions
}
```

**APRÈS:**
```javascript
{
  status: 'pending' | 'confirmed' | 'checked_in' | 'completed' 
        | 'cancelled' | 'early_checkout' | 'dispute'
  
  // 9 nouveaux champs optionnels:
  actionType?: string              // Type d'action effectuée
  cancellationReason?: string      // Raison annulation
  cancellationRequestedAt?: Date   // Quand annulation demandée
  actualCheckoutDate?: Date        // Date réelle checkout
  earlyCheckoutReason?: string     // Raison checkout anticipé
  originalCheckOut?: Date          // Date checkout originale (avant modification)
  modificationReason?: string      // Raison modification
  modifiedAt?: Date                // Quand modifiée
  disputeReason?: string           // Raison du litige
  disputeResolution?: string       // Comment résolu
  disputeResolvedAt?: Date         // Quand résolu
  refundAmount?: number            // €
  refundPercentage?: number        // %
  refundProcessedAt?: Date         // Quand remboursement traité
  
  // 30+ autres champs existants
  // Tous restent inchangés ✅
}
```

---

## 🚀 Étapes de Migration

### 1. Backup Base de Données (CRITIQUE!)

```bash
# MongoDB local
mongodump --uri "mongodb://localhost:27017/your_db" --out ./backup_$(date +%Y%m%d)

# MongoDB Atlas
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/your_db" --out ./backup_$(date +%Y%m%d)

# Vérifier le backup
ls -la ./backup_$(date +%Y%m%d)/your_db/
```

**✅ Ne continuer QUE si backup est OK!**

---

### 2. Mettre à Jour le Code

```bash
cd backend

# 1. Tirer les dernières modifications
git pull origin main

# 2. Vérifier les fichiers modifiés
git status
# Vous devriez voir:
# - src/models/Reservation.ts ✅
# - src/services/reservation.service.ts ✅
# - src/controllers/reservation.controller.ts ✅
# - src/routes/reservation.routes.ts ✅
# - src/services/email.service.ts ✅

# 3. Installer dépendances (si nécessaire)
npm install

# 4. Compiler TypeScript
npm run build

# 5. Vérifier qu'il y a 0 erreurs
# (Si erreurs, vérifier git status et git diff)
```

---

### 3. MongoDB Schema Update

MongoDB sera mis à jour **automatiquement** par Mongoose quand:
1. Une réservation est créée avec les nouveaux champs
2. Une réservation existante est mise à jour via le code

**Aucune migration manuelle nécessaire!** ✅

**Explication:**
- Les nouveaux champs sont `optional` (pas de `required: true`)
- Mongoose créera les champs seulement si vous les assignez
- Les réservations existantes resteront inchangées jusqu'à update

---

### 4. Tester la Migration Localement

```bash
# 1. Démarrer MongoDB (si local)
mongod

# 2. Démarrer le serveur backend
npm run dev

# 3. Tester un endpoint
curl -X POST http://localhost:3000/api/reservations/test123/cancel \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Test migration"}'

# 4. Vérifier la réponse
# Devrait inclure: refund.percentage, refund.amount

# 5. Vérifier la base de données
# mongo ou MongoDB Compass
use your_db
db.reservations.findOne({ _id: ObjectId("test123") })
# Devrait montrer: actionType, refundPercentage, cancellationReason, etc.
```

**✅ Si succès, prêt pour production!**

---

## 📋 Migration Scripts (Optionnel)

### Script 1: Vérifier les Réservations Existantes

```javascript
// scripts/check-reservation-migration.js
const mongoose = require('mongoose');
const Reservation = require('../src/models/Reservation');

async function checkReservations() {
  try {
    // Statistiques
    const total = await Reservation.countDocuments();
    const withNewFields = await Reservation.countDocuments({ 
      actionType: { $exists: true } 
    });
    
    console.log(`Total reservations: ${total}`);
    console.log(`With new fields: ${withNewFields}`);
    console.log(`Without new fields: ${total - withNewFields}`);
    
    // Statuses
    const statuses = await Reservation.collection.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray();
    
    console.log('\nStatus distribution:');
    statuses.forEach(s => console.log(`  ${s._id}: ${s.count}`));
    
  } finally {
    await mongoose.connection.close();
  }
}

checkReservations();
```

**Usage:**
```bash
cd backend
node scripts/check-reservation-migration.js
```

**Output attendu:**
```
Total reservations: 1500
With new fields: 0
Without new fields: 1500

Status distribution:
  pending: 45
  confirmed: 350
  cancelled: 120
  completed: 985
```

---

### Script 2: Ajouter des Index (Optionnel)

```javascript
// scripts/add-migration-indexes.js
const mongoose = require('mongoose');
const Reservation = require('../src/models/Reservation');

async function addIndexes() {
  try {
    // Index pour recherches rapides sur actionType
    await Reservation.collection.createIndex({ actionType: 1 });
    console.log('✅ Index créé: actionType');
    
    // Index pour recherches sur statuses
    await Reservation.collection.createIndex({ status: 1, createdAt: -1 });
    console.log('✅ Index créé: status + createdAt');
    
    // Index pour recherches de disputes
    await Reservation.collection.createIndex({ 
      status: 1, 
      disputeReason: 1 
    });
    console.log('✅ Index créé: status + disputeReason');
    
  } finally {
    await mongoose.connection.close();
  }
}

addIndexes();
```

**Usage:**
```bash
cd backend
node scripts/add-migration-indexes.js
```

---

## ✅ Checklist de Migration

### Pré-Migration
- [ ] Backup complet de la base de données
- [ ] Tous les tests passent localement
- [ ] Code compilé sans erreur
- [ ] Review des changements code ✅

### Migration
- [ ] Déployer le code en production
- [ ] Vérifier que le serveur démarre sans erreur
- [ ] Tester 1 endpoint (cancel/early-checkout/modify/dispute)
- [ ] Vérifier un document en MongoDB Compass

### Post-Migration
- [ ] Monitorer les logs (0 erreurs?)
- [ ] Monitorer les emails (envoyés?)
- [ ] Tester des annulations réelles
- [ ] Vérifier les remboursements dans Payment collection
- [ ] Vérifier les métriques (taux annulation, early checkout, etc.)

---

## 🔍 Vérification en Production

### Vérifier Schema

```bash
# MongoDB Compass ou mongo CLI
use your_production_db
db.reservations.findOne({ status: 'cancelled' })

# Devrait montrer:
{
  _id: ObjectId(...),
  status: "cancelled",
  actionType: "cancellation",
  cancellationReason: "Plans changed",
  cancellationRequestedAt: ISODate(...),
  refundPercentage: 100,
  refundAmount: 500,
  ...
}
```

### Vérifier Logs

```bash
# Grep pour erreurs liées aux réservations
grep "Reservation" /var/log/app.log | grep -i error

# Devrait être vide ou montrer seulement old errors
```

### Vérifier Metrics

```bash
# Nombre d'annulations avec nouveau système
db.reservations.countDocuments({ 
  actionType: 'cancellation',
  createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
})

# Nombre de early checkouts
db.reservations.countDocuments({ 
  actionType: 'early_checkout',
  createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
})
```

---

## 🚨 Rollback (Si Problème)

### Situation: Erreur après Migration

```bash
# 1. Arrêter le serveur
pm2 stop app

# 2. Revert le code
git revert <commit_hash>

# 3. Recompiler
npm run build

# 4. Redémarrer
pm2 start app

# 5. Restaurer base de données du backup (si corruption)
mongorestore --uri "mongodb://..." --drop --dir ./backup_20240115/your_db
```

### Situations Attendues (PAS de Rollback Nécessaire)

```
❌ Error: "Cannot cancel: guest is already checked in"
→ Normal! Utiliser early-checkout au lieu de cancel

❌ Error: "Reservation not found"
→ Normal! Vérifier l'ID et l'authentication

❌ Email non reçu
→ Vérifier SMTP configuration, pas de rollback nécessaire

⚠️ Refund % incorrect
→ Vérifier la logique, pas de rollback nécessaire
```

---

## 📊 Vérification Post-Migration

### 1. Tests de Regréssion

```bash
# Vérifier que anciennes réservations fonctionnent toujours
curl -X GET http://api/reservations/old_id \
  -H "Authorization: Bearer $TOKEN"

# Devrait retourner 200 OK avec les données
```

### 2. Tests Nouveaux Endpoints

```bash
# Tester cancel
curl -X POST http://api/reservations/res1/cancel \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"reason":"test"}'
# Expected: 200 avec refund details

# Tester early-checkout
curl -X POST http://api/reservations/res2/early-checkout \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"reason":"test"}'
# Expected: 200

# Tester modify
curl -X POST http://api/reservations/res3/modify \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"checkIn":"...","checkOut":"..."}'
# Expected: 200

# Tester dispute
curl -X POST http://api/reservations/res4/dispute \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"disputeReason":"test"}'
# Expected: 200
```

### 3. Tests de Données

```javascript
// Vérifier que données existantes ne sont pas corrompues
db.reservations.find({ 
  $where: "this.createdAt < ISODate('2024-01-15')" 
}).limit(10).pretty()

// Devrait afficher:
// - Tous les champs existants intacts
// - actionType = undefined (aucune action prise)
// - Tous les nouveaux champs = undefined
```

---

## 📈 Monitoring Après Migration

### Métriques à Tracker

```
Dashboard Metrics:
- API Response Time (cancel, early-checkout, modify, dispute)
- Error Rate (ces nouveaux endpoints)
- Email Send Rate (cancellation, early_checkout, dispute)
- Refund Processing (delay, success rate)
```

### Alerts à Setup

```
- API Error Rate > 1%  → Alert
- Email Send Failure > 5% → Alert
- Response Time > 1s → Alert
- Database Errors → Alert
```

---

## 🎓 Troubleshooting Migration

### Problem: Compilation Error

```
Error: TS7053: Element implicitly has an 'any' type...
```

**Solution:**
```bash
# Vérifier les imports et types
git diff src/models/Reservation.ts

# Recompiler
npm run build
```

### Problem: Schema Mismatch

```
Error: ValidationError: ... is not defined in schema
```

**Solution:**
```bash
# Vérifier que schema.ts a tous les champs
grep "actionType\|cancellationReason" src/models/Reservation.ts

# Le schema doit avoir tous les 9 nouveaux champs
```

### Problem: Email Not Sending

```
Error: sendCancellationConfirmationEmail is not a function
```

**Solution:**
```bash
# Vérifier que email.service.ts a les 3 nouvelles méthodes
grep "sendCancellationConfirmationEmail\|sendEarlyCheckoutEmail\|sendDisputeNotificationEmail" src/services/email.service.ts

# Les 3 méthodes doivent exister
```

---

## ✅ Checklist Finale

Avant de considérer la migration comme **complète**:

- [ ] Backup réalisé et testé
- [ ] Code compilé sans erreur
- [ ] Tests locaux passent
- [ ] Déploiement réussi
- [ ] Serveur démarre sans erreur
- [ ] Au moins 1 endpoint testé en production
- [ ] MongoDB schema vérifié
- [ ] Logs monitlorés (0 erreurs)
- [ ] Metrics monitlorées
- [ ] Documentation d'équipe mise à jour
- [ ] Équipe support entraînée sur nouveaux statuses

**Status Migration:** ✅ **COMPLETE** (Quand toutes les cases sont cochées)

---

## 📞 Support Migration

**Question pendant migration?**
1. Consulter ce guide
2. Vérifier les logs: `tail -f backend/logs/app.log`
3. Vérifier MongoDB: `db.reservations.findOne()`
4. Créer issue GitHub avec logs complets

---

**Version:** 1.0
**Created:** 15 Janvier 2024
**Audience:** DevOps / Database Administrator
