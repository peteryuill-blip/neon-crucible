import { storagePut } from '../server/storage';
import { getDb } from '../server/db';
import { works } from '../drizzle/schema';
import * as fs from 'fs';
import * as path from 'path';

// PH1 = Absurdity of Meaning phase (id: 30001)
const PHASE_ID = 30001;

interface WorkData {
  filename: string;
  title: string;
  seriesName: string;
  technique: string;
  dimensions: string;
  colorPalette: string;
  emotionalRegister: string;
  journalExcerpt: string;
  neonReading: string;
  dateCreated: string;
}

const ph1Works: WorkData[] = [
  // ABSURDITY OF MEANING SERIES
  {
    filename: 'peteryuill_absurdityofmeaning1.jpg',
    title: 'Absurdity of Meaning No. 1',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'foundational tension',
    dateCreated: '2018-03',
    journalExcerpt: 'The first work of the series. The beginning of the dialogue between form and void.',
    neonReading: 'The origin point. This work establishes the visual vocabulary that will define the entire phase: the torus as consciousness, the black element as the Absurd.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning2.jpg',
    title: 'Absurdity of Meaning No. 2',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'developing conflict',
    dateCreated: '2018-03',
    journalExcerpt: 'The dialogue continues. The geometry grows more complex as the conflict deepens.',
    neonReading: 'The second iteration. The torus begins to fold and twist, suggesting the complexity of the existential question.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning3(1).jpg',
    title: 'Absurdity of Meaning No. 3',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'existential tension',
    dateCreated: '2018-03',
    journalExcerpt: 'The circle strives for wholeness; the bar interrupts it. This is the core dialectic of the phase. I build the illusion of volume only to shatter it with the flat reality of the black bar.',
    neonReading: 'The primary conflict. The torus represents the infinite loop of consciousness seeking meaning. The black bar is the "Absurd"—the hard limit of the universe\'s indifference. The geometry tries to flow around the obstacle, but the interruption is absolute.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning4(1).jpg',
    title: 'Absurdity of Meaning No. 4',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'deepening inquiry',
    dateCreated: '2018-03',
    journalExcerpt: 'The forms multiply. Each iteration asks the same question from a different angle.',
    neonReading: 'The multiplication. Multiple torus forms begin to interact, suggesting that the existential question is not singular but fractal—each answer spawns new questions.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning5(1).jpg',
    title: 'Absurdity of Meaning No. 5',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'complex interruption',
    dateCreated: '2018-03',
    journalExcerpt: 'A complex knot, folded in on itself, interrupted by a horizontal bar. The thought process is denser here, but the censor is still present.',
    neonReading: 'The censor. The horizontal bar sits like a redaction over the complex knot. It suggests that no matter how intricate the reasoning (the geometry), the silence of the universe (the bar) remains the final word.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning6.jpg',
    title: 'Absurdity of Meaning No. 6',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'infinite loop',
    dateCreated: '2018-03',
    journalExcerpt: 'The figure-eight torus. A continuous surface with no inside or outside. Hand-drawn micro-lines create a moiré field that vibrates.',
    neonReading: 'The breathing loop. This work captures the "moiré breath"—the optical illusion that makes the static image appear to pulse. It represents the self-sustaining nature of the existential question: it feeds on itself endlessly.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning7.jpg',
    title: 'Absurdity of Meaning No. 7',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'sustained inquiry',
    dateCreated: '2018-03',
    journalExcerpt: 'The series continues. Each work is a meditation on the same impossible question.',
    neonReading: 'The persistence. By the seventh iteration, the artist has established a rhythm of inquiry. The question does not resolve; it deepens.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning8.jpg',
    title: 'Absurdity of Meaning No. 8',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'asymmetrical cut',
    dateCreated: '2018-03',
    journalExcerpt: 'Variation on the interruption. The placement of the bar feels random, arbitrary. It strikes where it chooses.',
    neonReading: 'The arbitrary limit. In this iteration, the interruption feels less structural and more accidental—emphasizing the Camusian view that the universe\'s silence is not malicious, just indifferent.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning9.jpg',
    title: 'Absurdity of Meaning No. 9',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'approaching resolution',
    dateCreated: '2018-03',
    journalExcerpt: 'The forms begin to stabilize. Not resolution, but acceptance.',
    neonReading: 'The approach. As the series nears its end, the forms become more stable, suggesting not that the question is answered, but that the artist has learned to hold it without breaking.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning10.jpg',
    title: 'Absurdity of Meaning No. 10',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'sustained tension',
    dateCreated: '2018-03',
    journalExcerpt: 'The tenth iteration. The dialogue continues without resolution.',
    neonReading: 'The continuation. Ten works in, the series demonstrates that the existential question is not meant to be answered but inhabited.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning11.jpg',
    title: 'Absurdity of Meaning No. 11',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '76 x 56 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'heavy oppression',
    dateCreated: '2018-03',
    journalExcerpt: 'A massive black sphere rests atop a delicate torus. The visual weight is crushing. Gravity as an existential metaphor.',
    neonReading: 'The weight of the void. Unlike the bars which "cut," this sphere "crushes." It is the heavy, mute presence of the Absurd pressing down on the delicate structure of human logic.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning12.jpg',
    title: 'Absurdity of Meaning No. 12',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '76 x 56 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'dual eclipse',
    dateCreated: '2018-03',
    journalExcerpt: 'Variation on the sphere/torus interaction. The relationship feels celestial—an eclipse of meaning.',
    neonReading: 'The eclipse. The interaction between the solid black form and the torus\'s central void suggests an alignment of shadows. It is a portrait of absence meeting absence.'
  },
  {
    filename: 'peteryuill_absurdityofmeaning13(1).jpg',
    title: 'Absurdity of Meaning No. 13',
    seriesName: 'Absurdity of Meaning',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '76 x 56 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'culminating statement',
    dateCreated: '2018-03',
    journalExcerpt: 'The final work of the core series. Not an ending, but a threshold.',
    neonReading: 'The threshold. The thirteenth work marks the completion of the initial cycle. The question remains open, but the vocabulary has been established.'
  },
  // GEOMETRIC ABSTRACTION SERIES
  {
    filename: 'peteryuill_geometricabstraction_4(1).jpg',
    title: 'Geometric Abstraction No. 4',
    seriesName: 'Geometric Abstraction',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'pure form',
    dateCreated: '2018',
    journalExcerpt: 'The geometry without the conflict. Pure form, pure line, pure meditation.',
    neonReading: 'The meditation. Without the black bars, the torus exists in a state of pure potential. It is geometry before the fall.'
  },
  {
    filename: 'peteryuill_geometricabstraction_5(1).jpg',
    title: 'Geometric Abstraction No. 5',
    seriesName: 'Geometric Abstraction',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'expanding complexity',
    dateCreated: '2018',
    journalExcerpt: 'The forms grow more complex. Each line is a decision, each curve a commitment.',
    neonReading: 'The commitment. The density of lines demonstrates the "no-undo" discipline. Each stroke is permanent, each decision irreversible.'
  },
  {
    filename: 'peteryuill_geometricabstraction_6(1).jpg',
    title: 'Geometric Abstraction No. 6',
    seriesName: 'Geometric Abstraction',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'topological fold',
    dateCreated: '2018',
    journalExcerpt: 'A folded torus, revealing the "saddle" geometry. The lines cross and weave, creating a fabric of ink.',
    neonReading: 'The fabric of logic. The complexity of the fold demonstrates the artist\'s technical mastery of the hand-drawn algorithm. It is a map of a thought turning back on itself.'
  },
  {
    filename: 'peteryuill_geometricabstraction_7(1).jpg',
    title: 'Geometric Abstraction No. 7',
    seriesName: 'Geometric Abstraction',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'sustained precision',
    dateCreated: '2018',
    journalExcerpt: 'The discipline continues. Hours of hand-drawn lines accumulate into form.',
    neonReading: 'The accumulation. Each work represents hours of meditative labor. The form emerges from the discipline, not despite it.'
  },
  {
    filename: 'peteryuill_geometricabstraction_8(1).jpg',
    title: 'Geometric Abstraction No. 8',
    seriesName: 'Geometric Abstraction',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'deepening density',
    dateCreated: '2018',
    journalExcerpt: 'The line density increases. The moiré effect intensifies.',
    neonReading: 'The intensification. As line density increases, the moiré effect becomes more pronounced. The static image begins to breathe.'
  },
  {
    filename: 'peteryuill_geometricabstraction_9(1).jpg',
    title: 'Geometric Abstraction No. 9',
    seriesName: 'Geometric Abstraction',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'high-frequency moiré',
    dateCreated: '2018',
    journalExcerpt: 'Dense concentric torus. The line density is extremely high, creating intense optical vibration.',
    neonReading: 'The hum. The density of lines reaches a critical mass where individual strokes disappear and become a field of frequency. This is visual resonance—geometry aspiring to the condition of sound.'
  },
  {
    filename: 'peteryuill_geometricabstraction_10(1).jpg',
    title: 'Geometric Abstraction No. 10',
    seriesName: 'Geometric Abstraction',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'approaching transcendence',
    dateCreated: '2018',
    journalExcerpt: 'The forms begin to suggest something beyond themselves.',
    neonReading: 'The suggestion. At this density, the geometry begins to suggest something beyond pure form—a portal, a frequency, a state of mind.'
  },
  {
    filename: 'peteryuill_geometricabstraction_11.jpg',
    title: 'Geometric Abstraction No. 11',
    seriesName: 'Geometric Abstraction',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'near-completion',
    dateCreated: '2018',
    journalExcerpt: 'The series approaches its end. The vocabulary is complete.',
    neonReading: 'The completion. The geometric vocabulary established here will carry forward through all subsequent phases.'
  },
  {
    filename: 'peteryuill_geometricabstraction_12.jpg',
    title: 'Geometric Abstraction No. 12',
    seriesName: 'Geometric Abstraction',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '76 x 56 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'vertical totem',
    dateCreated: '2018',
    journalExcerpt: 'Vertical arrangement of torus forms. A totem of pure geometry.',
    neonReading: 'The totem. Verticality suggests a hierarchy or a spine. Even without the "absurdist" bars, the structure feels precarious, balanced on a razor\'s edge of precision.'
  },
  // MATHEMATICAL MEDITATION SERIES
  {
    filename: 'peteryuill_mathematicalmeditation1(1).jpg',
    title: 'Mathematical Meditation No. 1',
    seriesName: 'Mathematical Meditation',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '76 x 56 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'contemplative violence',
    dateCreated: '2018',
    journalExcerpt: 'The first of the meditations. Mathematics as a form of prayer.',
    neonReading: 'The prayer. The title is deliberately paradoxical—mathematics as meditation, logic as devotion. The work attempts to reconcile the rational and the spiritual.'
  },
  {
    filename: 'peteryuill_mathematicalmeditation2(1).jpg',
    title: 'Mathematical Meditation No. 2',
    seriesName: 'Mathematical Meditation',
    technique: 'Ink and acrylic on Saunders Waterford 300gsm paper',
    dimensions: '76 x 56 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'violent redaction',
    dateCreated: '2018',
    journalExcerpt: 'A torus slashed by multiple aggressive black bars—diagonal and vertical. The violence is palpable.',
    neonReading: 'The violent redaction. This is the most aggressive work of the set. The black bars do not just interrupt; they attack. It is a visualization of the frustration of the seeker—the answer is not just missing; it is actively withheld.'
  },
  // STANDALONE WORKS
  {
    filename: 'peteryuill_there_lay_an_invincible_summer.jpg',
    title: 'There Lay an Invincible Summer',
    seriesName: 'Standalone',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '76 x 56 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'defiant hope',
    dateCreated: '2018',
    journalExcerpt: 'From Camus: "In the midst of winter, I found there was, within me, an invincible summer." The title is a declaration of survival.',
    neonReading: 'The declaration. This work marks the moment when the artist moves from questioning to affirming. The Absurd remains, but so does the will to create despite it.'
  },
  {
    filename: 'peteryuill_iwonderifireallyexist(1).jpg',
    title: 'I Wonder If I Really Exist',
    seriesName: 'Standalone',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '56 x 76 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'existential doubt',
    dateCreated: '2018',
    journalExcerpt: 'The fundamental question. Not "what is the meaning of life?" but "am I even here to ask?"',
    neonReading: 'The fundamental doubt. This work strips the existential question to its most basic form. Before meaning, before purpose—existence itself is uncertain.'
  },
  {
    filename: 'peteryuill_theatre_of_memory.jpg',
    title: 'Theatre of Memory',
    seriesName: 'Standalone',
    technique: 'Ink on Saunders Waterford 300gsm paper',
    dimensions: '76 x 56 cm',
    colorPalette: 'Black, White',
    emotionalRegister: 'mnemonic architecture',
    dateCreated: '2018',
    journalExcerpt: 'Reference to Giulio Camillo\'s memory palace. The geometry as a container for thought.',
    neonReading: 'The architecture of thought. This work references the Renaissance tradition of memory palaces—architectural structures designed to hold and organize knowledge. The torus becomes a container for consciousness.'
  }
];

async function uploadPH1Works() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  const results: any[] = [];
  
  for (let i = 0; i < ph1Works.length; i++) {
    const work = ph1Works[i];
    const filePath = path.join('/home/ubuntu/upload', work.filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`[SKIP] File not found: ${work.filename}`);
      continue;
    }
    
    console.log(`[${i + 1}/${ph1Works.length}] Uploading: ${work.title}`);
    
    try {
      // Read and upload image
      const imageBuffer = fs.readFileSync(filePath);
      const ext = path.extname(work.filename).slice(1);
      const key = `works/ph1/${Date.now()}-${work.filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const { url } = await storagePut(key, imageBuffer, `image/${ext === 'jpg' ? 'jpeg' : ext}`);
      
      // Insert into database
      const [inserted] = await db.insert(works).values({
        title: work.title,
        phaseId: PHASE_ID,
        dateCreated: work.dateCreated,
        technique: work.technique,
        dimensions: work.dimensions,
        colorPalette: work.colorPalette,
        emotionalRegister: work.emotionalRegister,
        imageUrl: url,
        imageKey: key,
        journalExcerpt: work.journalExcerpt,
        neonReading: work.neonReading,
        seriesName: work.seriesName,
        isPublished: true,
        sortOrder: i + 1,
      }).$returningId();
      
      results.push({
        id: inserted.id,
        title: work.title,
        series: work.seriesName,
        url: url,
      });
      
      console.log(`  ✓ Uploaded: ID ${inserted.id}`);
    } catch (error) {
      console.error(`  ✗ Error uploading ${work.title}:`, error);
    }
  }
  
  // Write manifest
  const manifest = {
    phase: 'PH1',
    phaseName: 'Absurdity of Meaning',
    uploadedAt: new Date().toISOString(),
    totalWorks: results.length,
    works: results,
  };
  
  fs.writeFileSync(
    '/home/ubuntu/neon-crucible/ph1_manifest.json',
    JSON.stringify(manifest, null, 2)
  );
  
  console.log(`\n✓ Upload complete: ${results.length} works`);
  console.log('Manifest saved to ph1_manifest.json');
  
  process.exit(0);
}

uploadPH1Works().catch(console.error);
