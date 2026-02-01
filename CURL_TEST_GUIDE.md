# 🧪 GUIDE DE TEST AVEC CURL

## 1️⃣ TEST DES SUGGESTIONS DE DESTINATIONS

```bash
# Récupérer toutes les villes, pays et locations disponibles
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search/filters" \
  -H "Content-Type: application/json"
```

**Réponse attendue:**
```json
{
  "cities": ["Paris", "Lyon", "Marseille", ...],
  "countries": ["France", "Spain", ...],
  "locations": ["Paris 8e", "Lyon Center", ...],
  "priceRange": { "minPrice": 50, "maxPrice": 500 },
  "amenities": ["WiFi", "Parking", ...],
  "capacityRange": { "minCapacity": 1, "maxCapacity": 20 }
}
```

---

## 2️⃣ TEST DE RECHERCHE PAR DESTINATION UNIQUEMENT

### Test 1: Chercher "Paris"
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris" \
  -H "Content-Type: application/json"
```

### Test 2: Chercher "France"
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=France" \
  -H "Content-Type: application/json"
```

### Test 3: Chercher "Lyon"
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Lyon" \
  -H "Content-Type: application/json"
```

**Réponse attendue:**
```json
{
  "apartments": [
    {
      "_id": "...",
      "roomId": 1,
      "title": "Appartement Paris",
      "city": "Paris",
      "country": "France",
      "price": 150,
      "guests": "2-4 guests",
      "bedrooms": "2 bedrooms",
      "images": ["url1", "url2"],
      "averageRating": 4.5,
      "reviewCount": 10
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 5,
    "pages": 1
  }
}
```

---

## 3️⃣ TEST AVEC PLUSIEURS CRITÈRES

### Test 1: Destination + Date Check-in
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris&checkIn=2026-02-15" \
  -H "Content-Type: application/json"
```

### Test 2: Destination + Nombre de voyageurs
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris&travelers=2" \
  -H "Content-Type: application/json"
```

### Test 3: Tous les critères (Paris, 2 voyageurs, date)
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris&checkIn=2026-02-15&travelers=2" \
  -H "Content-Type: application/json"
```

---

## 4️⃣ TEST AVEC RECHERCHE SPÉCIFIQUE PAR VILLE/PAYS

### Chercher spécifiquement par city
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?city=Paris" \
  -H "Content-Type: application/json"
```

### Chercher spécifiquement par country
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?country=France" \
  -H "Content-Type: application/json"
```

### Chercher spécifiquement par location
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?location=Paris%208e" \
  -H "Content-Type: application/json"
```

---

## 5️⃣ TEST AVEC FILTRES AVANCÉS

### Test: Filtrer par prix
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris&minPrice=100&maxPrice=300" \
  -H "Content-Type: application/json"
```

### Test: Filtrer par capacité (minimum 4 personnes)
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris&minCapacity=4" \
  -H "Content-Type: application/json"
```

### Test: Filtrer par amenities
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris&amenities=WiFi,Parking" \
  -H "Content-Type: application/json"
```

---

## 6️⃣ TEST AVEC PAGINATION ET TRI

### Test: Première page
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris&page=1&limit=12" \
  -H "Content-Type: application/json"
```

### Test: Tri par prix (bas au haut)
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris&sortBy=price-low" \
  -H "Content-Type: application/json"
```

### Test: Tri par note
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris&sortBy=rating" \
  -H "Content-Type: application/json"
```

---

## 7️⃣ UTILISER JQ POUR FORMATER LA RÉPONSE

Si vous avez `jq` installé, vous pouvez formater la sortie:

```bash
# Voir tous les apartements trouvés
curl -s "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris" | jq '.apartments | length'

# Voir le nombre total trouvé
curl -s "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris" | jq '.pagination.total'

# Voir les titres des appartements trouvés
curl -s "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris" | jq '.apartments[].title'

# Voir les villes disponibles
curl -s "https://airbnb-backend-l640.onrender.com/api/search/filters" | jq '.cities | sort'

# Voir les pays disponibles
curl -s "https://airbnb-backend-l640.onrender.com/api/search/filters" | jq '.countries | sort'
```

---

## 8️⃣ COMMANDES DE DEBUG

### Voir les headers de réponse
```bash
curl -i "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris"
```

### Voir les timing de la requête
```bash
curl -w "Temps total: %{time_total}s\n" "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris"
```

### Verbose (voir tous les détails)
```bash
curl -v "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris"
```

---

## 📊 CHECKLIST DE TEST

- [ ] **Suggestions** - Vérifier qu'on récupère les villes, pays, locations
- [ ] **Recherche "Paris"** - Vérifie que "Paris" affiche des résultats
- [ ] **Recherche "France"** - Vérifie que "France" affiche des résultats
- [ ] **Recherche "Lyon"** - Vérifie que les autres villes marchent
- [ ] **Destination + Voyageurs** - Filtre les résultats par capacité
- [ ] **Destination + Date** - Filtre les résultats par disponibilité
- [ ] **Tous les critères** - Combine tous les filtres
- [ ] **Pagination** - Vérifie que `page` et `limit` fonctionnent
- [ ] **Tri** - Vérifie que `sortBy` fonctionne

---

## 💡 EXEMPLES COMPLETS À COPIER/COLLER

### Exemple 1: Chercher Paris avec 2 voyageurs
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=Paris&travelers=2" \
  -H "Content-Type: application/json" | jq '.'
```

### Exemple 2: Chercher France du 15 au 20 février pour 4 personnes
```bash
curl -X GET "https://airbnb-backend-l640.onrender.com/api/search?destination=France&checkIn=2026-02-15&travelers=4" \
  -H "Content-Type: application/json" | jq '.apartments | length'
```

### Exemple 3: Voir toutes les villes disponibles (formaté)
```bash
curl -s "https://airbnb-backend-l640.onrender.com/api/search/filters" | jq '.cities'
```
