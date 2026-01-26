# ⚡ Composant Réservations - Quick Start

## 🚀 Démarrage Rapide (5 minutes)

### 1. Les Fichiers Créés/Modifiés

#### Créés ✨
```
src/pages/reservation/Reservations.tsx  ← Page des réservations
src/components/UserMenu.tsx              ← Menu utilisateur
```

#### Modifiés 📝
```
src/App.tsx                              ← Route /reservations ajoutée
src/components/Navbar.tsx                ← UserMenu intégré
```

---

## 💡 Comment Ça Marche

### Flux Simple
```
Utilisateur connecté
    ↓
Voir UserMenu (avatar) en haut
    ↓
Cliquer "Mes réservations"
    ↓
Affichage page /reservations
    ↓
Liste réservations avec filtres
    ↓
Expand/Collapse pour détails
    ↓
Annuler si besoin
```

---

## 🎯 Accès Principal

### Pour l'Utilisateur

#### 1. Via Navbar (Desktop)
```
Cliquer sur avatar [👤 JD]
    ↓
Menu déroulant s'ouvre
    ↓
Cliquer "📅 Mes réservations"
    ↓
→ /reservations
```

#### 2. Via Navbar (Mobile)
```
Cliquer burger menu [≡]
    ↓
Menu latéral s'ouvre
    ↓
Cliquer "Mes réservations"
    ↓
Menu ferme
    ↓
→ /reservations
```

#### 3. URL Direct
```
Entrer dans navigateur: /reservations
```

---

## 🎨 Interface En 30 Secondes

### Page Réservations
```
┌────────────────────────────────────┐
│ MES RÉSERVATIONS                   │
│ Bienvenue Jean !                   │
├────────────────────────────────────┤
│ [Toutes] [Confirmées] [Attente]    │ ← Cliquer pour filtrer
│ [Annulées]                         │
├────────────────────────────────────┤
│ ┌──────────────────────────────┐   │
│ │ Charmant Studio  15→17 mar   │   │
│ │ Apt 101  2 nuits  250€       │   │
│ │              ✅ Confirmée  ▼  │   │ ← Cliquer pour étendre
│ └──────────────────────────────┘   │
│                                    │
│ ... autres réservations            │
└────────────────────────────────────┘
```

### Details Étendus
```
┌──────────────────────────────────────┐
│ [Titre réservation]                  │
├──────────────────────────────────────┤
│ 👥 2 personnes  💶 100€/nuit  📅...  │
│                                      │
│ Récapitulatif:                       │
│ • Logement (2 nuits): 200€          │
│ • Options: 50€                       │
│ • TOTAL: 250€                        │
│                                      │
│ [👁️ Voir logement] [🗑️ Annuler]   │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ Êtes-vous sûr? [Oui] [Non]      │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

---

## 🔧 Vérification Installation

### 1. Routes Configurées
```tsx
// Ouvrir: src/App.tsx
// Vérifier présence de:
import Reservations from "./pages/reservation/Reservations";

<Route path="/reservations" element={<Reservations />} />
```

### 2. UserMenu Intégré
```tsx
// Ouvrir: src/components/Navbar.tsx
// Vérifier présence de:
import UserMenu from "./UserMenu";
import { useAuth } from "@/hooks/useAuth";

// Dans le retour du composant:
{isAuthenticated ? <UserMenu /> : <button>...</button>}
```

### 3. Fichiers Créés
```
src/pages/reservation/Reservations.tsx  ✅
src/components/UserMenu.tsx              ✅
```

---

## 🧪 Test Rapide

### Étape 1: Lancer les serveurs
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Étape 2: Tests Sans Connexion
```
1. Ouvrir http://localhost:5173/reservations
2. Doit afficher "Authentification requise"
3. Cliquer "Se connecter"
4. Redirection vers /auth
```

### Étape 3: Tests Avec Connexion
```
1. Se connecter/s'inscrire
2. Ouvrir http://localhost:5173/reservations
3. Voir message "Aucune réservation" (si aucune)
4. Cliquer UserMenu (avatar)
5. Vérifier "Mes réservations" dans menu
```

### Étape 4: Tests Avec Réservations
```
1. Faire une réservation
2. Aller sur /reservations
3. Voir la réservation dans liste
4. Cliquer pour étendre
5. Voir détails
6. Tester filtres
7. Tester annulation
```

---

## 📊 Données Affichées

### Par Défaut (Réservation Réduite)
```
✅ Image de l'appartement
✅ Titre du logement
✅ Numéro appartement
✅ Date check-in
✅ Date check-out
✅ Nombre de nuits
✅ Prix total
✅ Badge statut (couleur)
```

### En Détail (Après Expansion)
```
✅ Nombre de personnes
✅ Prix par nuit
✅ Date de création réservation
✅ Récapitulatif détaillé des coûts
✅ Bouton "Voir le logement"
✅ Bouton "Annuler" (si pas annulée)
```

---

## 🎨 États Possibles

### Liste Vide
```
Aucune réservation
Vous n'avez pas encore de réservation.

[Découvrir les appartements]
```

### Erreur
```
Erreur lors du chargement des réservations
```

### Chargement
```
⏳ Chargement des réservations...
```

### Avec Données
```
Liste complète avec filtres et expansion
```

---

## 🔐 Sécurité

### Ce Qui Est Vérifié
- ✅ Utilisateur authentifié
- ✅ Token JWT valide
- ✅ Données appartiennent à l'user
- ✅ Confirmation avant suppression

### Ce Qui N'Est PAS Stocké Localement
- ❌ Mot de passe
- ❌ Données sensibles
- ❌ Métadonnées privées

---

## 🎯 Cas d'Usage

### Cas 1: Voir mes réservations
```
1. Se connecter
2. Cliquer UserMenu
3. Cliquer "Mes réservations"
4. Voir liste
```

### Cas 2: Voir détails d'une réservation
```
1. Aller sur /reservations
2. Cliquer sur une réservation
3. Elle s'étend
4. Voir tous les détails
```

### Cas 3: Filtrer par statut
```
1. Aller sur /reservations
2. Cliquer "Confirmées"
3. Liste filtrée affiche que les confirmées
```

### Cas 4: Annuler une réservation
```
1. Aller sur /reservations
2. Étendre la réservation
3. Cliquer "Annuler"
4. Confirmation s'affiche
5. Cliquer "Oui, annuler"
6. Réservation supprimée
```

### Cas 5: Voir le logement
```
1. Aller sur /reservations
2. Étendre la réservation
3. Cliquer "Voir le logement"
4. Navigue vers page détail
```

---

## 🚀 URLs Utiles

| Action | URL |
|--------|-----|
| Mes réservations | `/reservations` |
| Authentification | `/auth` |
| Appartements | `/appartments` |
| Détail logement | `/appartments/[id]` |
| Accueil | `/` |

---

## 💻 Code d'Utilisation

### Naviguer Vers Réservations
```tsx
import { useNavigate } from "react-router-dom";

const MyComponent = () => {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate("/reservations")}>
      Voir mes réservations
    </button>
  );
};
```

### Vérifier Authentification
```tsx
import { useAuth } from "@/hooks/useAuth";

const MyComponent = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Connectez-vous d'abord</p>;
  }
  
  return <p>Bienvenue {user.firstName}</p>;
};
```

### Charger Réservations
```tsx
import { useReservations } from "@/hooks/useReservations";

const MyComponent = () => {
  const { getUserReservations } = useReservations();
  
  const handleLoad = async () => {
    const data = await getUserReservations(1, 10);
    console.log(data);
  };
  
  return <button onClick={handleLoad}>Charger</button>;
};
```

---

## 🐛 Dépannage Rapide

### "Authentification requise"
**Cause:** Utilisateur non connecté
**Solution:** Cliquer "Se connecter"

### "Aucune réservation"
**Cause:** Pas de réservation encore
**Solution:** Faire une réservation via `/appartments`

### UserMenu n'apparaît pas
**Cause:** Non authentifié
**Solution:** Se connecter d'abord

### Erreur au charger
**Cause:** Problème API
**Solution:** Vérifier backend est lancé

### Suppression ne marche pas
**Cause:** Réseau ou serveur
**Solution:** Actualiser page et réessayer

---

## 📋 Checklist Rapide

- [ ] Les 2 fichiers créés existent
- [ ] App.tsx a la route /reservations
- [ ] Navbar.tsx a UserMenu intégré
- [ ] Pas d'erreurs dans console
- [ ] Se connecte sans erreur
- [ ] UserMenu apparaît
- [ ] Peut accéder /reservations
- [ ] Liste s'affiche ou vide
- [ ] Filtres fonctionnent
- [ ] Expansion fonctionne
- [ ] Détails affichés
- [ ] Annulation possible
- [ ] Responsive sur mobile

---

## 🎁 Bonus: Points Clés

✨ **Responsive**: Mobile/Tablet/Desktop optimisés
✨ **Intuitif**: Interface claire et logique
✨ **Performant**: Chargement unique
✨ **Sécurisé**: Auth requise
✨ **Flexible**: Filtres, expansion, détails
✨ **Professionnel**: Design cohérent

---

## 🔗 Documentations Complètes

Pour plus de détails:
- `RESERVATIONS_COMPONENT.md` - Guide complet
- `RESERVATIONS_IMPLEMENTATION.md` - Résumé technique
- `RESERVATIONS_INDEX.md` - Index détaillé

---

**Prêt à utiliser!** ✅

