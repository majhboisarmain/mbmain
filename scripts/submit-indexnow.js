const https = require('https');

const API_KEY = '1b5f69bb309f4e00a1ece5c05337ef60';
const HOST = 'majhboisar.in';
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;

// Comprehensive list of all high-value pages, categories, and verified businesses
const URLS_TO_INDEX = [
  `https://${HOST}`,
  `https://${HOST}/about`,
  `https://${HOST}/contact`,
  `https://${HOST}/claim-business`,
  `https://${HOST}/properties`,
  `https://${HOST}/hotels`,
  `https://${HOST}/register-business`,
  `https://${HOST}/services`,
  `https://${HOST}/food`,
  `https://${HOST}/resorts`,
  `https://${HOST}/jobs`,

  // Businesses
  `https://${HOST}/business/protein-house-boisar`,
  `https://${HOST}/business/protein-world-boisar`,
  `https://${HOST}/business/swami-samarth-finance-and-realty-boisar`,
  `https://${HOST}/business/kirti-enterprises-and-financial-advisor-pvt-ltd-boisar`,
  `https://${HOST}/business/muscle-factory-hub-boisar`,
  `https://${HOST}/business/musclefactoryhub-boisar`,
  `https://${HOST}/business/care-eyes-boisar`,
  `https://${HOST}/business/boisar-radium-art`,
  `https://${HOST}/business/ro-filter-service-and-sales-in-boisar-palghar-dahanu`,
  `https://${HOST}/business/ctes-english-medium-school-boisar`,

  // Core Categories
  `https://${HOST}/category/protein-supplements`,
  `https://${HOST}/category/protein-shop`,
  `https://${HOST}/category/gyms`,
  `https://${HOST}/category/business-loan`,
  `https://${HOST}/category/home-loan`,
  `https://${HOST}/category/personal-loan`,
  `https://${HOST}/category/loan-consultants`,
  `https://${HOST}/category/health-insurance`,
  `https://${HOST}/category/vehicle-insurance`,
  `https://${HOST}/category/digital-marketing`,
  `https://${HOST}/category/restaurants`,
  `https://${HOST}/category/doctors`,
  `https://${HOST}/category/hospitals`,
  `https://${HOST}/category/dentists`,
  `https://${HOST}/category/pathology`,
  `https://${HOST}/category/opticians`,
  `https://${HOST}/category/salons`,
  `https://${HOST}/category/water-purifier`,
  `https://${HOST}/category/mobile-shops-repair`,
  `https://${HOST}/category/real-estate-properties`,
  `https://${HOST}/category/hotels`,
  `https://${HOST}/category/resorts-villas`,
  `https://${HOST}/category/clothing-fashion`,
  `https://${HOST}/category/jewellery-ornaments`,
  `https://${HOST}/category/electricians-wiring`,
  `https://${HOST}/category/plumbers-sanitation`,
  `https://${HOST}/category/hardware-building-material`,
  `https://${HOST}/category/automobile-garages-repair`,
  `https://${HOST}/category/car-bike-rentals`,
  `https://${HOST}/category/schools-colleges`,
  `https://${HOST}/category/coaching-tuitions`,
  `https://${HOST}/category/ca-tax-consultants`,
  `https://${HOST}/category/photographers-videographers`,

  // Locations
  `https://${HOST}/location/boisar`,
  `https://${HOST}/location/boisar-west`,
  `https://${HOST}/location/boisar-east`,
  `https://${HOST}/location/tarapur`,
  `https://${HOST}/location/palghar`,
  `https://${HOST}/location/ostwal-empire`,
  `https://${HOST}/location/chitralaya`,

  // Boisar Direct Category routes
  `https://${HOST}/boisar/restaurants`,
  `https://${HOST}/boisar/doctors`,
  `https://${HOST}/boisar/hospitals`,
  `https://${HOST}/boisar/gyms`,
  `https://${HOST}/boisar/salons`,
  `https://${HOST}/boisar/mobile-shops`,
  `https://${HOST}/boisar/opticians`,
  `https://${HOST}/boisar/water-purifier`,
  `https://${HOST}/boisar/loan-consultants`,
  `https://${HOST}/boisar/schools`,
  `https://${HOST}/boisar/hardware`,
  `https://${HOST}/boisar/electricians`,
  `https://${HOST}/boisar/plumbers`
];

async function submitIndexNow(apiEndpoint) {
  const payload = JSON.stringify({
    host: HOST,
    key: API_KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS_TO_INDEX
  });

  return new Promise((resolve, reject) => {
    const url = new URL(apiEndpoint);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          endpoint: apiEndpoint,
          status: res.statusCode,
          statusMessage: res.statusMessage,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log(`Submitting ${URLS_TO_INDEX.length} URLs to IndexNow...`);

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (const ep of endpoints) {
    try {
      const res = await submitIndexNow(ep);
      console.log(`[${ep}] Status: ${res.status} (${res.statusMessage || 'OK'})`);
      if (res.status === 200 || res.status === 202) {
        console.log(`✅ Successfully submitted to ${ep}!`);
      } else {
        console.log(`ℹ️ Response:`, res.body || 'No body');
      }
    } catch (e) {
      console.error(`❌ Error submitting to ${ep}:`, e.message);
    }
  }
}

run();
