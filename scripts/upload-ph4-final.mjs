import { storagePut } from '../server/storage.js';
import fs from 'fs';

const files = [
  { file: 'Vfd.jpg', title: 'Study (Vertebral Form)', series: 'Biomorphic Residuals', caption: 'A high-contrast organic study resembling a spine or fern structure.' },
  { file: '20240724_161520.jpg', title: 'Residual (Heavy Mass)', series: 'Biomorphic Residuals', caption: 'A dense, brooding accumulation of ink with limited negative space.' },
  { file: '20240724_153159.jpg', title: 'Residual (Broken Loop)', series: 'Biomorphic Residuals', caption: 'A thick, brush-heavy loop that fails to close, creating an open gesture.' },
  { file: '20240724_153120.jpg', title: 'Residual (Horizontal Mass)', series: 'Biomorphic Residuals', caption: 'Heavy horizontal strokes bleeding into a wet wash field.' },
  { file: '20240801_112613.jpg', title: 'Study (Cellular Wash)', series: 'Biomorphic Residuals', caption: 'A delicate, high-water-content study focusing on edge diffusion.' },
  { file: '20240801_113712.jpg', title: 'Study (Soft Ring)', series: 'Biomorphic Residuals', caption: 'A faint, ghostly ring structure, likely a test of ink dilution.' },
  { file: '20240801_113635.jpg', title: 'Study (Dense Core)', series: 'Biomorphic Residuals', caption: 'A small, concentrated blast of black ink with a sharp white center.' },
  { file: '20240629_111657.jpg', title: 'Vietnam Horizon (Bar 01)', series: 'Horizons', caption: 'A minimalist composition defined by a single, heavy horizontal censor bar.' },
  { file: '20240629_112123.jpg', title: 'Vietnam Horizon (Bar 02)', series: 'Horizons', caption: 'Two parallel ink fields creating a "landscape" horizon effect.' },
  { file: '20240629_111955.jpg', title: 'Horizon (Intersected)', series: 'Horizons', caption: 'A horizontal field interrupted by a vertical gestural break.' },
  { file: '20240801_112932.jpg', title: 'Study (Wash Fragment)', series: 'Biomorphic Residuals', caption: 'A wash study exploring edge behavior and ink diffusion.' },
  { file: '20240629_111634.jpg', title: 'Vietnam Horizon (Bar 03)', series: 'Horizons', caption: 'A horizontal landscape abstraction with heavy black bar.' }
];

async function upload() {
  const results = [];
  for (const item of files) {
    const filePath = '/home/ubuntu/upload/' + item.file;
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      const key = 'works/ph4/' + item.file.toLowerCase().replace(/[^a-z0-9.]/g, '_');
      const result = await storagePut(key, data, 'image/jpeg');
      results.push({ 
        ...item, 
        key: result.key, 
        url: result.url 
      });
      console.log('Uploaded:', item.title, '->', result.url);
    } else {
      console.log('Not found:', item.file);
    }
  }
  console.log('\n=== UPLOAD RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
}

upload().catch(console.error);
