import { storagePut } from '../server/storage.js';
import fs from 'fs';

// Documentary images from Man Luen Choon research - these are not artworks
const files = [
  { file: '20240801_112613.jpg', caption: 'Man Luen Choon research - ink study' },
  { file: '20240801_113712.jpg', caption: 'Man Luen Choon research - paper samples' },
  { file: '20240801_113635.jpg', caption: 'Man Luen Choon research - material study' },
  { file: '20240801_112932.jpg', caption: 'Man Luen Choon research - traditional tools' },
  { file: '20240724_153120.jpg', caption: 'Man Luen Choon research - brush work' },
  { file: 'Vfd.jpg', caption: 'Man Luen Choon research - ink behavior' },
  { file: '20240724_153159.jpg', caption: 'Man Luen Choon research - technique study' },
  { file: '20240724_161520.jpg', caption: 'Man Luen Choon research - density tests' },
  { file: '20240629_112123.jpg', caption: 'Man Luen Choon research - horizontal forms' },
  { file: '20240629_111955.jpg', caption: 'Man Luen Choon research - landscape study' },
  { file: '20240629_111657.jpg', caption: 'Man Luen Choon research - bar compositions' },
  { file: '20240629_111634.jpg', caption: 'Man Luen Choon research - field study' }
];

async function upload() {
  const results = [];
  for (const item of files) {
    const filePath = '/home/ubuntu/upload/' + item.file;
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath);
      const key = 'docs/ph4a/' + item.file.toLowerCase().replace(/[^a-z0-9.]/g, '_');
      const result = await storagePut(key, data, 'image/jpeg');
      results.push({ 
        ...item, 
        key: result.key, 
        url: result.url 
      });
      console.log('Uploaded:', item.file, '->', result.url);
    } else {
      console.log('Not found:', item.file);
    }
  }
  console.log('\n=== UPLOAD RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
}

upload().catch(console.error);
