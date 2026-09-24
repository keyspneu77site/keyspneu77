/**
 * KEYSPNEU77 — Données centralisées du site.
 * Tout est modifiable ici : coordonnées, services, marques, avis, navigation.
 */

export const BRAND = {
  name: 'KEYSPNEU77',
  legalName: 'KEYSPNEU 77',
  shortName: 'Keys Pneu 77',
  tagline: 'La clé de votre sécurité',
  baseline: 'Les pneus à disposition',
  // Slogan principal — nerveux, premium, mémorisable
  slogan: {
    line1: 'Le grip',
    line2: 'commence ici',
  },
  sloganAlt: 'Puissance. Précision. Adhérence.',
  phone: '07 58 47 75 00',
  phoneRaw: '+33758477500',
  whatsapp: '+33758477500', // à confirmer plus tard
  address: {
    street: '10 Rue de la Maison Garnier',
    zip: '77130',
    city: 'Montereau-Fault-Yonne',
    region: 'Seine-et-Marne',
    country: 'France',
  },
  maps: 'https://www.google.com/maps/search/?api=1&query=10+Rue+de+la+Maison+Garnier+77130+Montereau-Fault-Yonne',
  hours: [
    { day: 'Lundi — Vendredi', value: '08h30 — 19h00' },
    { day: 'Samedi', value: '09h00 — 18h00' },
    { day: 'Dimanche', value: 'Fermé' },
  ],
  socials: [
    { name: 'Instagram', href: '#', handle: '@keyspneu77' },
    { name: 'TikTok', href: '#', handle: '@keyspneu77' },
    { name: 'Snapchat', href: '#', handle: 'keyspneu77' },
  ],
} as const;

export const NAV_LINKS = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Nos marques', href: '#marques' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Pourquoi nous', href: '#pourquoi' },
  // « Avis » retiré : la section correspondante affichait des témoignages
  // fictifs et a été supprimée. Le lien pointait donc vers une ancre morte.
  { label: 'Contact', href: '#contact' },
] as const;

export type Service = {
  id: string;
  title: string;
  desc: string;
  icon: string; // clé d'icône Lucide
  tag: string;
};

export const SERVICES: Service[] = [
  {
    id: 'pneus-neufs',
    title: 'Pneus neufs',
    desc: "Un catalogue premium des plus grandes marques mondiales. Le pneu exact pour votre véhicule, monté le jour même.",
    icon: 'CircleDot',
    tag: 'Vente',
  },
  {
    id: 'pneus-occasion',
    title: "Pneus d'occasion",
    desc: "Des pneus contrôlés, sélectionnés et garantis. La performance au meilleur prix, sans compromis sur la sécurité.",
    icon: 'Recycle',
    tag: 'Vente',
  },
  {
    id: 'montage',
    title: 'Montage',
    desc: "Démontage et montage de précision sur machines dernière génération. Zéro rayure, zéro compromis.",
    icon: 'Wrench',
    tag: 'Atelier',
  },
  {
    id: 'equilibrage',
    title: 'Équilibrage',
    desc: "Équilibrage haute précision pour une tenue de route parfaite. Fini les vibrations, place au confort.",
    icon: 'Gauge',
    tag: 'Atelier',
  },
  {
    id: 'geometrie',
    title: 'Géométrie / Parallélisme',
    desc: "Réglage millimétré de vos trains roulants. Une trajectoire droite, une usure maîtrisée, un grip optimal.",
    icon: 'Crosshair',
    tag: 'Précision',
  },
  {
    id: 'reparation',
    title: 'Réparation',
    desc: "Crevaison, perte de pression, valve : diagnostic rapide et réparation durable dans les règles de l'art.",
    icon: 'ShieldCheck',
    tag: 'Atelier',
  },
  {
    id: 'nettoyage',
    title: 'Nettoyage intérieur',
    desc: "Un habitacle comme neuf pendant que l'on s'occupe de vos pneus. Le détail qui change tout.",
    icon: 'Sparkles',
    tag: 'Détailing',
  },
];

export type Brand = {
  name: string;
  // Le logo est rendu en typographie stylisée (aucun asset externe requis)
};

// Ajoutez / retirez simplement une marque de ce tableau.
export const BRANDS: Brand[] = [
  { name: 'Michelin' },
  { name: 'Continental' },
  { name: 'Bridgestone' },
  { name: 'Hankook' },
];

export type Reason = {
  title: string;
  desc: string;
  icon: string;
  stat?: string;
};

export const REASONS: Reason[] = [
  {
    title: 'Intervention rapide',
    desc: "Votre temps compte. La plupart des prestations sont réalisées pendant que vous patientez.",
    icon: 'Timer',
    stat: '30 min',
  },
  {
    title: 'Travail soigné',
    desc: "Chaque geste est maîtrisé. Un rendu impeccable, contrôlé pièce par pièce.",
    icon: 'BadgeCheck',
    stat: '100 %',
  },
  {
    title: 'Équipement professionnel',
    desc: "Des machines dernière génération pour un montage et un équilibrage d'une précision absolue.",
    icon: 'Cog',
    stat: 'Pro',
  },
  {
    title: 'Conseils personnalisés',
    desc: "On vous oriente vers le pneu réellement adapté à votre conduite et à votre budget.",
    icon: 'MessagesSquare',
    stat: '1:1',
  },
  {
    title: 'Prix compétitifs',
    desc: "Le juste prix, toujours. Des tarifs clairs, sans mauvaise surprise.",
    icon: 'Tags',
    stat: '€€',
  },
  {
    title: 'Qualité garantie',
    desc: "Notre nom sur chaque prestation. Votre sécurité est notre signature.",
    icon: 'Award',
    stat: '★',
  },
];

export type Review = {
  name: string;
  city: string;
  text: string;
  rating: number;
  initials: string;
};

// Faux avis — à remplacer plus tard par de vrais témoignages.
export const REVIEWS: Review[] = [
  {
    name: 'Karim B.',
    city: 'Montereau',
    initials: 'KB',
    rating: 5,
    text: "Accueil au top, montage et équilibrage en 25 minutes chrono. Prix imbattables et vrai conseil. Je ne vais plus ailleurs.",
  },
  {
    name: 'Sophie L.',
    city: 'Fontainebleau',
    initials: 'SL',
    rating: 5,
    text: "Enfin un garage pneus qui inspire confiance. Local impeccable, équipe pro, travail nickel. Je recommande à 200 %.",
  },
  {
    name: 'Anthony R.',
    city: 'Nemours',
    initials: 'AR',
    rating: 5,
    text: "Pneus d'occasion comme neufs, testés devant moi. Sérieux et transparent, ça fait plaisir. Bravo.",
  },
  {
    name: 'Mélanie D.',
    city: 'Moret-sur-Loing',
    initials: 'MD',
    rating: 5,
    text: "Géométrie parfaite, ma voiture ne tire plus du tout. Service rapide et souriant. Un vrai savoir-faire.",
  },
  {
    name: 'Yanis T.',
    city: 'Provins',
    initials: 'YT',
    rating: 5,
    text: "Le rapport qualité / prix est incroyable. On sent la passion du travail bien fait. Adhérence parfaite depuis.",
  },
  {
    name: 'Claire M.',
    city: 'Montereau',
    initials: 'CM',
    rating: 5,
    text: "Rapide, propre, honnête. On m'a même nettoyé l'intérieur. Une expérience premium de A à Z.",
  },
];
