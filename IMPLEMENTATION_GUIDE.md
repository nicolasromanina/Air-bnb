# 🎯 Guide d'Intégration - Options Supplémentaires

## ✨ Résumé des changements

Le module d'options supplémentaires a été complètement intégré dans votre application de réservation.

### 🏠 Section "Détails & Services"

Les options supplémentaires sont **maintenant intégrées directement** dans la section "Détails & Services" du composant `AppartmentDetail.tsx` avec votre design existant.

**Affichage:**
```
[ICÔNE] NOM DE L'OPTION    PRIX CALCULÉ    [INDICATEUR]
🥐 Petit-déjeuner          30€ / 2 pers    ✓ (sélectionné)
🧹 Nettoyage              75€             ▼ (disponible)
```

---

## 📱 Flux utilisateur complet

### 1️⃣ Visite de la page d'appartement
```
AppartmentDetailPage
  ├─ Navbar
  ├─ AppartmentDetail
  │  ├─ Section Hero (titre, prix)
  │  ├─ Section "Détails & Services"
  │  │  └─ Options chargées dynamiquement via API
  │  └─ Section Logos
  └─ Footer
```

### 2️⃣ Sélection des options
- L'utilisateur clique sur une option
- La fonction `handleOptionToggle()` ajoute/retire l'option
- Le prix est calculé automatiquement selon le type (fixed/per_day/per_guest)
- L'indicateur visuel change (✓ vs ▼)

### 3️⃣ Navvigation vers le paiement
- Click sur "Réserver maintenant"
- Les données incluent les options sélectionnées:
  ```javascript
  {
    apartmentId: 1,
    title: "Appartement Luxe Vue Mer",
    nights: 3,
    guests: 2,
    basePrice: 300 * 3 = 900€,
    optionsPrice: 75 + 30 + 25 = 130€,  // Total options
    total: 1030€,  // 900€ + 130€
    selectedOptions: [
      { optionId: "...", name: "Nettoyage", price: 75, quantity: 1, pricingType: "fixed" },
      { optionId: "...", name: "Petit-déjeuner", price: 15, quantity: 2, pricingType: "per_guest" },
      { optionId: "...", name: "Check-in Anticipé", price: 25, quantity: 1, pricingType: "fixed" }
    ]
  }
  ```

### 4️⃣ Formulaire de paiement
- Le formulaire reçoit les détails complets
- Les options sont affichées dans `SelectedOptionsSummary`
- Le bouton "Payer" affiche le montant total incluant les options
- Click envoie tout au backend

### 5️⃣ Backend traitement
- Le contrôleur de paiement reçoit les options
- Les options sont sauvegardées dans la réservation
- Le Stripe checkout inclut les options
- La confirmation affiche les détails complets

---

## 📊 Données de l'API

### Réponse GET /api/options
```json
{
  "success": true,
  "data": {
    "options": {
      "service": [
        {
          "_id": "...",
          "name": "Nettoyage",
          "description": "Service de nettoyage professionnel",
          "category": "service",
          "price": 75,
          "pricingType": "fixed",
          "icon": "🧹",
          "isActive": true
        },
        ...
      ],
      "modification": [...],
      "insurance": [...],
      "commodity": [...]
    }
  }
}
```

---

## 🔧 Fonctions principales

### Dans AppartmentDetail.tsx

```typescript
// Charge les options au montage
useEffect(() => {
  const fetchOptions = async () => {
    const response = await api.getAdditionalOptions();
    if (response.success) {
      setAllOptions(response.data?.options || {});
    }
  };
  fetchOptions();
}, []);

// Sélectionne/désélectionne une option
const handleOptionToggle = (option: any) => {
  const isSelected = selectedOptions.some(o => o.optionId === option._id);
  // Ajoute ou retire l'option
  // Met à jour le prix total
};

// Calcule le prix selon le type
const calculateOptionPrice = (option: any): number => {
  switch (option.pricingType) {
    case 'per_day': return option.price * nights;
    case 'per_guest': return option.price * guests;
    default: return option.price;
  }
};
```

---

## 💾 Stockage des données

### LocalStorage (lors de la réservation)
```javascript
localStorage.setItem('currentReservation', JSON.stringify({
  apartmentId: 1,
  title: "...",
  // ... autres données
  selectedOptions: [...],
  optionsPrice: 130,
  basePrice: 900,
  total: 1030
}));
```

### MongoDB (confirmation du paiement)
```javascript
// Reservation document
{
  _id: ObjectId,
  userId: ObjectId,
  apartmentId: 1,
  // ... autres champs
  additionalOptions: [
    {
      optionId: ObjectId,
      name: "Nettoyage",
      price: 75,
      quantity: 1
    },
    ...
  ],
  additionalOptionsPrice: 130,
  totalPrice: 1030
}
```

---

## 🎨 Design & UX

### Visuels des options

| Élément | Design |
|---------|--------|
| Icône | Emoji (🧹, 🥐, etc.) |
| Nom | Font bold, uppercase, tracking-widest |
| Description | Texte gris petit, sous le nom |
| Prix | Font bold, aligné à droite |
| Sélection | ✓ rouge si sélectionné, ▼ gris sinon |
| Hover | Fond gris clair (#f9fafb) |
| Bordure | Gris 100 |

### Couleurs
- Sélectionné: `#FF2E63` (rose vif)
- Non-sélectionné: Gris (`#6b7280`)
- Arrière-plan: Blanc (`#ffffff`)
- Bordure: Gris 100 (`#f3f4f6`)

---

## 📝 Checklist d'intégration

- ✅ Modèle `AdditionalOption` créé
- ✅ Contrôleur avec CRUD complet
- ✅ Routes API configurées
- ✅ Seed data avec 14 options par défaut
- ✅ Composant `AdditionalOptionsSelector` (réutilisable)
- ✅ Intégration dans `AppartmentDetail`
- ✅ Calcul automatique des prix (fixed/per_day/per_guest)
- ✅ Sélection multiple avec UI interactive
- ✅ Passage des options au formulaire de paiement
- ✅ Affichage du total incluant les options
- ✅ Sauvegarde des options dans la réservation
- ✅ Composant `SelectedOptionsSummary` pour affichage

---

## 🚀 Prochaines étapes (optionnelles)

1. **Ajouter la pagination** si le nombre d'options dépasse 20
2. **Catégories collapsibles** - Masquer les catégories vides
3. **Favoris** - Mémoriser les options préférées de l'utilisateur
4. **Recommandations** - "Clients ayant aussi choisi..."
5. **Calendrier** - Montrer les options disponibles par date
6. **Statistiques** - Admin dashboard des options les plus populaires

---

## 📞 Support

### API disponibles
- `api.getAdditionalOptions()` - Récupère toutes les options
- `api.getOptionsByCategory(category)` - Filtre par catégorie
- `api.getOption(id)` - Détail d'une option
- `api.createOption(data)` - Admin: créer une option
- `api.updateOption(id, data)` - Admin: modifier une option
- `api.deleteOption(id)` - Admin: supprimer une option

### Commandes npm backend
```bash
npm run seed           # Initialiser les options
npm run dev            # Développement avec watch
npm run build          # Compiler TypeScript
npm start              # Production
```

---

## 🎉 Résultat final

Votre application propose maintenant un système complet et intuitif de personnalisation des réservations, avec:

✨ **14 options préconfigurées** (services, modifications, assurances, commodités)
📊 **3 types de tarification** (fixe, par nuit, par personne)
🎯 **Sélection flexible** (une ou plusieurs options)
💰 **Calcul automatique** du prix total
🔄 **Intégration complète** du paiement Stripe
💾 **Persistance** des données (MongoDB)

Les utilisateurs peuvent personnaliser leur séjour exactement comme ils le souhaitent! 🏡✨
