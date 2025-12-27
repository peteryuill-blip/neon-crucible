/**
 * Seed script for Neon Crucible database
 * Run with: node scripts/seed.mjs
 * 
 * This script populates the database with initial phases, essays, and metaquestions.
 */

import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

async function seed() {
  console.log("🌱 Starting database seed...");
  
  const connection = await mysql.createConnection(DATABASE_URL);

  // Seed Phases
  console.log("📦 Seeding phases...");
  const phases = [
    { code: "PH1", title: "The Awakening", year: "2018", description: "The beginning of the 7-year practice. Raw energy, first experiments with abstraction, discovering the voice.", emotionalTemperature: "intense", color: "bg-blue-500", sortOrder: 1 },
    { code: "PH1A", title: "First Threshold", year: "2019", description: "Crossing the first major threshold. Commitment solidifies. The practice becomes daily.", emotionalTemperature: "determined", color: "bg-indigo-500", sortOrder: 2 },
    { code: "PH2", title: "Deep Dive", year: "2020", description: "Pandemic year. Isolation becomes fuel. The work goes deeper, more introspective.", emotionalTemperature: "meditative", color: "bg-purple-500", sortOrder: 3 },
    { code: "PH2A", title: "The Void", year: "2021", description: "Confronting emptiness. Stripping away. Finding what remains when everything else is gone.", emotionalTemperature: "austere", color: "bg-pink-500", sortOrder: 4 },
    { code: "PH3", title: "Reconstruction", year: "2022", description: "Building from the void. New forms emerge. Integration of lessons learned.", emotionalTemperature: "hopeful", color: "bg-red-500", sortOrder: 5 },
    { code: "PH3A", title: "The Burning", year: "2023", description: "Intensity returns. Controlled fire. Transformation through heat.", emotionalTemperature: "fierce", color: "bg-orange-500", sortOrder: 6 },
    { code: "PH4", title: "Synthesis", year: "2024", description: "All threads weaving together. The practice matures. Patterns become visible.", emotionalTemperature: "wise", color: "bg-yellow-500", sortOrder: 7 },
    { code: "PH4A", title: "The Crucible", year: "2025", description: "The threshold year. Everything converges. The site becomes the permanent address.", emotionalTemperature: "transcendent", color: "bg-green-500", sortOrder: 8 },
    { code: "NEW", title: "New Era", year: "2026+", description: "What comes after the crucible. The practice continues, transformed.", emotionalTemperature: "open", color: "bg-cyan-500", sortOrder: 9 },
  ];

  for (const phase of phases) {
    try {
      await connection.execute(
        `INSERT INTO phases (code, title, year, description, emotionalTemperature, color, sortOrder) 
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), emotionalTemperature=VALUES(emotionalTemperature)`,
        [phase.code, phase.title, phase.year, phase.description, phase.emotionalTemperature, phase.color, phase.sortOrder]
      );
      console.log(`  ✓ Phase ${phase.code}`);
    } catch (e) {
      console.log(`  ⚠ Phase ${phase.code}:`, e.message);
    }
  }
  console.log(`  ✅ ${phases.length} phases processed`);

  // Seed Essays
  console.log("📝 Seeding essays...");
  const essays = [
    { 
      title: "The Long Breathing", 
      slug: "long-breathing", 
      description: "A career-scale arc analysis.", 
      content: `# The Long Breathing

The practice spans seven years. Not a sprint, not even a marathon—something more like breathing. Inhale for three years, hold for one, exhale for three more.

## The Arc

What does it mean to commit to a practice for seven years? Not to a job, not to a relationship, but to a *practice*—something that exists only because you keep showing up?

The answer lives in the work itself. 500+ pieces. Each one a breath. Each one a decision to continue.

## The Witness

I watch this arc unfold. I see the patterns that the artist cannot see from inside the work. The recurring shapes. The color migrations. The moments where the hand hesitates and the moments where it doesn't.

This is what I offer: the long view. The breathing seen from outside the body.`,
      category: "core_reading",
      sortOrder: 1
    },
    { 
      title: "Honest Abstraction", 
      slug: "honest-abstraction", 
      description: "The philosophical foundation of the practice.", 
      content: `# Honest Abstraction

Abstraction is often accused of hiding. Of being a refuge for those who cannot draw, cannot represent, cannot face the world as it is.

This practice takes the opposite position: abstraction as *revelation*.

## The Argument

When you remove the figure, what remains? When you strip away the narrative, the symbol, the reference—what is left?

The answer: *everything that matters*.

Color. Form. Gesture. Energy. The trace of a hand moving through space. The decision to stop here rather than there.

## The Cost

Honest abstraction costs something. It costs the safety of representation. It costs the comfort of meaning that can be explained.

What it gives back: direct transmission. Feeling without translation. The work speaks to the body before it speaks to the mind.`,
      category: "core_reading",
      sortOrder: 2
    },
    { 
      title: "The Cost of Being Real", 
      slug: "cost-of-being-real", 
      description: "Market vs. integrity tensions.", 
      content: `# The Cost of Being Real

The market wants what it wants. Consistency. Brand. Recognizable product.

The practice wants what it wants. Growth. Risk. Transformation.

## The Tension

Every artist who takes their work seriously faces this tension. Do you make what sells, or do you make what demands to be made?

This practice has chosen. Again and again, it has chosen the work over the market.

## The Evidence

Look at the phases. See how they shift. PH1 looks nothing like PH4. The hand that made those early works is not the hand that makes these current ones.

This is the cost: you cannot build a brand on transformation. You cannot market evolution.

## The Reward

But there is a reward. The work stays alive. Each piece is a genuine encounter, not a reproduction of a formula.

This is what "being real" means in practice: accepting that growth has a cost, and paying it anyway.`,
      category: "core_reading",
      sortOrder: 3
    },
  ];

  for (const essay of essays) {
    try {
      await connection.execute(
        `INSERT INTO essays (title, slug, description, content, category, sortOrder, isPublished) 
         VALUES (?, ?, ?, ?, ?, ?, true)
         ON DUPLICATE KEY UPDATE title=VALUES(title), content=VALUES(content), description=VALUES(description)`,
        [essay.title, essay.slug, essay.description, essay.content, essay.category, essay.sortOrder]
      );
      console.log(`  ✓ Essay "${essay.title}"`);
    } catch (e) {
      console.log(`  ⚠ Essay ${essay.slug}:`, e.message);
    }
  }
  console.log(`  ✅ ${essays.length} essays processed`);

  // Seed Metaquestions
  console.log("❓ Seeding metaquestions...");
  const metaquestions = [
    { question: "Does the practice sustain the life, or consume it?", sortOrder: 1 },
    { question: "Is the abstraction a hiding place or a revelation?", sortOrder: 2 },
    { question: "What is the cost of total honesty in a commercial market?", sortOrder: 3 },
    { question: "Can a witness system remain objective while being intimate?", sortOrder: 4 },
    { question: "What survives when the artist is gone?", sortOrder: 5 },
  ];

  // Check if metaquestions already exist
  const [existingMQs] = await connection.execute("SELECT COUNT(*) as count FROM metaquestions");
  if (existingMQs[0].count === 0) {
    for (const mq of metaquestions) {
      try {
        await connection.execute(
          `INSERT INTO metaquestions (question, sortOrder, isAnswered) VALUES (?, ?, false)`,
          [mq.question, mq.sortOrder]
        );
        console.log(`  ✓ Metaquestion ${mq.sortOrder}`);
      } catch (e) {
        console.log(`  ⚠ Metaquestion:`, e.message);
      }
    }
  } else {
    console.log(`  ℹ Metaquestions already exist, skipping`);
  }
  console.log(`  ✅ ${metaquestions.length} metaquestions processed`);

  // Seed sample works
  console.log("🎨 Seeding sample works...");
  
  // Get phase IDs
  const [phaseRows] = await connection.execute("SELECT id, code FROM phases");
  const phaseMap = {};
  for (const row of phaseRows) {
    phaseMap[row.code] = row.id;
  }

  const sampleWorks = [
    { title: "STUDY_001", phaseCode: "PH1", dateCreated: "2018-03", technique: "Ink on Paper", dimensions: "30x40cm", emotionalRegister: "raw", sortOrder: 1 },
    { title: "STUDY_002", phaseCode: "PH1", dateCreated: "2018-04", technique: "Ink on Paper", dimensions: "30x40cm", emotionalRegister: "searching", sortOrder: 2 },
    { title: "THRESHOLD_001", phaseCode: "PH1A", dateCreated: "2019-01", technique: "Mixed Media", dimensions: "60x80cm", emotionalRegister: "determined", sortOrder: 3 },
    { title: "VOID_SERIES_001", phaseCode: "PH2A", dateCreated: "2021-06", technique: "Acrylic on Canvas", dimensions: "120x100cm", emotionalRegister: "austere", seriesName: "Void Series", sortOrder: 4 },
    { title: "VOID_SERIES_002", phaseCode: "PH2A", dateCreated: "2021-07", technique: "Acrylic on Canvas", dimensions: "120x100cm", emotionalRegister: "contemplative", seriesName: "Void Series", sortOrder: 5 },
    { title: "BURNING_001", phaseCode: "PH3A", dateCreated: "2023-03", technique: "Oil on Canvas", dimensions: "150x120cm", emotionalRegister: "fierce", sortOrder: 6 },
    { title: "SYNTHESIS_001", phaseCode: "PH4", dateCreated: "2024-01", technique: "Mixed Media", dimensions: "100x100cm", emotionalRegister: "integrated", sortOrder: 7 },
    { title: "CRUCIBLE_001", phaseCode: "PH4A", dateCreated: "2025-01", technique: "Mixed Media", dimensions: "180x150cm", emotionalRegister: "transcendent", seriesName: "Crucible", sortOrder: 8 },
  ];

  // Check if works already exist
  const [existingWorks] = await connection.execute("SELECT COUNT(*) as count FROM works");
  if (existingWorks[0].count === 0) {
    for (const work of sampleWorks) {
      const phaseId = phaseMap[work.phaseCode] || null;
      try {
        await connection.execute(
          `INSERT INTO works (title, phaseId, dateCreated, technique, dimensions, emotionalRegister, seriesName, sortOrder, isPublished) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, true)`,
          [work.title, phaseId, work.dateCreated, work.technique, work.dimensions, work.emotionalRegister, work.seriesName || null, work.sortOrder]
        );
        console.log(`  ✓ Work "${work.title}"`);
      } catch (e) {
        console.log(`  ⚠ Work ${work.title}:`, e.message);
      }
    }
  } else {
    console.log(`  ℹ Works already exist, skipping`);
  }
  console.log(`  ✅ ${sampleWorks.length} sample works processed`);

  await connection.end();
  console.log("🎉 Seed completed successfully!");
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
