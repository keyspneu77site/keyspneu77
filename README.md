# KEYSPNEU77 — Site vitrine premium

Site cinématique et immersif pour **KEYSPNEU77**, spécialiste du pneumatique à
Montereau-Fault-Yonne (77). Next.js 15 · TypeScript · Tailwind v4 · GSAP · Framer
Motion (motion) · Lenis · Lucide.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # export statique dans out/
npm run deploy   # build + mise en ligne sur Cloudflare
```

## Tout se personnalise dans un seul fichier

`src/lib/data.ts` centralise **toutes** les infos : coordonnées, horaires,
services, marques, avis, liens réseaux, slogan.

### Ajouter / retirer une marque
```ts
// src/lib/data.ts
export const BRANDS = [
  { name: 'Michelin' },
  { name: 'Pirelli' },   // ← ajoutez simplement une ligne
];
```

### Brancher les réseaux sociaux
Remplacez les `href: '#'` dans `BRAND.socials` par les vraies URL Instagram /
TikTok / Snapchat.

### Activer WhatsApp
Le numéro `BRAND.whatsapp` est déjà pré-rempli. Vérifiez / corrigez-le au format
international (`+33...`) — le bouton fonctionne automatiquement.

## Remplacer les visuels

Les images sont dans `public/images/` :
- `logo.jpg` — logo (référence couleurs)
- `atelier.jpg` — intérieur (Hero + Galerie)
- `facade.jpg` — devanture (Galerie + Open Graph)

Déposez de nouvelles photos en gardant les mêmes noms, ou ajoutez des tuiles dans
`TILES` (`src/components/Gallery.tsx`).

## Remplacer le fond animé du Hero par une vraie vidéo

Le fond du Hero est un `<canvas>` (`HeroBackground.tsx`) volontairement conçu
pour être remplacé. Dans `src/components/Hero.tsx`, à l'intérieur de
`.hero-media`, remplacez le bloc `<Image>` par :

```tsx
<video
  autoPlay muted loop playsInline
  className="h-full w-full object-cover opacity-60"
  poster="/images/atelier.jpg"
>
  <source src="/videos/hero.mp4" type="video/mp4" />
</video>
```

et supprimez `<HeroBackground />` si vous ne voulez plus les particules par-dessus.

## Points forts techniques

- **Loader** cinématique (pneu qui tourne + compteur).
- **Effet caméra** au scroll (Hero qui zoome/floute), parallaxe, reveals GSAP.
- **Curseur personnalisé** magnétique (desktop), boutons magnétiques, cartes 3D tilt.
- **SEO** : metadata complètes, Open Graph, JSON-LD `AutoRepair`, `sitemap.xml`, `robots.txt`.
- **Accessibilité** : `prefers-reduced-motion` respecté, contenu rendu côté serveur.
- **Performances** : ~217 kB First Load JS, images AVIF/WebP, canvas plafonné à 60 FPS.
```
