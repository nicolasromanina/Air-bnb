# 📅 Composant Réservations - Guide d'Utilisation

## 🎯 Objectif

Permettre aux clients de voir, gérer et annuler leurs réservations de manière intuitive.

---

## 🗂️ Fichiers Créés/Modifiés

### Nouveaux Fichiers

#### 1. **src/pages/reservation/Reservations.tsx**
Page principale pour afficher les réservations de l'utilisateur authentifié.

**Fonctionnalités:**
- ✅ Affichage liste complète des réservations
- ✅ Filtrage par statut (Toutes, Confirmées, En attente, Annulées)
- ✅ Expansion des détails pour chaque réservation
- ✅ Annulation de réservation avec confirmation
- ✅ Affichage du récapitulatif des coûts
- ✅ Lien vers le détail de l'appartement
- ✅ Responsive design (mobile/desktop)

**Props:**
Aucun (utilise les hooks useAuth et useReservations)

#### 2. **src/components/UserMenu.tsx**
Composant dropdown avec menu utilisateur.

**Fonctionnalités:**
- ✅ Affichage avatar utilisateur avec initiales
- ✅ Menu déroulant avec liens
- ✅ Accès aux réservations
- ✅ Dashboard admin (si rôle admin)
- ✅ Profil utilisateur
- ✅ Déconnexion
- ✅ Fermeture au clic externe

---

### Fichiers Modifiés

#### 1. **src/App.tsx**
- ✅ Import du composant Reservations
- ✅ Ajout de la route: `/reservations`

```typescript
import Reservations from "./pages/reservation/Reservations";
// ...
<Route path="/reservations" element={<Reservations />} />
```

#### 2. **src/components/Navbar.tsx**
- ✅ Import de useAuth et UserMenu
- ✅ Affichage conditionnel:
  - Si authentifié → UserMenu
  - Si non authentifié → Bouton "Réserver maintenant"
- ✅ Support mobile et desktop
- ✅ Lien "Mes réservations" dans menu mobile

---

## 🌐 Routes

| Route | Accès | Description |
|-------|-------|-------------|
| `/reservations` | Authentifié | Page des réservations |
| `/auth?returnUrl=/reservations` | Non authentifié | Redirection auth |

---

## 🎨 Interface Utilisateur

### Page des Réservations

#### En-tête
```
MES RÉSERVATIONS
Bienvenue [Prénom] ! Gérez vos réservations ici.
```

#### Filtres
- **Toutes** - Toutes les réservations
- **Confirmées** - Statut = confirmed
- **En attente** - Statut = pending
- **Annulées** - Statut = cancelled

#### Carte Réservation (Réduite)
```
┌─────────────────────────────────────────┐
│ 🏠 [Image] [Titre Logement]             │
│     📍 Appartement [Numéro]             │
│                                         │
│ CHECK-IN          CHECK-OUT      DURÉE  │
│ 15 mars 2024      17 mars 2024   2 nuits│
│                                         │
│ ✅ Confirmée                    ▼       │
└─────────────────────────────────────────┘
```

#### Carte Réservation (Expandue)
```
┌─────────────────────────────────────────┐
│ [Réservation réduite]                   │
├─────────────────────────────────────────┤
│ 👥 2 personnes   💶 100€/nuit  📅...    │
│                                         │
│ Récapitulatif                           │
│ ├─ Logement (2 nuits): 200€             │
│ ├─ Options: 50€                         │
│ └─ Total: 250€                          │
│                                         │
│ [Voir le logement] [Annuler]            │
│                                         │
│ ┌─────────────────────────────┐         │
│ │ Êtes-vous sûr?              │         │
│ │ [Oui, annuler] [Non, garder]│         │
│ └─────────────────────────────┘         │
└─────────────────────────────────────────┘
```

### UserMenu (Navbar)

```
┌─────────────────────────────┐
│ [👤 JD] Jean Dupont    [≡]  │ ← Cliquez pour ouvrir
└─────────────────────────────┘

Menu Déroulant:
┌──────────────────────────────┐
│ Jean Dupont                  │
│ jean@example.com             │
├──────────────────────────────┤
│ 📅 Mes réservations          │
│ ⚙️ Tableau de bord admin     │
│ 👤 Mon profil                │
├──────────────────────────────┤
│ 🚪 Déconnexion               │
└──────────────────────────────┘
```

---

## 🔄 Flux de Données

```
User visite /reservations
    ↓
useAuth → vérifie si authentifié
    │
    ├─ Si non authentifié → Affiche formulaire login
    │
    └─ Si authentifié → useReservations.getUserReservations()
        ↓
        API: GET /api/reservations/my-reservations
        ↓
        Récupère: [reservation1, reservation2, ...]
        ↓
        Affiche les réservations avec filtres
```

---

## 💻 Code d'Utilisation

### Importer le composant
```tsx
import Reservations from "@/pages/reservation/Reservations";
```

### Utiliser avec React Router
```tsx
// Déjà configuré dans App.tsx
<Route path="/reservations" element={<Reservations />} />
```

### Accéder depuis le code
```tsx
// Bouton pour aller aux réservations
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/reservations");
```

---

## 📊 Structure des Données

### Réservation
```typescript
interface Reservation {
  _id: string;
  apartmentId: number;
  title?: string;                    // "Charmant studio"
  image?: string;                    // URL image
  checkIn: string;                   // ISO 8601
  checkOut: string;                  // ISO 8601
  nights?: number;                   // 2
  guests?: number;                   // 2
  totalPrice?: number;               // 250
  basePrice?: number;                // 100
  status?: string;                   // "confirmed", "pending", "cancelled"
  createdAt?: string;                // ISO 8601
}
```

---

## 🎯 Fonctionnalités Détaillées

### 1. Affichage des Réservations

**Non authentifié:**
- Message "Authentification requise"
- Bouton "Se connecter" avec redirection

**Authentifié - Aucune réservation:**
- Message "Vous n'avez pas encore de réservation"
- Bouton "Découvrir les appartements"

**Authentifié - Avec réservations:**
- Liste des réservations
- Filtrage disponible

### 2. Filtrage

```typescript
filterStatus: "all" | "confirmed" | "pending" | "cancelled"

onFilter = (newStatus) => {
  setFilterStatus(newStatus);
  // API est appelée avec le nouveau filtre
}
```

### 3. Expansion/Réduction

```typescript
expandedId: string | null = null

onClick = (reservationId) => {
  setExpandedId(
    expandedId === reservationId ? null : reservationId
  );
}
```

Affiche les détails complètes:
- Nombre de personnes
- Prix par nuit
- Date de réservation
- Récapitulatif coûts
- Boutons d'action

### 4. Annulation

```typescript
handleDeleteReservation = async (id: string) => {
  const response = await deleteReservation(id);
  // Supprimer de l'état local
  setReservations(reservations.filter(r => r._id !== id));
}
```

Avec confirmation:
```
Êtes-vous sûr de vouloir annuler cette réservation?
[Oui, annuler] [Non, garder]
```

---

## 🎨 Styles et Couleurs

### Badges de Statut

| Statut | Badge | Couleur |
|--------|-------|---------|
| confirmed | ✅ Confirmée | Vert (#22c55e) |
| pending | ⏳ En attente | Jaune (#eab308) |
| cancelled | ❌ Annulée | Rouge (#ef4444) |
| default | En cours | Bleu (#3b82f6) |

### Couleurs de Border Gauche
- Confirmée: Border-left `green-500`
- En attente: Border-left `yellow-500`
- Annulée: Border-left `red-500`

### Background Colors
- Confirmée: `bg-green-50`
- En attente: `bg-yellow-50`
- Annulée: `bg-red-50`
- Default: `bg-blue-50`

---

## 📱 Responsive Design

### Mobile
- Stack vertical
- Images 20x20px
- Grid 2 colonnes pour infos
- Menu sandwich pour navbar

### Tablette
- Grid 3-4 colonnes pour infos
- Images 20x20px
- Menu horizontal

### Desktop
- Grid 4 colonnes pour infos
- Images 20x20px
- Full-width layout

---

## 🔐 Sécurité

- ✅ Authentification requise
- ✅ Les users ne voient que leurs réservations
- ✅ Vérification backend des droits
- ✅ Token JWT en localStorage
- ✅ Pas de données sensibles en props

---

## 🧪 Tests

### Tester sans réservation
```
1. Créer un compte
2. Ne pas faire de réservation
3. Aller sur /reservations
4. Doit afficher "Aucune réservation"
```

### Tester avec réservation
```
1. Faire une réservation complète
2. Aller sur /reservations
3. Vérifier l'affichage correct
4. Tester l'expansion
5. Tester l'annulation
```

### Tester les filtres
```
1. Avoir 2+ réservations avec statuts différents
2. Cliquer sur chaque filtre
3. Vérifier que la liste se met à jour
```

### Tester le responsive
```
1. Desktop (1920x1080)
2. Tablette (768x1024)
3. Mobile (375x667)
```

---

## 🚀 Performance

- ✅ Chargement unique au montage
- ✅ Filtrage côté client (pas d'appel API)
- ✅ Images lazy-loading
- ✅ Animations smooth (CSS transitions)
- ✅ Pas de re-renders inutiles

---

## 📚 APIs Utilisées

### useAuth
```typescript
const { isAuthenticated, user, signOut } = useAuth();
```

### useReservations
```typescript
const { 
  getUserReservations,
  deleteReservation 
} = useReservations();
```

### API Service
```typescript
api.getUserReservations(page, limit, status)
api.deleteReservation(id)
```

---

## 🔗 Liens Utiles

| Ressource | URL |
|-----------|-----|
| Page Réservations | `/reservations` |
| Détail Logement | `/appartments/{id}` |
| Profil | `/profile` |
| Dashboard Admin | `/admin` |
| Authentification | `/auth` |

---

## 🐛 Dépannage

### "Authentification requise"
- Utilisateur non connecté
- Solution: Cliquer sur "Se connecter"

### "Aucune réservation"
- Utilisateur authentifié mais pas de réservations
- Solution: Faire une réservation via `/appartments`

### Liste vide après filtre
- Aucune réservation avec ce statut
- Solution: Changer de filtre

### Erreur lors de l'annulation
- Problème de connexion
- Solution: Actualiser la page

---

## 📝 Exemple d'Utilisation

```tsx
// Pour accéder depuis un composant
import { useNavigate } from "react-router-dom";

const MonComposant = () => {
  const navigate = useNavigate();
  
  const handleViewReservations = () => {
    navigate("/reservations");
  };
  
  return (
    <button onClick={handleViewReservations}>
      Voir mes réservations
    </button>
  );
};
```

---

**Composant prêt à l'emploi!** ✅

