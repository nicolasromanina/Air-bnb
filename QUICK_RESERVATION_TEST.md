# ⚡ Test Rapide - Composant Réservations

## 🚀 Démarrage Rapide

### 1. Vérifier que tout compile
```bash
npm run dev
# Doit démarrer sans erreur
```

### 2. Accéder à la page
```
http://localhost:5173/reservations
```

---

## ✅ Checklist de Tests

### État Non Authentifié
- [ ] Affiche "Authentification requise"
- [ ] Bouton "Se connecter" visible
- [ ] Redirection vers `/auth?returnUrl=/reservations`

### État Authentifié - Sans Réservations
- [ ] Affiche "Aucune réservation"
- [ ] Bouton "Découvrir les appartements" visible
- [ ] Filtres visibles mais désactivés

### État Authentifié - Avec Réservations
- [ ] Liste des réservations affichée
- [ ] Chaque réservation affiche:
  - ✓ Image logement
  - ✓ Titre logement
  - ✓ Numéro appartement
  - ✓ Dates (check-in, check-out)
  - ✓ Durée (nuits)
  - ✓ Montant
  - ✓ Badge statut

### Filtres
- [ ] Bouton "Toutes" sélectionné par défaut
- [ ] Clic sur chaque filtre fonctionne
- [ ] Liste se met à jour (sans recharger)
- [ ] Couleur du bouton actif change

### Expansion/Réduction
- [ ] Clic sur réservation → expansion
- [ ] Chevron tourne 180°
- [ ] Détails affichés:
  - ✓ Nombre de personnes
  - ✓ Prix/nuit
  - ✓ Date de réservation
  - ✓ Récapitulatif des coûts
- [ ] Clic à nouveau → réduction
- [ ] Chevron retour à 0°

### Calcul des Coûts
```
Logement (2 nuits) = basePrice × 2 = 200€
Options = totalPrice - (basePrice × 2) = 50€
Total = 250€
```
- [ ] Tous les calculs corrects

### Boutons d'Action
- [ ] "Voir le logement" → navigation `/appartments/{id}`
- [ ] "Annuler" visible si status != "cancelled"
- [ ] "Annuler" click → confirmation dialog

### Confirmation Annulation
- [ ] Dialog affiche "Êtes-vous sûr?"
- [ ] Bouton "Oui, annuler" → supprime la réservation
- [ ] Bouton "Non, garder" → ferme le dialog
- [ ] Réservation disparaît de la liste

### Menu Utilisateur (Navbar)
- [ ] Avatar visible (initiales)
- [ ] Clic avatar → menu déroulant
- [ ] Menu affiche:
  - ✓ Nom et email
  - ✓ "Mes réservations"
  - ✓ "Mon profil"
  - ✓ "Déconnexion" (si admin: "Dashboard admin")
- [ ] Clic "Mes réservations" → navigation `/reservations`
- [ ] Clic "Déconnexion" → logout + redirection `/`
- [ ] Clic extérieur → ferme menu

### Responsive Design
#### Mobile (375x667)
- [ ] Filtres en wrapper
- [ ] Images 20x20px
- [ ] Grid 2 colonnes
- [ ] Texte lisible
- [ ] Pas de dépassement

#### Tablette (768x1024)
- [ ] Filtres en ligne
- [ ] Images correctes
- [ ] Grid 3-4 colonnes
- [ ] Texte lisible

#### Desktop (1920x1080)
- [ ] Tous les éléments visibles
- [ ] Layout optimal
- [ ] Espacement correct

---

## 🧪 Tests Manuels

### Scénario 1: Nouveau Client
```
1. Créer un compte
2. Aller sur /reservations
3. Doit afficher "Aucune réservation"
4. Cliquer "Découvrir les appartements"
5. Doit aller sur /appartment
```

### Scénario 2: Faire une Réservation
```
1. Être authentifié
2. Aller sur /appartments
3. Sélectionner un appartement
4. Faire une réservation complète
5. Aller sur /reservations
6. Doit afficher la réservation
```

### Scénario 3: Filtrer Réservations
```
1. Avoir 2+ réservations avec statuts différents
2. Cliquer "Confirmées"
3. Doit afficher uniquement les confirmées
4. Cliquer "En attente"
5. Doit afficher uniquement les en attente
6. Cliquer "Toutes"
7. Doit afficher toutes
```

### Scénario 4: Voir Détails
```
1. Voir réservation en mode réduit
2. Cliquer sur la réservation
3. Chevron tourne
4. Détails apparaissent
5. Montants calculés correctement
6. Cliquer à nouveau
7. Détails disparaissent
```

### Scénario 5: Annuler Réservation
```
1. Voir réservation expandue
2. Cliquer "Annuler"
3. Dialog de confirmation apparaît
4. Cliquer "Oui, annuler"
5. Réservation disparaît
6. Toast "Réservation annulée"
```

### Scénario 6: Menu Utilisateur
```
1. Être authentifié
2. Cliquer avatar dans navbar
3. Menu déroulant apparaît
4. Voir options correctes
5. Cliquer "Mes réservations"
6. Navigation vers /reservations
7. Menu ferme
8. Cliquer "Déconnexion"
9. Logout + redirection /
```

---

## 🔍 Vérifications Console (F12)

```javascript
// Vérifier les logs
console.log('Utilisateur:', user);
console.log('Authentifié:', isAuthenticated);
console.log('Réservations:', reservations);
console.log('Filtre:', filterStatus);
console.log('Expandée:', expandedId);

// Vérifier les appels API
// Chercher dans Network > XHR:
// GET /api/reservations/my-reservations?page=1&limit=50
// DELETE /api/reservations/{id}
```

---

## 🎨 Vérifications Visuelles

### Couleurs des Badges
```
✅ Confirmée    → Vert (#22c55e)
⏳ En attente   → Jaune (#eab308)
❌ Annulée     → Rouge (#ef4444)
```

### Couleurs des Borders
```
Confirmée      → Border-left vert
En attente     → Border-left jaune
Annulée        → Border-left rouge
```

### Icônes (Lucide)
```
Calendar        → Réservations vides
MapPin          → Localisation
Users           → Nombre personnes
Loader2         → Chargement
AlertCircle     → Erreur
Clock           → Statut pending
CheckCircle     → Statut confirmed
XCircle         → Statut cancelled
Trash2          → Bouton annuler
Eye             → Voir logement
ChevronDown     → Expansion
```

---

## 🐛 Débogage Courant

### Problème: "Vous devez être connecté"
**Cause:** Token expiré ou absent
**Solution:** 
```bash
# Vérifier localStorage
localStorage.getItem('auth_token')

# Vérifier dans DevTools > Application > Storage
```

### Problème: Liste vide mais réservations existent
**Cause:** Filtre actif
**Solution:** Cliquer sur "Toutes"

### Problème: Images ne s'affichent pas
**Cause:** URL d'image invalide
**Solution:** Vérifier dans React DevTools que `reservation.image` est correct

### Problème: Montants incorrects
**Cause:** Problème de calcul
**Vérifier:**
```javascript
basePrice * nights + (totalPrice - basePrice * nights) = totalPrice
```

### Problème: Annulation ne fonctionne pas
**Cause:** Erreur API
**Vérifier:**
```bash
# Terminal backend
# Logs: DELETE /api/reservations/{id}
# Doit retourner 200 OK
```

---

## 📊 Données de Test

### Créer une Réservation Test
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  apartmentId: 1,
  title: "Charmant studio",
  image: "https://...",
  checkIn: "2024-03-15T00:00:00Z",
  checkOut: "2024-03-17T00:00:00Z",
  nights: 2,
  guests: 2,
  basePrice: 100,
  totalPrice: 250,
  status: "confirmed",
  createdAt: "2024-01-26T10:00:00Z"
}
```

---

## ✅ Validation Finale

| Aspect | ✅ OK | ⚠️ A Vérifier |
|--------|-------|--------------|
| Authentification | | |
| Affichage liste | | |
| Filtres | | |
| Expansion | | |
| Annulation | | |
| Menu utilisateur | | |
| Responsive | | |
| Performance | | |
| Sécurité | | |

---

**Tous les tests passent?** → Composant prêt pour production! 🚀

