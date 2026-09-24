import type { MetadataRoute } from 'next';

// Généré une fois au build : requis par l'export statique (output: 'export').
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.keyspneu77.fr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
