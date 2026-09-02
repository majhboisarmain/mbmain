import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/business/',
          '/category/',
          '/services',
          '/food',
          '/hotels',
          '/resorts',
          '/properties',
          '/jobs',
          '/hire-vehicle',
          '/blood-donation',
          '/home-services',
          '/creators',
          '/advertise',
        ],
        disallow: [
          '/admin/',
          '/adminmb/',
          '/dashboard/',
          '/api/',
          '/search?', // Don't let search query spam consume crawl budget
          '/*?*sort=*',
          '/*?*filter=*',
        ],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: [
          '/',
          '/business/',
          '/category/',
          '/services',
          '/food',
          '/hotels',
          '/resorts',
          '/properties',
          '/jobs',
          '/hire-vehicle',
          '/blood-donation',
        ],
        disallow: [
          '/admin/',
          '/adminmb/',
          '/dashboard/',
          '/api/',
          '/search?',
        ],
      },
    ],
    sitemap: 'https://majhboisar.in/sitemap.xml',
    host: 'https://majhboisar.in',
  };
}
