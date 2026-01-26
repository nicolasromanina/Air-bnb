# 🧪 Guide de Test - Édition des Détails de Chambre

## ✅ Checklist de vérification

### Phase 1: Vérification de compilation
- [x] Aucune erreur TypeScript
- [x] Aucun import manquant
- [x] Tous les composants chargent

### Phase 2: Interface d'administration

#### 2.1 Ouverture de l'éditeur
```
Test: Ouvrir AppartmentEditor
✓ Page charge correctement
✓ Toutes les sections visibles
✓ Menu navigation fonctionne
```

#### 2.2 Accès à Room Detail
```
Test: Cliquer sur une chambre dans "Rooms"
✓ Les données de la chambre se chargent
✓ Room Detail s'affiche
✓ Aucune erreur console
```

#### 2.3 Onglets
```
Test: Cliquer sur le bouton bleu "👀 Info Hero"
✓ Onglet bascule au bleu
✓ Affiche les champs corrects
✓ Images visibles si présentes

Test: Cliquer sur "Détails"
✓ Onglet revient à normal
✓ Sections de couleurs visibles
✓ Prix, invités, chambres présents
```

#### 2.4 Édition du Hero

**Titre:**
```
Test: Modifier le titre
1. Effacer le texte actuel
2. Taper "Suite Royale"
3. Voir la mise à jour instantanée
✓ Le champ se met à jour
✓ Pas d'erreur console
```

**Sous-titre:**
```
Test: Modifier le sous-titre
1. Cliquer dans le champ
2. Modifier le texte
✓ Changement visible instantanément
```

**Description:**
```
Test: Modifier la description
1. Cliquer sur le textarea
2. Remplacer le texte
✓ Hauteur ajuste si nécessaire
✓ Pas de perte de texte
```

**Type de logement:**
```
Test: Remplir le type
1. Taper "Logement sans fumeur"
✓ Le champ accepte le texte
✓ Pas d'erreur
```

#### 2.5 Gestion des images

**Téléchargement:**
```
Test: Télécharger une image
1. Cliquer sur la zone de téléchargement
2. Sélectionner un fichier PNG/JPG
✓ Fichier accepté
✓ Message de succès affiché
✓ Image ajoutée à la liste
```

**Prévisualisation:**
```
Test: Naviguer dans l'aperçu
1. Voir l'image principale
2. Cliquer "Suivante →"
✓ Image change
✓ Compteur se met à jour (2/3)
3. Cliquer "← Précédente"
✓ Revient à l'image précédente
```

**Miniatures:**
```
Test: Cliquer sur miniature
1. Voir les miniatures sous l'aperçu
2. Cliquer sur #2
✓ Aperçu passe à image #2
✓ Miniature #2 est en bleu
```

**Suppression:**
```
Test: Supprimer une image
1. Hover sur une miniature
2. Cliquer la corbeille
✓ Image supprimée
✓ Compteur se met à jour
✓ Aperçu passe à l'image suivante
```

**URL externe:**
```
Test: Ajouter image par URL
1. Cliquer [+ Ajouter une image par URL]
2. Un champ d'URL apparaît
3. Copier-coller une URL
✓ URL acceptée
✓ Peut être supprimée comme les autres
```

#### 2.6 Édition des détails

**Tarification:**
```
Test: Modifier le prix
1. Onglet Détails
2. Champ "💰 Prix par nuit (€)"
3. Taper 150
✓ Accepte les nombres
✓ Pas d'erreur

Test: Taper nombre négatif
1. Taper -50
2. Cliquer Sauvegarder
✓ Erreur affichée: "Le prix ne peut pas être négatif"
✓ Sauvegarde bloquée
```

**Capacité:**
```
Test: Modifier invités
1. Champ "👥 Nombre d'invités"
2. Taper "jusqu'à 5 invités"
✓ Accepte le texte libre

Test: Modifier chambres
1. Champ "🛏️ Nombre de chambres"
2. Taper "3 chambres"
✓ Accepte le texte libre
```

**Équipements inclus (Vert):**
```
Test: Ajouter équipement
1. Section verte
2. Cliquer [+ Ajouter]
3. Taper "Thé et café"
✓ Nouvelle ligne ajoutée

Test: Supprimer équipement
1. Cliquer la corbeille
✓ Ligne supprimée
✓ Autre équipement reste
```

**Services (Violet):**
```
Test: Ajouter service
1. Section violette
2. Cliquer [+ Ajouter]
3. Taper "WiFi gratuit"
✓ Nouveau service ajouté

Test: Plusieurs services
1. Ajouter 3 services
✓ Tous s'affichent
✓ Chacun peut être supprimé indépendamment
```

**Caractéristiques (Orange):**
```
Test: Ajouter caractéristique
1. Section orange
2. Cliquer [+ Ajouter]
3. Taper "Vue panoramique"
✓ Ajoutée à la liste

Test: Caractéristiques multiples
1. Ajouter 3+ caractéristiques
✓ Toutes s'affichent
✓ Suppression individuelle fonctionne
```

#### 2.7 Sauvegarde

**Sauvegarder (Vert):**
```
Test: Cliquer "Sauvegarder"
1. Effectuer des changements
2. Cliquer le bouton vert
✓ Bouton montre "Sauvegarde..." avec spinner
✓ Message de succès: "✅ Détails de la chambre sauvegardés!"
✓ Message disparaît après 2 secondes
```

**Synchroniser (Bleu):**
```
Test: Cliquer "Synchroniser"
1. Effectuer des changements
2. Cliquer le bouton bleu
✓ Bouton montre "Sync..." avec spinner
✓ Message de succès similaire
✓ Brouillon local synchronisé
```

**Retour:**
```
Test: Cliquer "Retour"
1. Depuis l'éditeur
✓ Retour à la liste des chambres
✓ Section Room Detail se ferme
✓ Changements sauvegardés (ou perdus si non sauvegardés)
```

### Phase 3: Affichage client (AppartmentDetail)

#### 3.1 Chargement des données
```
Test: Ouvrir une chambre en client
1. Aller sur /appartment-detail/1
✓ Données se chargent
✓ Images s'affichent
✓ Titre visible
✓ Sous-titre visible
```

#### 3.2 Galerie d'images
```
Test: Navigation galerie
1. Voir l'image principale
2. Cliquer flèche droite
✓ Image change
✓ Compteur se met à jour
3. Cliquer flèche gauche
✓ Revient à l'image précédente

Test: Miniatures
1. Voir les miniatures
2. Cliquer miniature #2
✓ Affiche image #2
✓ Miniature en surbrillance
```

#### 3.3 Informations affichées
```
Test: Tarification
✓ Prix par nuit affiché (ex: "150€ / nuit")
✓ Format correct

Test: Capacité
✓ Nombre d'invités affiché
✓ Nombre de chambres affiché

Test: Équipements
✓ Équipements inclus affichés en rose
✓ Services supplémentaires affichés
✓ Type de logement affiché

Test: Caractéristiques
✓ Caractéristiques principales listées
✓ Checkmarks verts visibles
```

#### 3.4 Description
```
Test: Description complète
✓ Texte s'affiche correctement
✓ Mise en forme correcte
✓ Pas de coupure
```

### Phase 4: Validation et erreurs

#### 4.1 Validation des champs
```
Test: Prix vide
1. Supprimer le prix
2. Taper un nombre négatif
3. Cliquer Sauvegarder
✓ Erreur affichée

Test: Titre vide
1. Supprimer le titre
2. Cliquer Sauvegarder
✓ Erreur: "Le titre ne peut pas être vide"

Test: Description vide
1. Supprimer la description
2. Cliquer Sauvegarder
✓ Erreur: "La description ne peut pas être vide"
```

#### 4.2 Messages d'erreur
```
Test: Affichage d'erreurs
1. Faire une action invalide
✓ Erreurs affichées en haut (background rouge)
✓ Liste des erreurs claire
✓ Texte lisible
```

#### 4.3 Récupération d'erreurs
```
Test: Corriger une erreur
1. Voir l'erreur
2. Corriger le champ
3. Cliquer Sauvegarder
✓ Succès cette fois
✓ Erreur disparaît
```

### Phase 5: Brouillons locaux

#### 5.1 Sauvegarde locale
```
Test: Créer un brouillon
1. Modifier un champ
2. NE PAS cliquer Sauvegarder
3. Fermer le navigateur
4. Rouvrir la page
✓ Les modifications sont toujours là
✓ Récupérées depuis localStorage
```

#### 5.2 Synchronisation
```
Test: Synchroniser brouillon
1. Effectuer changements
2. Cliquer Synchroniser
✓ Brouillon envoyé au serveur
✓ Message de succès
✓ Brouillon local effacé
```

#### 5.3 Brouillons multiples
```
Test: Plusieurs chambres
1. Modifier chambre #1
2. Aller à chambre #2
3. Modifier chambre #2
4. Revenir à chambre #1
✓ Brouillon #1 récupéré
5. Revenir à chambre #2
✓ Brouillon #2 récupéré
```

### Phase 6: Intégration

#### 6.1 Chambre à chambre
```
Test: Cohérence des données
1. Modifier chambre #1 en admin
2. Sauvegarder
3. Ouvrir chambre #1 en client
✓ Changements visibles

Test: Chambre #2 inchangée
1. Vérifier chambre #2 en client
✓ Pas affectée par changement #1
```

#### 6.2 Refresh de page
```
Test: Rafraîchir après changement
1. Modifier et sauvegarder
2. Appuyer F5
✓ Données rechargées du serveur
✓ Changements persisten
```

#### 6.3 Navigation
```
Test: Naviguer en admin
1. Ouvrir AppartmentEditor
2. Aller à section Rooms
3. Modifier une chambre
4. Cliquer Retour
5. Aller à une autre chambre
✓ Données correctes pour chaque chambre
```

---

## 🎯 Résultats attendus

### ✅ Points de succès

Lors des tests, vous devriez voir:

1. **Interface limpide**
   - Onglets visibles et fonctionnels
   - Couleurs différentes pour chaque section
   - Icônes appropriées

2. **Édition fluide**
   - Changements en temps réel
   - Pas de lag ou délai
   - Texte accepté sans limite

3. **Images bien gérées**
   - Téléchargement fonctionne
   - Prévisualisation correcte
   - Navigation intuitive

4. **Validation stricte**
   - Les erreurs sont affichées
   - Empêche les données invalides
   - Messages clairs

5. **Persistance**
   - Changements sauvegardés
   - Visible en client après refresh
   - Brouillons locaux fonctionnent

6. **Affichage client**
   - Données affichées correctement
   - Mise en forme agréable
   - Interactif (galerie fonctionne)

---

## 🐛 Si quelque chose ne fonctionne pas

### Images ne s'affichent pas
```
Vérifier:
1. Console (F12) pour les erreurs
2. Network tab - les URLs se chargent?
3. Les URLs commencent-elles par /uploads/?
4. Serveur backend accessible?
```

### Changements non persistants
```
Vérifier:
1. Message de succès affiché?
2. Backend repeat accessible?
3. Authentification OK?
4. localStorage activé dans navigateur?
```

### Erreur "Cannot find name"
```
Vérifier:
1. Tous les imports présents?
2. Lucide icons import complet?
3. Pas de typo dans les noms?
```

### Performance lente
```
Vérifier:
1. Images trop grosses?
2. Trop d'images téléchargées?
3. DevTools - Network tab lent?
```

---

## 📊 Métriques de test

### Couverture
- Fonctionnalités testées: 30+
- Scénarios de test: 50+
- Cas d'erreur: 10+
- Cas d'intégration: 5+

### Temps estimé
- Test complet: 30-45 minutes
- Test rapide: 10-15 minutes
- Test correctifs: 5-10 minutes

---

## 📝 Template de rapport de test

```markdown
# Rapport de test - [Date]

## Configuration
- Navigateur: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Backend: [Running/Not running]
- DevTools: [Errors/Warnings]

## Tests effectués
- [ ] Ouverture de l'éditeur
- [ ] Onglet Info Hero
- [ ] Onglet Détails
- [ ] Édition du titre
- [ ] Édition des images
- [ ] Modification du prix
- [ ] Ajout équipements
- [ ] Sauvegarde
- [ ] Affichage client
- [ ] Brouillons locaux

## Résultats
✅ SUCCÈS / ⚠️ AVERTISSEMENT / ❌ ÉCHEC

## Détails des problèmes
[Décrire les problèmes rencontrés]

## Correctifs appliqués
[Décrire les corrections]

## Signature
Test par: [Nom]
Date: [Date]
```

---

**Prêt pour les tests! 🚀**
