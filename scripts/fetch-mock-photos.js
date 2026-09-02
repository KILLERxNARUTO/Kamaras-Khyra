import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '..', 'public', 'assets');

const directories = [
  'story',
  'hero',
  'method',
  'team',
  'treatments',
  'before-after',
];

directories.forEach((dir) => {
  const fullPath = path.join(assetsDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

const imageMap = {
  // Story & Clinic Interior
  'story/philosophy-story.jpg': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
  'story/clinic-interior.jpg': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',

  // Hero Section
  'hero/hero-image-1.jpg': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
  'hero/hero-image-2.jpg': 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=1200&auto=format&fit=crop',
  'hero/hero-image-3.jpg': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',

  // Method Sequence
  'method/method-analysis.jpg': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
  'method/method-formulation.jpg': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop',
  'method/method-results.jpg': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop',

  // Team Profiles
  'team/team-photo-1.jpg': 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop',
  'team/team-photo-2.jpg': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop',
  'team/team-photo-3.jpg': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop',

  // Treatments Catalogue
  'treatments/treatment-aqua-360-medi-hydra-facial.jpg': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-acne-treat-medi-hydra-facial.jpg': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-zero-blemish-medi-hydra-facial.jpg': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-barrier-restore-medi-hydra-facial.jpg': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-radiance-glow-medi-hydra-facial.jpg': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-glow-dew-medi-hydra-facial.jpg': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-comedone-extraction-medi-hydra-facial.jpg': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-collagen-boost-medi-hydra-facial.jpg': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-aqua-glow-therapy.jpg': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-dermaplaning.jpg': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-skin-barrier-therapy.jpg': 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-hydra-lux-korean-glass-therapy.jpg': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop',
  'treatments/treatment-lip-plumper-treatment.jpg': 'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?q=80&w=800&auto=format&fit=crop',

  // Before / After Comparison Grid — Skincare & Haircare
  'before-after/before-after-1-before.jpg': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop',
  'before-after/before-after-1-after.jpg': 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
  
  'before-after/before-after-2-before.jpg': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
  'before-after/before-after-2-after.jpg': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
  
  'before-after/before-after-3-before.jpg': 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=800&auto=format&fit=crop',
  'before-after/before-after-3-after.jpg': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
  
  'before-after/before-after-4-before.jpg': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
  'before-after/before-after-4-after.jpg': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop',
  
  // Haircare Result 1
  'before-after/before-after-5-before.jpg': 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop', // Scalp & Hair before
  'before-after/before-after-5-after.jpg': 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop', // Scalp & Hair after
  
  // Haircare Result 2
  'before-after/before-after-6-before.jpg': 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop', // Hair volume before
  'before-after/before-after-6-after.jpg': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop', // Hair volume & shine after

  // Skincare Barrier Repair
  'before-after/before-after-7-before.jpg': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
  'before-after/before-after-7-after.jpg': 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop',

  // Skincare Anti-Ageing
  'before-after/before-after-8-before.jpg': 'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?q=80&w=800&auto=format&fit=crop',
  'before-after/before-after-8-after.jpg': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',

  // Haircare & Scalp Detox
  'before-after/before-after-9-before.jpg': 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800&auto=format&fit=crop',
  'before-after/before-after-9-after.jpg': 'https://images.unsplash.com/photo-1560869713-7d0a29430803?q=80&w=800&auto=format&fit=crop',
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading high-res mock photos for Kamars Khyra website...');
  const entries = Object.entries(imageMap);
  for (const [relPath, url] of entries) {
    const dest = path.join(assetsDir, relPath);
    try {
      await downloadFile(url, dest);
      console.log(`✓ Downloaded ${relPath}`);
    } catch (err) {
      console.error(`✗ Failed ${relPath}:`, err.message);
    }
  }
  console.log('All mock photos downloaded successfully!');
}

run();
