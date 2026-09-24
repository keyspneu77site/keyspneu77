import type { Metadata } from 'next';
import { GARAGE, SERVICES, SOCIALS } from '@/lib/experience';
import GarageExperience from '@/components/experience/GarageExperience';

const SITE_URL = 'https://www.keyspneu77.fr';
const DESCRIPTION = `${GARAGE.name} — spécialiste du pneumatique à ${GARAGE.address.city}. Pneus neufs et d'occasion toutes tailles à 70 € la paire, montés et équilibrés, et nettoyage intérieur de véhicule. Ouvert tous les jours.`;

export const metadata: Metadata = {
  title: `${GARAGE.name} — Pneus, montage et équilibrage à ${GARAGE.address.city}`,
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: GARAGE.name,
    title: `${GARAGE.name} — ${GARAGE.slogan}`,
    description: DESCRIPTION,
    images: [
      {
        url: '/media/posters/og.jpg',
        width: 1200,
        height: 630,
        alt: `Atelier ${GARAGE.name} à ${GARAGE.address.city}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${GARAGE.name} — ${GARAGE.slogan}`,
    description: DESCRIPTION,
    images: ['/media/posters/og.jpg'],
  },
};

/**
 * Données structurées locales.
 *
 * Les horaires y figurent depuis le 19/09 : ils sont désormais vérifiés
 * (fiche Google Maps du garage).
 *
 * LA NOTE ET LES AVIS N'Y SONT VOLONTAIREMENT PAS.
 * Le site affiche bien les avis Google, mais les déclarer ici en
 * `aggregateRating` / `review` serait contraire aux règles de Google sur les
 * extraits d'avis : un site ne peut baliser que les avis collectés sur ce
 * site, jamais ceux agrégés depuis une autre plateforme. Le faire expose à
 * une action manuelle, et Google connaît déjà cette note — c'est la sienne.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: GARAGE.name,
  slogan: GARAGE.slogan,
  description: DESCRIPTION,
  url: SITE_URL,
  telephone: '+33758477500',
  image: `${SITE_URL}/media/posters/og.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: GARAGE.address.street,
    postalCode: GARAGE.address.zip,
    addressLocality: GARAGE.address.city,
    addressRegion: GARAGE.address.region,
    addressCountry: 'FR',
  },
  areaServed: GARAGE.address.city,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:30',
      closes: '20:00',
    },
  ],
  sameAs: SOCIALS.map((s) => s.href),
  makesOffer: SERVICES.map((s) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: s.label, description: s.detail },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GarageExperience />
    </>
  );
}
