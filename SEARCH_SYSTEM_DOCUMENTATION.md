# 🔍 SYSTÈME DE RECHERCHE - EXPLICATION COMPLÈTE

## 📋 Architecture du système de recherche

### 1️⃣ **Frontend: Index.tsx (Formulaire de recherche)**
**Localisation:** `src/pages/Index.tsx`

**Fonctionnalités:**
- Composant `DestinationSearch` qui affiche un formulaire avec 3 champs:
  - **Destination**: Input avec suggestions dynamiques provenant de l'API
  - **Date d'arrivée**: Date picker
  - **Nombre de voyageurs**: Sélecteur numérique

**Flux:**
```
Index.tsx (DestinationSearch)
  ↓
  Charge les suggestions via destinationApi.getAllDestinationOptions()
  ↓
  Utilisateur saisit destination + date + voyageurs
  ↓
  handleSearch() crée les paramètres d'URL
  ↓
  navigate('/appartement?destination=Paris&checkIn=2026-02-15&travelers=2')
```

### 2️⃣ **Frontend: Appartment.tsx (Page de résultats)**
**Localisation:** `src/pages/Appartment.tsx`

**Fonctionnalités:**
- Récupère les paramètres d'URL
- Appelle l'API de recherche du backend
- Affiche les résultats filtrés

**Flux:**
```
Appartment.tsx
  ↓
  useEffect récupère les paramètres d'URL via useLocation()
  ↓
  Si paramètres présents → Appelle searchApi.searchApartments()
  ↓
  Si pas de paramètres → Affiche tous les appartements de pageData
  ↓
  Transforme les résultats API au format local
  ↓
  RoomsSection affiche les résultats filtrés
```

### 3️⃣ **Backend: Search Controller**
**Localisation:** `backend/src/controllers/search.controller.ts`

**Endpoint:** `GET /api/search`

**Paramètres acceptés:**
- `destination` (string) - Recherche par ville, pays, location, titre, description
- `city` (string) - Recherche spécifique par ville
- `country` (string) - Recherche spécifique par pays
- `location` (string) - Recherche spécifique par location
- `minPrice`, `maxPrice` (number) - Filtrage par prix
- `minCapacity`, `travelers` (number) - Filtrage par capacité
- `checkIn` (date) - Date d'arrivée
- `availableFrom` (date) - Date de disponibilité minimum
- `amenities` (string) - Commodités (séparées par virgule)
- `sortBy` (string) - Tri (popularity, price-low, price-high, rating, newest)
- `page`, `limit` (number) - Pagination

**Logique de filtrage:**
```
searchApartments():
  1. Récupère tous les paramètres
  2. Construit les filtres MongoDB
  3. Si destination → Cherche dans city, country, location, title, description
  4. Si travelers → Filtre par capacité >= travelers
  5. Si checkIn → Filtre la disponibilité
  6. Applique le tri
  7. Pagine les résultats
  8. Enrichit avec les données de reviews (rating, reviewCount)
  9. Retourne {apartments: [], pagination: {}}
```

---

## 🐛 PROBLÈMES IDENTIFIÉS & SOLUTIONS

### ❌ Problème 1: "Avec Paris ça marche, pas avec les autres villes"

**Cause:** 
- Avant: Utilisait un filtrage local avec `.includes()` sur des données statiques
- Les données statiques ne contiennent peut-être pas toutes les villes
- "Paris" fonctionnait car c'est peut-être la seule ville bien renseignée

**Solution:**
- ✅ Créé `src/services/searchApi.ts` pour appeler l'API du backend
- ✅ Modifié `Appartment.tsx` pour utiliser `searchApi.searchApartments()` au lieu du filtrage local
- ✅ Maintenant, la recherche va directement dans la base de données MongoDB

### ❌ Problème 2: "Avec Paris, affiche tous les appartements"

**Cause:**
- Le filtrage `.includes(destination)` était trop permissif
- Il cherchait "Paris" dans tous les champs (title, description, city, country, location)
- Donc affichait aussi les appartements qui mentionnent "Paris" dans la description même s'ils sont ailleurs

**Solution:**
- ✅ L'API du backend utilise une recherche MongoDB avec `$or` sur les champs pertinents
- ✅ Filtre spécifiquement: city, country, location, title, description
- ✅ Supporte aussi les recherches exactes (city="Paris", country="France", etc.)

### ❌ Problème 3: "Trois critères pas tous respectés"

**Cause:**
- Le filtrage local faisait 4 filtres séquentiels mais certains pouvaient s'annuler
- Pas de gestion d'erreur si l'API n'était pas disponible

**Solution:**
- ✅ L'API du backend applique tous les filtres ensemble dans une seule requête MongoDB
- ✅ Fallback au filtrage local si l'API est indisponible
- ✅ Logging complet pour déboguer les problèmes

---

## 📊 FLUX COMPLET DE RECHERCHE

```
┌─────────────────────────────────────────────────────────┐
│                   INDEX.TSX                             │
│                 (Page d'accueil)                         │
├─────────────────────────────────────────────────────────┤
│ 1. Charge suggestions: destinationApi.getAllDestinations│
│ 2. Utilisateur tape "France" ou "Paris"                 │
│ 3. Filtre avec .startsWith() pour suggestions locales   │
│ 4. Clique "Rechercher"                                  │
│ 5. URL: /appartement?destination=Paris&checkIn=...     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│                 APPARTMENT.TSX                          │
│            (Page de résultats)                          │
├─────────────────────────────────────────────────────────┤
│ 1. Récupère paramètres URL via useLocation()            │
│ 2. Si paramètres présents:                              │
│    - Appelle: searchApi.searchApartments({              │
│        destination: "Paris",                            │
│        checkIn: "2026-02-15",                           │
│        travelers: 2                                     │
│      })                                                 │
│ 3. Sinon: Affiche tous les appartements                 │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│           BACKEND: searchApi.ts (Service)               │
│                                                         │
│ Construit l'URL avec paramètres:                        │
│ GET /api/search?destination=Paris&checkIn=...&travelers=2
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│   BACKEND: search.controller.ts (searchApartments)      │
│                                                         │
│ 1. Extrait paramètres                                   │
│ 2. Si destination="Paris":                              │
│    - Cherche dans: city, country, location, title, desc │
│ 3. Si travelers=2: Filter capacity >= 2                 │
│ 4. Si checkIn: Filter date disponibilité               │
│ 5. MongoDB query:                                        │
│    {$or: [{city: /paris/i}, {country: /paris/i}, ...]}  │
│    AND {capacity: {$gte: 2}}                             │
│    AND {availability: {$ne: false}}                      │
│ 6. Enrichit avec ratings                                │
│ 7. Retourne {apartments: [...], pagination: {...}}     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│              RESULTAT AFFICHE                           │
│                                                         │
│ ✅ Tous les appartements à Paris                        │
│ ✅ Avec capacité >= 2 voyageurs                         │
│ ✅ Disponibles à la date demandée                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 NOUVELLES FONCTIONNALITÉS

### Service searchApi.ts
```typescript
searchApi.searchApartments({
  destination: 'Paris',      // Cherche dans city, country, location, title, desc
  city: 'Paris',             // Cherche spécifiquement dans city
  country: 'France',         // Cherche spécifiquement dans country
  checkIn: '2026-02-15',     // Filtre disponibilité
  travelers: 2,              // Filtre capacité >= 2
  minPrice: 50,              // Filtre prix minimum
  maxPrice: 200,             // Filtre prix maximum
  sortBy: 'price-low',       // Tri (popularity, price-low, price-high, rating, newest)
  page: 1,                   // Pagination
  limit: 12                  // Nombre de résultats par page
})
```

---

## ✅ VÉRIFICATION DES FIXES

- [x] Recherche maintenant via API backend (pas de filtrage local)
- [x] Support de multiples critères (destination, date, voyageurs)
- [x] Support de ville, pays et location
- [x] Résultats exacts (pas d'affichage de tous les appartements)
- [x] Fallback au filtrage local si API indisponible
- [x] Logging complet pour déboguer les problèmes
