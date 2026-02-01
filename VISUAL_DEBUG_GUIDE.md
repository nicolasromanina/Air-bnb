# 🚀 Logs de Recherche - Guide Visual

## 📊 Flux Complet de Recherche

```
UTILISATEUR
    ↓
[Clique sur "Chercher"]
    ↓
URL change: ?destination=Lyon&checkIn=2026-02-12&travelers=3
    ↓
useEffect détecte le changement d'URL
    ↓
🔍 Paramètres de recherche reçus: {destination: 'Lyon', checkIn: '2026-02-12', travelers: '3'}
    ↓
useEffect du filtrage s'active
    ↓
if (!searchParams) → Afficher tous les appartements ✅
    ↓
if (searchParams) → Appeler l'API de recherche 🌐
    ↓
🔍 RECHERCHE API - Paramètres: {...}
    ↓
console.log les paramètres individuels:
  - 📍 Destination: Lyon
  - 📅 CheckIn: 2026-02-12
  - 👥 Voyageurs: 3
    ↓
📡 Requête HTTP GET vers le backend
    ↓
API Backend traite la requête
    ↓
📡 Requête GET: https://airbnb-backend-l640.onrender.com/api/search/?...
   Status: 200 OK ✅ ou 500 Error ❌
    ↓
✅ Réponse API reçue: {apartments: [...], pagination: {...}}
    ↓
📊 RÉSULTAT API: X appartement(s) trouvé(s)
    ↓
SI X > 0:
    ├─ 🏠 Détails des résultats: Array(X)
    ├─ ✅ Appartements transformés: [...]
    └─ Afficher les résultats à l'écran ✅
    ↓
SI X = 0:
    ├─ ⚠️ Fallback au filtrage local
    ├─ Utiliser les données en cache
    └─ Afficher "Aucun résultat" 😞
    ↓
UTILISATEUR voit les résultats
```

---

## 🔴 Cas 1: Aucun Résultat Trouvé

```
🔍 Paramètres de recherche reçus: {destination: 'Lyon', ...}
    ↓
🔍 RECHERCHE API - Paramètres: {destination: 'Lyon', ...}
📍 Destination: Lyon
📅 CheckIn: 2026-02-12
👥 Voyageurs: 3
    ↓
🌐 APPEL API RECHERCHE
  📍 URL complète: ...?destination=Lyon&checkIn=2026-02-12&travelers=3...
  🔍 Filtres appliqués: {...}
  📋 Query string: destination=Lyon&checkIn=2026-02-12&travelers=3...
    ↓
📡 Requête GET: https://airbnb-backend-l640.onrender.com/api/search/?...
   Status: 200 OK ✅
    ↓
✅ Réponse API reçue: {apartments: Array(0), pagination: {...}}
  📦 Nombre d'appartements retournés: 0 🚨
  📄 Pagination: {page: 1, limit: 100, total: 0, pages: 0}
    ↓
📊 RÉSULTAT API: 0 appartement(s) trouvé(s) 🚨
🏠 Détails des résultats: []
    ↓
⚠️ Fallback au filtrage local
📦 Rooms disponibles localement: 12
  🔎 Filtrage par destination: "Lyon"
  ✅ Résultats après filtrage destination: 0 appartements
  🔎 Filtrage par nombre de voyageurs: 3
  ✅ Résultats après filtrage voyageurs: 0 appartements
🎯 Résultat final du fallback local: []
    ↓
ÉCRAN: "Aucun logement correspondant" 😞
```

**Diagnostic:** 
- ✅ API fonctionne (status 200)
- ❌ Aucun appartement ne match les critères
- → Vérifier la base de données

---

## 🟢 Cas 2: Résultats Trouvés

```
🔍 Paramètres de recherche reçus: {destination: 'Paris', ...}
    ↓
🔍 RECHERCHE API - Paramètres: {destination: 'Paris', ...}
📍 Destination: Paris
📅 CheckIn: 2026-02-12
👥 Voyageurs: 3
    ↓
🌐 APPEL API RECHERCHE
  📍 URL complète: ...?destination=Paris&checkIn=2026-02-12&travelers=3...
  🔍 Filtres appliqués: {...}
  📋 Query string: destination=Paris&checkIn=2026-02-12&travelers=3...
    ↓
📡 Requête GET: https://airbnb-backend-l640.onrender.com/api/search/?...
   Status: 200 OK ✅
    ↓
✅ Réponse API reçue: {apartments: Array(5), pagination: {...}}
  📦 Nombre d'appartements retournés: 5 ✅
  📄 Pagination: {page: 1, limit: 100, total: 5, pages: 1}
    ↓
📊 RÉSULTAT API: 5 appartement(s) trouvé(s) ✅
🏠 Détails des résultats: (5) [
  {id: 1, title: "Appartement Paris Center", ...},
  {id: 2, title: "Studio Marais", ...},
  ...
]
📌 Response complète: {apartments: [...], pagination: {...}}
    ↓
✅ Appartements transformés: (5) [{...}, {...}, {...}, {...}, {...}]
    ↓
ÉCRAN: 5 appartements affichés ✅
```

**Diagnostic:** 
- ✅ API fonctionne
- ✅ Appartements trouvés
- ✅ Transformation réussie
- → Résultats affichés correctement

---

## 🔵 Cas 3: Erreur API

```
🔍 Paramètres de recherche reçus: {destination: 'Lyon', ...}
    ↓
🔍 RECHERCHE API - Paramètres: {destination: 'Lyon', ...}
    ↓
🌐 APPEL API RECHERCHE
  📍 URL complète: ...
    ↓
📡 Requête GET: https://airbnb-backend-l640.onrender.com/api/search/?...
   Status: 500 Internal Server Error 🚨
   Headers réponse: {...}
    ↓
❌ Erreur lors de la recherche: Error: Erreur HTTP 500
📋 Stack trace: Error: Erreur HTTP 500...
    ↓
⚠️ Fallback au filtrage local
📦 Rooms disponibles localement: 12
  🔎 Filtrage par destination: "Lyon"
  (filtre les 12 sur le local)
    ↓
ÉCRAN: Résultats du filtre local (peut montrer 0 ou plusieurs)
```

**Diagnostic:** 
- ❌ Le backend a une erreur (500)
- → Vérifier les logs du serveur backend
- → Vérifier la base de données
- → Redémarrer le serveur si nécessaire

---

## 📊 Tableau de Comparaison

| Élément | Cas 1 (0 résultat) | Cas 2 (5+ résultats) | Cas 3 (Erreur) |
|---------|---|---|---|
| **Status HTTP** | 200 ✅ | 200 ✅ | 500 ❌ |
| **Réponse API** | `{apartments: []}` | `{apartments: [...]}` | Error |
| **Nombres retournés** | 0 | 5+ | N/A |
| **Fallback activé** | Oui | Non | Oui |
| **Écran utilisateur** | "Aucun résultat" | Appartements visibles | "Aucun résultat" |
| **Cause** | Pas de match | Match trouvé | Serveur erreur |
| **Action** | Vérifier BD | ✅ OK | Redémarrer serveur |

---

## 🎯 Points Clés à Vérifier

### 1. Paramètres de Recherche
```
🔍 Paramètres de recherche reçus: {
  destination: 'Lyon' ← Est-ce le bon lieu?
  checkIn: '2026-02-12' ← Est-ce une date valide?
  travelers: '3' ← Est-ce un nombre?
}
```

### 2. URL de l'API
```
📍 URL complète: https://airbnb-backend-l640.onrender.com/api/search/?destination=Lyon&checkIn=2026-02-12&travelers=3&page=1&limit=100

✅ Vérifications:
- Domaine correct? (airbnb-backend-l640.onrender.com)
- Endpoint correct? (/api/search)
- Paramètres corrects? (destination=..., checkIn=..., travelers=...)
- Format de la date? (2026-02-12 = YYYY-MM-DD)
```

### 3. Status HTTP
```
📡 Status: 200 OK ← ✅ SUCCESS
- 200 = Requête réussie
- 400 = Requête invalide
- 401 = Non autorisé
- 404 = Endpoint non trouvé
- 500 = Erreur serveur
- 503 = Service indisponible
```

### 4. Nombre de Résultats
```
📦 Nombre d'appartements retournés: 5
- 0 = Aucun match en BD
- 1-100 = Résultats trouvés
- > 100 = Voir pagination
```

---

## 🔍 Comment Lire les Logs

### Pour Les Filtres Détaillés:
```
🔎 Filtrage par destination: "lyon"
  ✅ Match: Apartment Paris Lyon (city: lyon, location: france)
  ❌ No match: Studio Paris
  ✅ Match: Villa Lyon Center (city: lyon, location: rhone-alpes)
✅ Résultats après filtrage destination: 2 appartements
```

**Lecture:** 
- On cherche "lyon"
- 2 appartements matchent
- 1 n'a pas matché

---

### Pour Les Erreurs:
```
❌ Erreur lors de la recherche: Error: Erreur HTTP 500
📋 Stack trace: Error: Erreur HTTP 500
    at makeRequest (searchApi.ts:95)
    at searchApartments (searchApi.ts:125)
    at filterRooms (Appartment.tsx:1670)
```

**Lecture:** 
- Type d'erreur: HTTP 500
- Où c'est arrivé: searchApi.ts ligne 95
- Chaîne: searchApi → Appartment.tsx

---

## 📱 Vue Rapide des Emoji

| Emoji | Signification |
|-------|---|
| 🔍 | Information reçue / Recherche |
| 📍 | Destination |
| 📅 | Date |
| 👥 | Voyageurs / Nombre de personnes |
| 🏠 | Appartements / Propriétés |
| 📊 | Résultat / Données |
| ✅ | Succès / OK |
| ❌ | Erreur / Problème |
| ⚠️ | Avertissement / Fallback |
| 🌐 | Appel API / Réseau |
| 📡 | Requête HTTP |
| 📋 | Détails techniques / Stack trace |
| 🎯 | Résultat final |

---

## 💡 Tips de Debugging

1. **Copier tout un bloc de logs:**
   ```
   Clic droit sur le premier log
   → Select all
   → Copy
   ```

2. **Filtrer par mot-clé:**
   - Rechercher "RÉSULTAT API" pour trouver rapidement le nombre
   - Rechercher "Status:" pour voir l'erreur HTTP

3. **Tester l'API en direct:**
   ```
   Ouvrir un nouvel onglet
   Coller l'URL: https://airbnb-backend-l640.onrender.com/api/search/?destination=Lyon&checkIn=2026-02-12&travelers=3
   Voir la réponse JSON brute
   ```

4. **Comparer deux recherches:**
   - Une qui marche (Paris → 5 résultats)
   - Une qui ne marche pas (Lyon → 0 résultats)
   - Voir quelle est la différence

