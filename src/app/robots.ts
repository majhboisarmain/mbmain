import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const allowedPaths = [
    '/',
    '/favicon.ico',
    '/favicon.png',
    '/favicon-48x48.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/icon.png',
    '/apple-touch-icon.png',
    '/manifest.json',
    '/business/',
    '/category/',
    '/location/',
    '/boisar/',
    '/services',
    '/food',
    '/hotels',
    '/resorts',
    '/properties',
    '/register-business',
    '/list-business',
    '/claim-business',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/jobs',
    '/hire-vehicle',
    '/blood-donation',
    '/home-services',
    '/creators',
    '/advertise',
  ];

  const disallowedPaths = [
    '/admin/',
    '/adminmb/',
    '/dashboard/',
    '/api/',
    '/search?',
    '/*?*sort=*',
    '/*?*filter=*',
    '/*?*utm_*',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: allowedPaths,
        disallow: disallowedPaths,
      },
      {
        userAgent: [
          'Googlebot', 
          'Bingbot', 
          'Googlebot-Image', 
          'Googlebot-Favicon', 
          'Google-Favicon',
          'Google-Extended',
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'PerplexityBot',
          'Applebot'
        ],
        allow: allowedPaths,
        disallow: disallowedPaths,
      },
    ],
    sitemap: [
      'https://majhboisar.in/sitemap.xml',
      'https://majhboisar.in/sitemap-businesses.xml',
      'https://majhboisar.in/sitemap-categories.xml',
      'https://majhboisar.in/sitemap-locations.xml',
    ],
    host: 'https://majhboisar.in',
  };
}
