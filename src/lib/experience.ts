/**
 * KEYSPNEU77 — Données de l'expérience immersive.
 *
 * RÈGLE DE CE FICHIER : rien n'est inventé.
 * Chaque valeur vient soit du brief client, soit d'un document réel
 * (flyer, enseigne, fiche Google Maps, profil Snapchat).
 *
 * ---------------------------------------------------------------------------
 * 2026-09-19 — LES DONNÉES RÉELLES SONT ARRIVÉES.
 * Sept captures fournies par le client (flyers pneus et nettoyage, photo de
 * l'enseigne, fiche Google Maps, avis Google, profil Snapchat) ont permis de
 * trancher ce qui était en suspens depuis le 18/09 :
 *  - adresse  → « 8 Rue de la Maison Garnier » confirmé par la fiche Google
 *               ET par les deux flyers. L'ancien « 10 » était faux.
 *  - horaires → « Lun–Dim 9h30–20h », horaires publiés sur la fiche Google.
 *               Choix explicite du client le 19/09 : c'est ce que voit le
 *               visiteur qui cherche « pneus Montereau », donc ça fait foi.
 *               Les flyers imprimés annoncent « mardi–dimanche 10h–19h » et
 *               l'affiche nettoyage « dimanche jusqu'à 21h » : périmés.
 *  - avis     → 4,9 ★ sur 34 avis, fiche Google du 19/09.
 *
 * PRESTATIONS RETIRÉES le 19/09 à la demande du client : équilibrage (en tant
 * que prestation autonome), parallélisme / géométrie, réparation de pneus.
 * L'équilibrage n'est PAS supprimé du discours : tous les supports disent
 * « montage et équilibrage inclus ». Il reste donc une mention rattachée au
 * montage, pas une ligne de la liste des services.
 * ---------------------------------------------------------------------------
 *
 * 2026-09-18 — LES PHOTOS DE L'ATELIER ONT ÉTÉ RETIRÉES DU SITE.
 * Les 52 clichés sont des prises de vue au téléphone : cartons au sol,
 * affiches coupées par le cadre, bâche froissée, éclairage dur. En plein
 * cadre, ils faisaient chuter la qualité perçue de la page entière.
 * Ils restent dans `public/media/photos/` — rien n'a été supprimé du disque —
 * mais plus aucun composant n'y touche.
 */

export const GARAGE = {
  name: 'KEYSPNEU77',
  slogan: 'Le grip commence ici',
  /** Baseline lisible sur l'enseigne de la façade. */
  baseline: 'La clé de votre sécurité',
  phone: '07 58 47 75 00',
  phoneHref: 'tel:+33758477500',
  /** Format international sans séparateur — requis par les liens WhatsApp / SMS. */
  phoneE164: '33758477500',
  /** Adresse confirmée par la fiche Google Maps et les deux flyers. */
  address: {
    street: '8 Rue de la Maison Garnier',
    zip: '77130',
    city: 'Montereau-Fault-Yonne',
    region: 'Île-de-France',
  },
  mapsHref:
    'https://www.google.com/maps/dir/?api=1&destination=8+Rue+de+la+Maison+Garnier+77130+Montereau-Fault-Yonne',
} as const;

/**
 * Horaires publiés sur la fiche Google Maps (relevé du 19/09/2026).
 * Un seul créneau, sept jours sur sept : pas de tableau à rallonge.
 */
export const HORAIRES = {
  resume: 'Tous les jours, 9h30 – 20h',
  jours: 'Lundi – Dimanche',
  creneau: '9h30 – 20h',
} as const;

/**
 * Réseaux sociaux — comptes relevés sur le flyer et vérifiés sur le profil.
 * Snapchat est le canal de contact le plus actif du garage (946 abonnés).
 */
export const SOCIALS = [
  {
    id: 'snapchat',
    label: 'Snapchat',
    handle: 'keyspneu',
    href: 'https://www.snapchat.com/add/keyspneu',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    handle: 'keyspneu77',
    href: 'https://www.tiktok.com/@keyspneu77',
  },
] as const;

/**
 * Les 4 prestations réellement proposées.
 *
 * ⚠️ Liste volontairement courte. Trois lignes ont été retirées le 19/09
 * (équilibrage seul, parallélisme / géométrie, réparation) : le garage ne les
 * vend pas séparément. Ne pas les réintroduire sans demande explicite.
 */
export const SERVICES = [
  {
    id: 'neufs',
    label: 'Pneus neufs',
    detail: 'Grandes marques, du 13 au 21 pouces, large stock disponible.',
  },
  {
    id: 'occasion',
    label: "Pneus d'occasion",
    detail: 'Contrôlés et testés en machine avant chaque pose.',
  },
  {
    id: 'montage',
    label: 'Montage',
    detail: 'Montage rapide, équilibrage haute précision inclus, pression contrôlée.',
  },
  {
    id: 'nettoyage',
    label: 'Nettoyage intérieur',
    detail: 'À l’atelier ou à domicile, sur Montereau et alentours.',
  },
] as const;

/** Arguments imprimés sur le flyer pneus — repris mot pour mot. */
export const ARGUMENTS_PNEUS = [
  'Pneus de grandes marques',
  'Contrôlés et testés en machine',
  'Montage et équilibrage inclus',
  'Large stock disponible',
] as const;

/**
 * Les étapes que traverse chaque roue, affichées dans la scène « Atelier ».
 *
 * ⚠️ Ce sont des ÉTAPES DU TRAVAIL, pas des prestations vendues séparément
 * — ne pas les confondre avec SERVICES ci-dessus.
 *
 * Elles étaient écrites en dur dans GarageExperience.tsx : c'est ce qui leur
 * a fait manquer le nettoyage du 19/09, où « Géométrie » et « Réparation »
 * sont restées affichées en clair sur l'accueil alors que les deux
 * prestations avaient été retirées. Le contenu se modifie ici, jamais dans
 * un composant.
 */
export const ETAPES_ATELIER = [
  'Démontage',
  'Montage',
  'Équilibrage',
  'Contrôle de pression',
] as const;

/**
 * Tarifs RÉELS, relevés sur les flyers fournis par le client le 19/09.
 * Une seule source d'édition : tout changement de prix se fait ici.
 */
export const TARIFS = {
  pneus: {
    paire: {
      prix: '70 €',
      label: 'La paire de pneus',
      mention: 'Montée et équilibrée',
      /** Le flyer affiche le même prix pour les trois tranches de taille. */
      tailles: 'Toutes tailles, du 13 au 21 pouces',
    },
    /** Annoncé dans la biographie Snapchat du garage. */
    quatre: { prix: '140 €', label: 'Les quatre pneus', mention: 'Montés et équilibrés' },
  },
  nettoyage: {
    formules: [
      {
        formule: 'Essentielle',
        prix: '35 €',
        prestations: [
          'Aspiration complète de l’habitacle',
          'Nettoyage des plastiques (tableau de bord, console centrale, panneaux de portes)',
        ],
      },
      {
        formule: 'Confort',
        prix: '60 €',
        prestations: [
          'Aspiration complète de l’habitacle',
          'Nettoyage complet des plastiques',
          'Nettoyage des sièges (tissu)',
        ],
      },
      {
        formule: 'Premium',
        prix: '80 €',
        prestations: [
          'Aspiration complète de l’habitacle',
          'Nettoyage complet des plastiques',
          'Nettoyage des sièges (tissu)',
          'Shampouinage des tapis',
          'Nettoyage des contours de portes et du contour de coffre',
          'Finitions complètes',
        ],
      },
    ],
    supplements: [
      { label: 'Véhicule très sale', prix: '+20 €' },
      { label: 'Traitement cuir & alcantara', prix: '+15 €' },
    ],
    domicile: 'Déplacement à domicile sur Montereau et alentours',
  },
} as const;

/**
 * Nettoyage — preuves avant / après, filmées à l'atelier le 20/09/2026.
 *
 * Trois véhicules réels, six plans (`1.1/2026-09-20 09.19→09.20.*.mov`).
 * Les originaux ne sont pas touchés : `public/media/nettoyage/` contient des
 * copies ré-encodées (H.264, sans son, coupées à ~5 s, poster WebP).
 *
 * ⚠️ AUCUNE RETOUCHE COLORIMÉTRIQUE n'est appliquée, ni à l'avant ni à
 * l'après : sur une preuve commerciale, corriger l'après reviendrait à
 * truquer le résultat. Les six plans sortent du même encodage, à l'identique.
 *
 * POURQUOI DEUX VIDÉOS CÔTE À CÔTE ET PAS UN CURSEUR DE COMPARAISON :
 * le curseur (wipe) suppose deux plans au cadrage identique, tournés sur
 * trépied. Ici tout est à main levée, avec des angles et des trajectoires
 * différents entre l'avant et l'après — un wipe donnerait une bouillie.
 *
 * Limite assumée : les six plans sont en 480x854 (source déjà compressée).
 * C'est suffisant dans une carte de ~300 px de large, pas au-delà. Ne jamais
 * les passer en plein cadre, et ne pas les agrandir : voir [[media-audit]].
 *
 * Pour ajouter un véhicule : encoder deux copies dans
 * `public/media/nettoyage/`, ajouter une entrée ici. Rien d'autre à toucher.
 */
export type PreuveNettoyage = {
  id: string;
  /** Ce qu'on voit, décrit sans promesse chiffrée. */
  vehicule: string;
  avant: { src: string; poster: string; alt: string };
  apres: { src: string; poster: string; alt: string };
};

export const NETTOYAGE_AVANT_APRES: PreuveNettoyage[] = [
  {
    id: 'bleue',
    vehicule: 'Citadine bleue',
    avant: {
      src: '/media/nettoyage/bleue-avant.mp4',
      poster: '/media/nettoyage/bleue-avant.webp',
      alt: 'Avant : habitacle d’une citadine bleue, sièges et tapis tachés.',
    },
    apres: {
      src: '/media/nettoyage/bleue-apres.mp4',
      poster: '/media/nettoyage/bleue-apres.webp',
      alt: 'Après : le même habitacle nettoyé, protections papier au sol.',
    },
  },
  {
    id: 'blanche',
    vehicule: 'Monospace blanc',
    avant: {
      src: '/media/nettoyage/blanche-avant.mp4',
      poster: '/media/nettoyage/blanche-avant.webp',
      alt: 'Avant : intérieur d’un monospace blanc, miettes au sol et dans le coffre.',
    },
    apres: {
      src: '/media/nettoyage/blanche-apres.mp4',
      poster: '/media/nettoyage/blanche-apres.webp',
      alt: 'Après : le même intérieur aspiré, sièges et coffre nets.',
    },
  },
  {
    id: 'noire',
    vehicule: 'Berline noire',
    avant: {
      src: '/media/nettoyage/noire-avant.mp4',
      poster: '/media/nettoyage/noire-avant.webp',
      alt: 'Avant : siège d’une berline noire, aliment renversé sur l’assise.',
    },
    apres: {
      src: '/media/nettoyage/noire-apres.mp4',
      poster: '/media/nettoyage/noire-apres.webp',
      alt: 'Après : le même siège nettoyé, habitacle remis en état.',
    },
  },
];

/**
 * Avis Google — relevé manuel du 19/09/2026.
 *
 * POURQUOI EN DUR, ET PAS L'API GOOGLE PLACES :
 * choix du client le 19/09. L'API exige une clé Google Cloud avec moyen de
 * paiement, est facturée à l'appel, et ne renvoie que 5 avis sur les 34.
 * Pour rafraîchir : relever la note, le total et les avis sur la fiche, puis
 * mettre à jour ce bloc. Rien d'autre à toucher.
 *
 * ⚠️ NE JAMAIS inventer ni reformuler un avis : ce sont des propos réels de
 * personnes réelles. Les textes ci-dessous sont recopiés tels quels ; ceux qui
 * étaient tronqués par l'interface Google le restent (marqués `tronque`).
 */
export const AVIS = {
  note: '4,9',
  total: 34,
  /**
   * Lien « Rédiger un avis ».
   *
   * Il n'existe AUCUN moyen de publier un avis sur Google depuis un site :
   * pas d'API en écriture, et c'est contraire aux conditions Google. Le seul
   * circuit légitime est d'envoyer le visiteur sur le formulaire officiel,
   * connecté à son compte Google.
   *
   * Ce lien de recherche fonctionne tel quel. Pour ouvrir le formulaire
   * d'écriture en un seul clic au lieu de deux, renseigner `placeId`
   * (relevable sur https://developers.google.com/maps/documentation/places/web-service/place-id)
   * et le lien direct sera utilisé automatiquement.
   */
  placeId: '' as string,
  rechercheHref:
    'https://www.google.com/maps/search/?api=1&query=KEYSPNEU+77+Pneus+Nettoyage+Auto+Montereau-Fault-Yonne',
  liste: [
    {
      auteur: 'énergie CHK',
      note: 5,
      date: '8 août 2026',
      texte:
        'Très satisfait de mon passage dans ce garage pour le changement de mes pneus. Accueil chaleureux, équipe professionnelle, travail rapide et soigné. Personnel sérieux et de bon conseil. Je recommande ce garage sans hésitation et je revi',
      tronque: true,
    },
    {
      auteur: 'Yassine NAHARI',
      note: 5,
      date: '1 septembre 2026',
      texte:
        'Très satisfait du service ! Travail rapide, professionnel et soigné. La personne est très sympathique, sérieuse et efficace. Le changement de pneus s’est fait rapidement et sans aucun problème.',
      tronque: true,
    },
    {
      auteur: 'Anais Cbn',
      note: 5,
      date: '30 août 2026',
      texte:
        'Merci à l’équipe incroyable de KEYSPNEU, le service le conseil et la prestation et surtout le prix des pneu très raisonnable m’ont conquise. Je suis satisfaite et serais cliente fidèle de ce garage.',
      tronque: true,
    },
  ],
} as const;

/** Lien réellement utilisé par le bouton « Laisser un avis ». */
export const avisGoogleHref = (): string =>
  AVIS.placeId
    ? `https://search.google.com/local/writereview?placeid=${AVIS.placeId}`
    : AVIS.rechercheHref;

/**
 * Prise de rendez-vous.
 *
 * AUCUN SERVEUR N'EST REQUIS : le formulaire compose un message et ouvre
 * WhatsApp ou l'application SMS du visiteur, pré-remplis. Le site reste
 * hébergeable en statique (Cloudflare Pages) et il n'y a ni base de données,
 * ni clé d'API, ni données personnelles stockées quelque part.
 *
 * Pour passer plus tard à un envoi serveur (mail, Formspree, route API),
 * il suffit de brancher `RendezVous.tsx` sur un endpoint : le reste du
 * formulaire — champs, validation, message composé — ne bouge pas.
 */
export const PRESTATIONS_RDV = [
  'Pneus neufs',
  "Pneus d'occasion",
  'Montage / équilibrage',
  'Nettoyage intérieur',
  'Autre / je ne sais pas',
] as const;

export type Brand = {
  name: string;
  /**
   * Chemin d'un logo officiel dans `public/`, ex. '/media/brands/michelin.svg'.
   * Tant qu'il est absent, la plaque 3D affiche le nom en typographie.
   * AUCUN logo n'est redessiné ni approximé : ce serait faux.
   */
  logo?: string;
};

/**
 * Marques montées à l'atelier — liste du brief client.
 * Pour ajouter une marque, ajouter une ligne ici, rien d'autre.
 */
export const BRANDS: Brand[] = [
  { name: 'Michelin' },
  { name: 'Continental' },
  { name: 'Bridgestone' },
  { name: 'Hankook' },
];

/** Séquence d'images extraite de la vidéo 4K (2026-09-12 13.43.08.mov). */
export const SEQUENCE = {
  desktop: { dir: '/proto/desktop2', count: 319 },
  mobile: { dir: '/proto/mobile2', count: 255 },
  poster: '/media/posters/entree-1600.webp',
} as const;

export type SceneId =
  | 'entree'
  | 'atelier'
  | 'pneus'
  | 'marques'
  | 'services'
  | 'avis'
  | 'contact';

export type Scene = { id: SceneId; index: number; nav: string };

export const SCENES: Scene[] = [
  { id: 'entree', index: 1, nav: 'Entrée' },
  { id: 'atelier', index: 2, nav: 'Atelier' },
  { id: 'pneus', index: 3, nav: 'Pneus' },
  { id: 'marques', index: 4, nav: 'Marques' },
  { id: 'services', index: 5, nav: 'Services' },
  { id: 'avis', index: 6, nav: 'Avis' },
  { id: 'contact', index: 7, nav: 'Rendez-vous' },
];
