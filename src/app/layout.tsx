import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { GARAGE } from '@/lib/experience';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});

const SITE_URL = 'https://www.keyspneu77.fr';
const DESCRIPTION =
  "KEYSPNEU77 — Spécialiste du pneumatique à Montereau-Fault-Yonne (77). Pneus neufs et d'occasion toutes tailles à 70 € la paire, montés et équilibrés, et nettoyage intérieur de véhicule. Ouvert tous les jours de 9h30 à 20h.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KEYSPNEU77 — Spécialiste pneus à Montereau-Fault-Yonne (77)',
    template: '%s | KEYSPNEU77',
  },
  description: DESCRIPTION,
  authors: [{ name: GARAGE.name }],
  creator: GARAGE.name,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: GARAGE.name,
    title: 'KEYSPNEU77 — Le grip commence ici',
    description: DESCRIPTION,
    // Visuel réel de l'atelier (extrait de la vidéo 4K), et non un placeholder.
    images: [
      { url: '/media/posters/og.jpg', width: 1200, height: 630, alt: 'Atelier KEYSPNEU77' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KEYSPNEU77 — Le grip commence ici',
    description: DESCRIPTION,
    images: ['/media/posters/og.jpg'],
  },
  // MODE DÉMO () : la balise passe en noindex, en plus du
  // robots.txt. Les deux, parce qu’un robot qui arrive par un lien
  // direct ne relit pas forcément robots.txt. Voir src/app/robots.ts.
  robots:
    process.env.KEYS_DEMO === '1'
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
  category: 'automotive',
};

export const viewport: Viewport = {
  themeColor: '#060607',
  width: 'device-width',
  initialScale: 1,
};

/**
 * Les données structurées ne sont PAS déclarées ici.
 *
 * Elles l'étaient auparavant, ce qui injectait un bloc `AutoRepair` sur
 * *toutes* les routes — d'où deux blocs concurrents sur les pages qui
 * déclarent déjà les leurs. Ce bloc global contenait en outre des horaires
 * d'ouverture qu'aucune source fiable ne confirme (l'affiche photographiée
 * dans l'atelier annonce une ouverture le dimanche, ce que contredisait
 * cette déclaration).
 *
 * Chaque page porte donc désormais son propre JSON-LD, au plus près de ce
 * qu'elle affiche réellement.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${sora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
