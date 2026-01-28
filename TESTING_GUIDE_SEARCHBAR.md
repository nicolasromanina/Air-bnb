# Guide de Test - Système de Recherche Amélioré

## 🧪 Comment tester

### Test 1 : Recherche depuis la page d'accueil
**Étapes :**
1. Naviguez vers `http://localhost:5173/` (page d'accueil)
2. Vous verrez une barre de recherche "compacte" dans la section hero (si visible en desktop)
3. Remplissez les champs :
   - **Destination** : "Paris" (ou n'importe quel texte)
   - **Arrivée** : Sélectionnez une date (aujourd'hui ou plus tard)
   - **Voyageurs** : Sélectionnez un nombre (1-8)
4. Cliquez sur le bouton "Rechercher"
5. ✅ Vous devriez être redirigé vers `/appartement?destination=Paris&checkIn=YYYY-MM-DD&travelers=2`

---

### Test 2 : Page d'appartements sans paramètres
**Étapes :**
1. Naviguez vers `http://localhost:5173/appartement`
2. Vous verrez une grande barre de recherche "hero" en haut
3. C'est le point de départ pour une nouvelle recherche
4. Remplissez les critères et recherchez
5. ✅ Les appartements se filtrent automatiquement

---

### Test 3 : Recherche avec paramètres
**Étapes :**
1. Naviguez directement vers un URL avec paramètres de recherche :
   ```
   http://localhost:5173/appartement?destination=Paris&checkIn=2025-02-15&travelers=4
   ```
2. ✅ Vous verrez :
   - La **barre "Critères de recherche actuels"** affichant vos paramètres
   - Les appartements filtrés selon les critères
   - Un bouton "✕ Réinitialiser" pour effacer la recherche

---

### Test 4 : Filtrage par destination
**Paramètres :**
```
destination=paris
```
**Résultat attendu :**
- Seuls les appartements contenant "paris" dans le titre ou description

---

### Test 5 : Filtrage par nombre de voyageurs
**Paramètres :**
```
travelers=6
```
**Résultat attendu :**
- Seuls les appartements pouvant accueillir 6 personnes ou plus

---

### Test 6 : Réinitialiser la recherche
**Étapes :**
1. Naviguez vers `/appartement?destination=Test&checkIn=2025-03-01&travelers=2`
2. Cliquez sur le bouton "✕ Réinitialiser"
3. ✅ Vous retournez à `/appartement` sans paramètres
4. La grande SearchBar "hero" réapparaît

---

## 📱 Tests Responsive

### Desktop (1440px+)
- ✅ SearchBar visible dans hero section
- ✅ 4 colonnes en grille dans la variante hero
- ✅ Layout optimal

### Tablet (768px - 1439px)
- ✅ SearchBar responsive 2 colonnes
- ✅ Margins adaptés
- ✅ Lisible et utilisable

### Mobile (< 768px)
- ✅ SearchBar en 1 colonne (stack vertical)
- ✅ Pleine largeur des inputs
- ✅ Bouton accessible
- ✅ Swipe-friendly

---

## 🔍 Cas de test détaillés

### Cas 1 : Validation - Destination vide
```
- Remplir : Aucun champ destination
- Cliquer : Rechercher
- Résultat : Alert "Veuillez sélectionner une destination"
```

### Cas 2 : Validation - Date invalide
```
- Destination : Paris
- Date d'arrivée : Vide
- Cliquer : Rechercher
- Résultat : Alert "Veuillez sélectionner une date d'arrivée"
```

### Cas 3 : Validation - Date dans le passé
```
- Destination : Paris
- Date d'arrivée : Hier
- Cliquer : Rechercher
- Résultat : Input date désactivé pour dates passées
```

### Cas 4 : Validation - Date de départ avant arrivée
```
- Date d'arrivée : 2025-03-15
- Date de départ : 2025-03-10
- Résultat : Input checkout désactivé avant checkIn
```

---

## 🎯 Scénarios réalistes

### Scénario 1 : Planner une escapade parisienne
```
Destination : Paris
Arrivée : 2025-02-14
Départ : 2025-02-16
Voyageurs : 2
↓
Recherche filtre les appartements parisiens pour couples
```

### Scénario 2 : Séjour en famille
```
Destination : Lyon
Arrivée : 2025-03-01
Voyageurs : 6
↓
Affiche seuls les grands appartements à Lyon
```

### Scénario 3 : Voyage d'affaires
```
Destination : (vide) - Toute destination
Arrivée : 2025-02-20
Départ : 2025-02-22
Voyageurs : 1
↓
Affiche tous les appartements avec 1+ place
```

---

## 🐛 Déboguer

### Vérifier les paramètres URL
- Ouvrir les DevTools (F12)
- Aller dans l'onglet "Network"
- Rechercher
- Vérifier l'URL dans la barre adresse

### Vérifier le filtrage
- Console : `document.querySelectorAll('[data-room-id]')`
- Devrait retourner les appartements filtrés

### Vérifier le localStorage (si utilisé)
- DevTools → Application → LocalStorage
- Chercher les clés de recherche

---

## 📊 Résultats attendus

| Test | Action | Résultat |
|------|--------|---------|
| **Home - Recherche** | Remplir + Rechercher | Redirection /appartement?params |
| **Appartement - No Params** | Charger page | SearchBar hero visible |
| **Appartement - Params** | Charger avec params | Barre critique + résultats |
| **Réinitialiser** | Cliquer bouton | Retour /appartement |
| **Mobile** | Redimensionner | SearchBar responsive ✅ |
| **Validation** | Soumettre vide | Alert approprié |
| **Date passée** | Sélectionner hier | Input disabled |

---

## ✅ Checklist de test complète

- [ ] Recherche depuis home fonctionne
- [ ] Navigation vers appartement avec params fonctionne
- [ ] Filtrage par destination fonctionne
- [ ] Filtrage par date fonctionne
- [ ] Filtrage par voyageurs fonctionne
- [ ] Réinitialisation efface les paramètres
- [ ] SearchBar visible sur desktop
- [ ] SearchBar responsive sur mobile
- [ ] Validation des champs fonctionne
- [ ] URL paramètres corrects dans la barre
- [ ] Pas d'erreurs console
- [ ] Transition animations fluides
- [ ] Styles desktop vs mobile corrects
- [ ] Tous les icônes s'affichent
- [ ] Boutons cliquables et accessibles

---

## 🔧 Commandes utiles

### Démarrer en développement
```bash
npm run dev
```

### Vérifier les types TypeScript
```bash
npm run type-check
```

### Linter
```bash
npm run lint
```

### Build production
```bash
npm run build
```

---

## 📝 Notes

- Les paramètres de recherche sont case-insensitive pour destination
- Les dates sont en format ISO (YYYY-MM-DD)
- Les voyageurs sont des entiers 1-8
- Le filtrage est en temps réel (pas de rechargement nécessaire)
- Les propriétés de recherche sont préservées dans l'URL

---

## 🆘 Troubleshooting

**Question : SearchBar n'apparaît pas sur mobile**
- Réponse : C'est normal, elle est `hidden lg:block` par défaut. À ajuster selon besoins.

**Question : La recherche ne filtre rien**
- Réponse : Vérifier que les appartements ont des titres/descriptions contenant le texte recherché

**Question : Les dates ne valident pas**
- Réponse : Vérifier le format de la date (YYYY-MM-DD) et que la date est valide

**Question : Les paramètres URL ne sont pas appliqués**
- Réponse : Vérifier que les noms de paramètres sont corrects (destination, checkIn, travelers)

