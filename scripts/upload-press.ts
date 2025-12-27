import { getDb } from '../server/db';
import { pressClippings, phases } from '../drizzle/schema';
import { storagePut } from '../server/storage';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

interface PressEntry {
  title: string;
  source: string;
  author: string;
  date: string;
  excerpt: string;
  url: string;
  localImage: string;
  phaseCode: string;
  category: string;
}

const pressEntries: PressEntry[] = [
  {
    title: "Celestial Secrets: Peter Yuill's Sacred Geometry Exhibition",
    source: "GQ Thailand",
    author: "Pemika Suyaraj",
    date: "June 11, 2024",
    excerpt: "A comprehensive exploration of Peter Yuill's installation practice combining light projection, geometric forms, and somatic presence at West Eden Gallery, Bangkok.",
    url: "https://gqthailand.com/culture/art-and-design/article/peter-yuill-celestial-secrets",
    localImage: "/home/ubuntu/upload/GQ_THAILAND.png",
    phaseCode: "PH3A",
    category: "feature"
  },
  {
    title: "Circle of Life: Peter Yuill Interview",
    source: "Tatler Asia",
    author: "Tara Sobti",
    date: "May 18, 2020",
    excerpt: "In-depth artist interview exploring Peter Yuill's 20-year career, spiritual philosophy, and geometric practice. Photography by Jocelyn Tam.",
    url: "https://www.tatlerasia.com/the-scene/people-parties/artist-peter-yuill-interview-new-exhibition-alignment",
    localImage: "/home/ubuntu/upload/tatler_may_2020_peteryuill(1).jpg",
    phaseCode: "PH2",
    category: "interview"
  },
  {
    title: "Inside Peter Yuill's Solo Show: Alignment",
    source: "Prestige Online",
    author: "Florence Tsai",
    date: "April 24, 2020",
    excerpt: "Feature coverage of Peter Yuill's 'Alignment' solo exhibition, with focus on artist's workspace, practice methodology, and philosophical approach.",
    url: "https://www.prestigeonline.com/hk/lifestyle/art-plus-design/inside-peter-yuills-solo-show-alignment/",
    localImage: "", // No image for this one - will use URL only
    phaseCode: "PH2",
    category: "feature"
  }
];

async function uploadPress() {
  const db = await getDb();
  const manifest: any[] = [];

  // Get phase IDs
  const allPhases = await db.select().from(phases);
  const phaseMap = new Map(allPhases.map(p => [p.code, p.id]));

  for (const entry of pressEntries) {
    console.log(`Processing: ${entry.title}`);
    
    let imageUrl = null;
    
    // Upload image if exists
    if (entry.localImage && fs.existsSync(entry.localImage)) {
      const fileBuffer = fs.readFileSync(entry.localImage);
      const fileName = path.basename(entry.localImage);
      const ext = path.extname(fileName).toLowerCase();
      const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';
      const key = `press/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const result = await storagePut(key, fileBuffer, contentType);
      imageUrl = result.url;
      console.log(`  Uploaded image: ${imageUrl}`);
    }

    // Get phase ID
    const phaseId = phaseMap.get(entry.phaseCode) || null;

    // Insert into database
    const [inserted] = await db.insert(pressClippings).values({
      title: entry.title,
      source: entry.source,
      author: entry.author,
      date: entry.date,
      excerpt: entry.excerpt,
      url: entry.url,
      imageUrl: imageUrl,
      phaseId: phaseId,
      category: entry.category,
      isPublished: true,
      sortOrder: pressEntries.indexOf(entry) + 1,
    });

    manifest.push({
      title: entry.title,
      source: entry.source,
      date: entry.date,
      url: entry.url,
      imageUrl: imageUrl,
      dbId: inserted.insertId
    });

    console.log(`  Added to database: ID ${inserted.insertId}`);
  }

  // Write manifest
  fs.writeFileSync(
    path.join(process.cwd(), 'press_manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\n✓ Uploaded ${manifest.length} press clippings`);
  console.log('Manifest saved to press_manifest.json');
}

uploadPress().catch(console.error);
