import { getDb } from '../server/db.ts';
import { works, phases } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const worksData = [
  {
    title: "Study (Vertebral Form)",
    series: "Biomorphic Residuals",
    description: "A high-contrast organic study resembling a spine or fern structure.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/vfd.jpg",
    imageKey: "works/ph4/vfd.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 7,
    technique: "Ink wash"
  },
  {
    title: "Residual (Heavy Mass)",
    series: "Biomorphic Residuals",
    description: "A dense, brooding accumulation of ink with limited negative space.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240724_161520.jpg",
    imageKey: "works/ph4/20240724_161520.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 7,
    technique: "Ink wash"
  },
  {
    title: "Residual (Broken Loop)",
    series: "Biomorphic Residuals",
    description: "A thick, brush-heavy loop that fails to close, creating an open gesture.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240724_153159.jpg",
    imageKey: "works/ph4/20240724_153159.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 7,
    technique: "Ink wash"
  },
  {
    title: "Residual (Horizontal Mass)",
    series: "Biomorphic Residuals",
    description: "Heavy horizontal strokes bleeding into a wet wash field.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240724_153120.jpg",
    imageKey: "works/ph4/20240724_153120.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 7,
    technique: "Ink wash"
  },
  {
    title: "Study (Cellular Wash)",
    series: "Biomorphic Residuals",
    description: "A delicate, high-water-content study focusing on edge diffusion.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240801_112613.jpg",
    imageKey: "works/ph4/20240801_112613.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 8,
    technique: "Ink wash"
  },
  {
    title: "Study (Soft Ring)",
    series: "Biomorphic Residuals",
    description: "A faint, ghostly ring structure, likely a test of ink dilution.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240801_113712.jpg",
    imageKey: "works/ph4/20240801_113712.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 8,
    technique: "Ink wash"
  },
  {
    title: "Study (Dense Core)",
    series: "Biomorphic Residuals",
    description: "A small, concentrated blast of black ink with a sharp white center.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240801_113635.jpg",
    imageKey: "works/ph4/20240801_113635.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 8,
    technique: "Ink wash"
  },
  {
    title: "Vietnam Horizon (Bar 01)",
    series: "Horizons",
    description: "A minimalist composition defined by a single, heavy horizontal censor bar.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240629_111657.jpg",
    imageKey: "works/ph4/20240629_111657.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 6,
    technique: "Ink wash"
  },
  {
    title: "Vietnam Horizon (Bar 02)",
    series: "Horizons",
    description: "Two parallel ink fields creating a \"landscape\" horizon effect.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240629_112123.jpg",
    imageKey: "works/ph4/20240629_112123.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 6,
    technique: "Ink wash"
  },
  {
    title: "Horizon (Intersected)",
    series: "Horizons",
    description: "A horizontal field interrupted by a vertical gestural break.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240629_111955.jpg",
    imageKey: "works/ph4/20240629_111955.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 6,
    technique: "Ink wash"
  },
  {
    title: "Study (Wash Fragment)",
    series: "Biomorphic Residuals",
    description: "A wash study exploring edge behavior and ink diffusion.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240801_112932.jpg",
    imageKey: "works/ph4/20240801_112932.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 8,
    technique: "Ink wash"
  },
  {
    title: "Vietnam Horizon (Bar 03)",
    series: "Horizons",
    description: "A horizontal landscape abstraction with heavy black bar.",
    imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph4/20240629_111634.jpg",
    imageKey: "works/ph4/20240629_111634.jpg",
    medium: "Sumi ink and wash on paper",
    dimensions: "Variable (large format)",
    year: 2024,
    month: 6,
    technique: "Ink wash"
  }
];

async function insertWorks() {
  const db = await getDb();
  if (!db) {
    console.error('Database connection failed!');
    return;
  }

  // Get PH4 phase ID
  const ph4Phase = await db.select().from(phases).where(eq(phases.code, 'PH4')).limit(1);
  if (!ph4Phase.length) {
    console.error('PH4 phase not found!');
    return;
  }
  const phaseId = ph4Phase[0].id;
  console.log('Found PH4 phase with ID:', phaseId);

  // Insert works
  let inserted = 0;
  for (const work of worksData) {
    try {
      await db.insert(works).values({
        ...work,
        phaseId,
        isPublished: true,
        sortOrder: 100 + inserted
      });
      console.log('Inserted:', work.title);
      inserted++;
    } catch (err) {
      console.error('Error inserting', work.title, ':', err.message);
    }
  }

  console.log(`\n=== COMPLETE: ${inserted} works inserted ===`);
  
  // Count total works
  const allWorks = await db.select().from(works);
  console.log('Total works in database:', allWorks.length);
  
  process.exit(0);
}

insertWorks().catch(console.error);
