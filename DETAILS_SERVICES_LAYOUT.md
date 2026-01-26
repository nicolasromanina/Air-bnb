# 🎨 Nouvelle interface - Section "Détails & Services"

## Layout complet (Avant et Après)

### ❌ AVANT
```
┌─────────────────────────────────────────────────────────────────┐
│         DÉTAILS & SERVICES                                       │
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                            │
│  Texte descriptif    │  🥐 Petit-déjeuner        30€      ✓     │
│  ...                 │  🧹 Nettoyage            75€      ▼     │
│                      │  🛏️ Draps Premium         30€      ▼     │
│                      │  🅿️ Parking Couvert      30€      ▼     │
│                      │  ... (autres options)                     │
│                      │                                            │
└──────────────────────┴──────────────────────────────────────────┘
```
*Pas d'accès facile pour changer les nuits*

---

### ✅ APRÈS (NOUVEAU)
```
┌─────────────────────────────────────────────────────────────────┐
│         DÉTAILS & SERVICES                                       │
├──────────────────────┬──────────────────────────────────────────┤
│                      │                                            │
│  Texte descriptif    │  🥐 Petit-déjeuner        30€      ✓     │
│  ...                 │  🧹 Nettoyage            75€      ▼     │
│                      │  🛏️ Draps Premium         30€      ▼     │
│ ┌──────────────────┐ │  🅿️ Parking Couvert      30€      ▼     │
│ │ NOMBRE DE NUITS  │ │  ... (autres options)                     │
│ │       3          │ │                                            │
│ │  [−] 3N [+]      │ │                                            │
│ └──────────────────┘ │                                            │
│                      │                                            │
│ ┌──────────────────┐ │                                            │
│ │ NOMBRE DE PERS   │ │                                            │
│ │       2          │ │                                            │
│ │  [−] 2P [+]      │ │                                            │
│ └──────────────────┘ │                                            │
│                      │                                            │
│ ┌──────────────────┐ │                                            │
│ │ Prix base: 900€  │ │                                            │
│ │ Options:  220€   │ │                                            │
│ │ ─────────────    │ │                                            │
│ │ Total: 1,120€    │ │                                            │
│ │                  │ │                                            │
│ │ [RÉSERVER]       │ │                                            │
│ └──────────────────┘ │                                            │
│                      │                                            │
└──────────────────────┴──────────────────────────────────────────┘
```
*Contrôles complets sur la gauche, options détaillées à droite*

---

## 📊 Détail du panneau de gauche (lg:col-span-5)

### Composant 1: Nombre de nuits
```
┌─────────────────────────────────┐
│ Nombre de nuits                 │
│              3                  │ ← Grande taille
├─────────────────────────────────┤
│  [−]    3N     [+]              │
│  gris  texte  noir+blanc        │
└─────────────────────────────────┘
```

**Interactions:**
- Click sur [−] → nuits - 1 (minimum 1)
- Click sur [+] → nuits + 1 (illimité)
- Les prix se recalculent automatiquement
- Les options "per_day" se mettent à jour

---

### Composant 2: Nombre de personnes
```
┌─────────────────────────────────┐
│ Nombre de personnes             │
│              2                  │ ← Grande taille
├─────────────────────────────────┤
│  [−]    2P     [+]              │
│  gris  texte  noir+blanc        │
└─────────────────────────────────┘
```

**Interactions:**
- Click sur [−] → guests - 1 (minimum 1)
- Click sur [+] → guests + 1 (illimité)
- Les prix se recalculent automatiquement
- Les options "per_guest" se mettent à jour

---

### Composant 3: Récapitulatif des prix
```
┌─────────────────────────────────┐
│ Prix base        900€            │ (300€/nuit × 3)
│ Options          220€  ← Rose    │ (visible si > 0)
│ ─────────────────────────────    │
│ Total          1,120€  ← Rose    │ (gros chiffre)
├─────────────────────────────────┤
│                                 │
│ [ RÉSERVER MAINTENANT ]         │
│  (bouton noir pleine largeur)   │
└─────────────────────────────────┘
```

**Fonctionnalités:**
- Affichage du prix de base: `apartmentPrice × nights`
- Affichage du coût options: `sum(selectedOptions)`
- Total = base + options
- Mise à jour **en temps réel** lors du changement de nuits/personnes
- Mise à jour **lors de la sélection d'options**

---

## 🔄 Calculs en temps réel

### Scenario: Augmenter les nuits de 2 à 3

```
AVANT:
  Nuits: 2
  Base: 300€ × 2 = 600€
  Options (ex: parking 15€/nuit) = 15€ × 2 = 30€
  Total: 630€

[CLICK +]
↓

APRÈS:
  Nuits: 3
  Base: 300€ × 3 = 900€
  Options (ex: parking 15€/nuit) = 15€ × 3 = 45€
  Total: 945€
```
*Tous les prix "per_day" se recalculent automatiquement*

---

### Scenario: Ajouter une option

```
AVANT:
  Personnes: 2
  Options sélectionnées:
    - Parking 15€/nuit × 3 = 45€
  Options Total: 45€
  
[CLICK Petit-déjeuner 15€/pers]
↓

APRÈS:
  Personnes: 2
  Options sélectionnées:
    - Parking 15€/nuit × 3 = 45€
    - Petit-déj 15€/pers × 2 = 30€
  Options Total: 75€
```
*Le recapitulatif se met à jour instantanément*

---

## 🎯 Interactions utilisateur complètes

### 1. Arrivée sur la page
```
→ Charge les options depuis API
→ Nuits: 2 (par défaut)
→ Personnes: 2 (par défaut)
→ Prix calculé: 300€/nuit × 2 = 600€
→ Affichage du total
```

### 2. Utilisateur augmente les nuits
```
[CLICK +] → Nuits: 3
→ Prix base: 300€ × 3 = 900€
→ Options per_day recalculées
→ Affichage du nouveau total
```

### 3. Utilisateur sélectionne des options
```
[CLICK Nettoyage] → Sélectionné
→ Options total: +75€
→ Total: 900€ + 75€ = 975€
→ Affichage mis à jour
```

### 4. Utilisateur clique "Réserver"
```
[CLICK Réserver]
→ Données envoyées:
   {
     nights: 3,
     guests: 2,
     basePrice: 900€,
     optionsPrice: 75€,
     selectedOptions: [
       { name: 'Nettoyage', price: 75, ... }
     ],
     total: 975€
   }
→ Redirection vers paiement
```

---

## 💾 État du composant

```typescript
const [nights, setNights] = useState(2);        // Nombre de nuits
const [guests, setGuests] = useState(2);        // Nombre de personnes
const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]); // Options
const [optionsPrice, setOptionsPrice] = useState(0);  // Coût total options
const [allOptions, setAllOptions] = useState<Record<string, any[]>>({}); // Options dispo
```

---

## 🎨 Styles CSS appliqués

| Élément | Style |
|---------|-------|
| Conteneur | `bg-white p-6 rounded-[4px] border border-gray-100` |
| Label | `text-sm font-bold uppercase text-gray-500` |
| Nombre | `text-2xl font-black` |
| Bouton [−] | `bg-gray-100 hover:bg-gray-200` |
| Bouton [+] | `bg-black hover:bg-zinc-900 text-white` |
| Total | `text-2xl font-black text-[#FF2E63]` |
| Bouton Réserver | `bg-black hover:bg-zinc-900 text-white py-4` |

---

## 🚀 Avantages de cette approche

✅ **Visibilité**: Les contrôles sont toujours visibles
✅ **Accessibilité**: Facile à utiliser sur mobile et desktop
✅ **Feedback**: Mise à jour instantanée du prix
✅ **Cohérence**: Même design que le reste de l'appli
✅ **Clarté**: Séparation claire des nuits/personnes/prix
✅ **Flexibilité**: Les calculs s'ajustent en temps réel

---

## 📱 Responsive design

### Mobile (< lg)
```
[Texte descriptif]

┌─────────────────────┐
│ Nombre de nuits     │
│ [−] 2N [+]          │
└─────────────────────┘

┌─────────────────────┐
│ Nombre de personnes │
│ [−] 2P [+]          │
└─────────────────────┘

┌─────────────────────┐
│ Prix: 600€          │
│ [RÉSERVER]          │
└─────────────────────┘

[Toutes les options empilées]
```

### Desktop (≥ lg)
```
[Gauche: 5 colonnes] | [Droite: 7 colonnes]
  Détails                Options
  Nuits                  🥐 Petit-déj
  Personnes              🧹 Nettoyage
  Prix                   🛏️ Draps
  Bouton                 ... etc
```

---

## ✨ Résultat final

Une interface **intuitive et complète** où l'utilisateur peut:

1. ✓ Ajuster le nombre de nuits facilement
2. ✓ Ajuster le nombre de personnes facilement
3. ✓ Voir le prix se recalculer en temps réel
4. ✓ Sélectionner des options dans la même vue
5. ✓ Voir le prix total mis à jour automatiquement
6. ✓ Procéder à la réservation en un clic

Le tout dans une **interface cohérente et élégante**! 🎉
