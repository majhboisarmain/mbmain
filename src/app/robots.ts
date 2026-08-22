import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'anthropic-ai', 'cohere-ai'],
        allow: '/',
        disallow: ['/admin/', '/dashboard/'],
      }
    ],
    sitemap: 'https://majhboisar.in/sitemap.xml',
  };
}
