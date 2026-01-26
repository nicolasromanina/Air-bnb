# cmsApi — client CMS public

Ce fichier explique comment utiliser `src/services/cmsApi.ts` depuis vos pages publiques (Accueil, Services, Appartements, Détail appartement).

But
- Fournir des helpers simples et typés pour appeler les endpoints backend exposés sous `/api/*`.
- Permettre aux pages publiques de récupérer le contenu éditable (via l'admin) sans connaître l'implémentation du backend.

Import

Dans une page React, importez les fonctions nécessaires :

```ts
import cmsApi, { getSiteContent, getApartmentBySlug } from "@/services/cmsApi";
```

Exemples d'utilisation

- Récupérer le contenu du site (simple fetch)

```ts
// Dans un composant React (client-side)
useEffect(() => {
  let mounted = true;
  (async () => {
    try {
      const content = await getSiteContent();
      if (!mounted) return;
      setContent(content);
    } catch (err) {
      console.error("Erreur chargement contenu:", err);
    }
  })();
  return () => { mounted = false; };
}, []);
```

- Exemple pour une page `Services` (rendu basique)

```tsx
import { useEffect, useState } from "react";
import { getSiteContent } from "@/services/cmsApi";

export default function ServicesPage() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    getSiteContent().then(setContent).catch(console.error);
  }, []);

  if (!content) return <div>Chargement...</div>;

  return (
    <main>
      <h1>{content.services?.service1?.hero?.title?.join(" ")}</h1>
      <p>{content.services?.service1?.hero?.description}</p>
      {/* itérez sur sections/services selon `src/types/content.ts` */}
    </main>
  );
}
```

Utilisation recommandée avec React Query

Si vous utilisez `@tanstack/react-query` (recommandé pour cache/revalidation) :

```ts
import { useQuery } from "@tanstack/react-query";
import { getSiteContent } from "@/services/cmsApi";

export const useSiteContent = () =>
  useQuery({ queryKey: ["siteContent"], queryFn: getSiteContent, staleTime: 1000 * 60 * 5 });
```

Gestion d'erreurs

- `cmsApi` lève des erreurs `Error` avec un message clair lorsqu'un appel HTTP échoue. Entourez avec `try/catch` ou utilisez la gestion d'erreur de React Query.

Notes sur images

- `cmsApi.uploadImage` utilise `POST /api/images` et renvoie l'URL publique fournie par le backend.
- En local les images sont servies depuis `/uploads/` (voir `backend/.env.example` `UPLOAD_DIR`). En production remplacez par un stockage cloud si nécessaire.

Endpoints disponibles (résumé)

- `getSiteContent()` → GET `/api/content` — retourne `{ success: true, data }`.
- `getGuests(search?)` → GET `/api/guests` — liste des clients.
- `getReservations(params?)` → GET `/api/reservations`.
- `getPayments(params?)` → GET `/api/payments`.
- `getApartmentBySlug(slug)` → recherche dans `content.apartments.rooms`.
- `uploadImage(file)` → POST `/api/images` (FormData).
- `deleteImage(filename)` → DELETE `/api/images/:name`.

Bonnes pratiques

- Centralisez les appels via `cmsApi` pour faciliter futur remplacement (S3, CDN, auth, etc.).
- Utilisez React Query pour cache et invalidation.
- Validez les données côté UI selon `src/types/content.ts`.

Besoin d'exemples supplémentaires ? Dites quelle page publique vous voulez que j'implémente en priorité (ex. `Services`) et je fournis un composant complet réutilisant `cmsApi`.
