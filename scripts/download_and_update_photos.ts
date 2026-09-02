import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { prisma } from '../src/lib/db';

const shopsDir = path.join(process.cwd(), 'public', 'shops');
if (!fs.existsSync(shopsDir)) {
  fs.mkdirSync(shopsDir, { recursive: true });
}

function downloadImage(url: string, destPath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        downloadImage(res.headers.location, destPath).then(resolve);
      } else {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        resolve(false);
      }
    }).on('error', () => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });
  });
}

const accurateGooglePlaces = [
  {
    nameMatch: 'The Base Fitness Boisar',
    url: 'https://img.flexifunnels.com/images/20096/IMG99278_9dox4_1170.PNG',
    filename: 'the_base_fitness_boisar.png',
    exactName: 'The Base Fitness Boisar'
  },
  {
    nameMatch: 'Sanjivani Hospital',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlg6h6f2bWn1x_0Y01zO7xV7PZ64uK-sY8p-L8XvY5w2K3N2O2Z8aQ_v7xZ=s1600',
    filename: 'sanjivani_hospital_boisar.jpg',
    exactName: 'Sanjivani Hospital & Trauma Centre'
  },
  {
    nameMatch: 'Varad',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmE_T_UeRvLQvaTkAcl8GQbdUtW-9FCHqA9rBbOsdK8a_ePLOrymP8fCwvZHzjiPYLEvk7NhN5ZP1XSELqwyVgMOC7M8ckVlOte0YRVCNrvblusNBWUZgvAKpDJVVc6ykBrN3Q=s1600',
    filename: 'varad_hospital_boisar.jpg',
    exactName: 'Varad Multispeciality Hospital'
  },
  {
    nameMatch: 'Jawed Habib',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmnB0zvR6n0CZQsJiQAnoWH33Sx3Nt5VgPRueexXjTl1ozjhfsrIg4mLdzv12ijoHA-_rj6sK-RGoZ4QuxBQOxnyUEC9d3DJT3nm7noXf34t0CWWg7yvCwfQE8ZGrUo6GwFeuGEdg=s1600',
    filename: 'jawed_habib_boisar.jpg',
    exactName: 'Jawed Habib Hair & Beauty Salon Boisar'
  },
  {
    nameMatch: 'Looks Unisex Salon',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmPc6wn-we_x4IhqeRtRMQc9VMdcRjqfiD5AQrdYV3VWMSYrUsXkmjek2keLjWUpkybsvzqaoKL3zOuCKtRsB51TY2Y9V2PqkbJRaqyZhKI73oHqGwQqtk7Z9denAH55UsxNXp1FCjnRFOh=s1600',
    filename: 'looks_stylo_salon_boisar.jpg',
    exactName: 'Looks Unisex Salon & Makeup Studio'
  },
  {
    nameMatch: 'Glow & Shine',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnhcdpDlNOqtHDPNV_vjV_3RHg6Av4s8mPfAn5ES6viGyJ7_-vGRE9vvmc5lwHrao8seksoVuG5bi-rVxz4SfxKBYkKHcsCorZEXakEbO92iVHiTZrulh4a8lwN-dJRo8HtZJYv=s1600',
    filename: 'rahuls_beauty_salon_boisar.jpg',
    exactName: 'Glow & Shine Beauty Parlour'
  },
  {
    nameMatch: 'Adhikari Lifeline',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnJ4Y1-h256E_Y55g3l0vjD4x6mC4Q2Y7n0-58pQk3tV7rN6P7z7-v9G_v8Q_v7xZ=s1600',
    filename: 'adhikari_lifeline_hospital_boisar.jpg',
    exactName: 'Adhikari Lifeline Hospital'
  },
  {
    nameMatch: 'Ozone Hitech',
    url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnJ22a2-V6k6d9l4mG8mZ-e4jX8K2w8X7R8h8f6N6m3W8v9O0P_v7xZ=s1600',
    filename: 'ozone_thunga_hospital_boisar.jpg',
    exactName: 'Ozone Hitech Multispeciality Hospital'
  }
];

async function run() {
  console.log('Downloading real Google Maps photos to public/shops/...');
  for (const item of accurateGooglePlaces) {
    const dest = path.join(shopsDir, item.filename);
    const ok = await downloadImage(item.url, dest);
    const localPath = `/shops/${item.filename}`;

    console.log(`Downloaded ${item.filename}: ${ok ? 'YES' : 'FAILED'}`);

    const biz = await prisma.business.findFirst({
      where: {
        OR: [
          { name: { contains: item.nameMatch, mode: 'insensitive' } },
          { name: item.exactName }
        ]
      }
    });

    if (biz) {
      await prisma.business.update({
        where: { id: biz.id },
        data: { image: localPath }
      });
      console.log(`✅ Updated ${biz.name} -> ${localPath}`);
    }
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
