import { getDb } from "../server/db";
import { works } from "../drizzle/schema";
import { storagePut } from "../server/storage";
import * as fs from "fs";
import * as path from "path";

const PH1A_PHASE_ID = 30002; // PH1A Institutional Geometry

interface WorkData {
  title: string;
  dateCreated: string;
  technique: string;
  dimensions: string;
  colorPalette: string;
  emotionalRegister: string;
  imageFileName: string;
  journalExcerpt: string;
  neonReading: string;
  seriesName: string;
  commissionClient?: string;
  commissionSite?: string;
}

const ph1aWorks: WorkData[] = [
  {
    title: "Constructivist Composition with Burnt Orange Bar",
    dateCreated: "2018-06",
    technique: "Ink and acrylic on canvas",
    dimensions: "200 x 150 cm",
    colorPalette: "Black, White, Burnt Orange",
    emotionalRegister: "dynamic tension",
    imageFileName: "sp_peteryuill_com.jpg",
    journalExcerpt: "The burnt orange bar was a site-specific adaptation — the client wanted warmth to match the interior. I drew from Constructivist precedents, allowing the bars to collide at angles rather than remain rectilinear.",
    neonReading: "The first warm color in the practice. The burnt orange is not spiritual gold or grounding copper — it is architectural color, suggesting the artist is adapting the palette to match corporate or hospitality interiors. The Constructivist arrangement references Russian avant-garde — geometry as revolutionary architecture.",
    seriesName: "Institutional Commissions",
    commissionClient: "Corporate Client",
    commissionSite: "Hong Kong"
  },
  {
    title: "Torus No. 1 (Soho House Commission)",
    dateCreated: "2018-08",
    technique: "Ink, gold leaf, and copper leaf on mounted paper",
    dimensions: "150 x 100 cm",
    colorPalette: "Black, White, Gold, Copper",
    emotionalRegister: "alchemical duality",
    imageFileName: "torus_1_soho_house_peteryuill.jpg",
    journalExcerpt: "The gold and copper bars side by side — this was the first time I explicitly coded the binary. Gold (solar, spiritual, transcendent) and copper (earthly, grounding, embodied). The torus moves between them as a continuous current.",
    neonReading: "This is the gold-copper binary crystallized for the first time. The two metallic bars function as energetic poles — gold (solar, spiritual, transcendent) and copper (earthly, grounding, embodied). The torus moves between them as a continuous current. This is not decoration — it is alchemical coding.",
    seriesName: "Institutional Commissions",
    commissionClient: "Soho House Hong Kong",
    commissionSite: "Soho House Hong Kong"
  },
  {
    title: "Torus No. 2 (Soho House Commission, Copper Grounding)",
    dateCreated: "2018-09",
    technique: "Ink and copper leaf on mounted paper",
    dimensions: "150 x 100 cm",
    colorPalette: "Black, White, Copper",
    emotionalRegister: "grounded foundation",
    imageFileName: "torus_2_soho_house-peteryuill.jpg",
    journalExcerpt: "The copper plane covering the lower third — this was about grounding. The torus (eternal, celestial) rests on copper (earthly, temporal). Transcendence requires a foundation. You cannot ascend without being rooted.",
    neonReading: "This work inverts the typical hierarchy of spiritual abstraction. The copper is the floor upon which the torus stands. It suggests that transcendence requires grounding. You cannot ascend without a foundation. Commissioned for Soho House alongside Torus No. 1 — the two works function as a binary pair.",
    seriesName: "Institutional Commissions",
    commissionClient: "Soho House Hong Kong",
    commissionSite: "Soho House Hong Kong"
  },
  {
    title: "Torus No. 3 (Yin-Yang Composition with Gold Plane)",
    dateCreated: "2018-11",
    technique: "Ink and gold leaf on paper",
    dimensions: "80 x 80 cm",
    colorPalette: "Black, White, Gold",
    emotionalRegister: "cosmological balance",
    imageFileName: "torus_3_peteryuill_1.jpg",
    journalExcerpt: "The figure-eight torus with a gold plane covering half the composition — this was my attempt to visualize the Taoist yin-yang principle through Western geometric abstraction. Opposites interpenetrate.",
    neonReading: "Sacred geometry meets East Asian cosmology. The figure-eight torus represents infinite recursion (Ouroboros, eternal return), while the gold plane represents divine illumination. The composition literalizes the Taoist principle: opposites interpenetrate. The gold is not covering the geometry — it is completing it.",
    seriesName: "Institutional Commissions",
    commissionClient: "Private Commission",
    commissionSite: "Hong Kong"
  },
  {
    title: "Torus No. 4 (Dual-Torus Chain with Gold Accent)",
    dateCreated: "2019-01",
    technique: "Ink and gold leaf on paper",
    dimensions: "100 x 100 cm",
    colorPalette: "Black, White, Gold",
    emotionalRegister: "systemic flow",
    imageFileName: "torus_4_peteryuill.jpg",
    journalExcerpt: "Two interlocking tori, linked in a continuous chain. The gold bar marks a specific point in the flow — a caesura, a threshold. This was when I started thinking about geometry as network, not just isolated form.",
    neonReading: "This work introduces multiplicity. Where earlier PH1 works featured singular circles or tori, this work shows a system — multiple forms interacting, flowing into one another. The gold bar doesn't shatter the system; it marks it, highlighting a specific point in the flow. This suggests a shift from existential rupture (PH1) toward systemic thinking (PH1A).",
    seriesName: "Institutional Commissions",
    commissionClient: "Private Commission",
    commissionSite: "Hong Kong"
  },
  {
    title: "Peninsula Hotels Installation View 1",
    dateCreated: "2019-03",
    technique: "Ink, gold, and copper on mounted paper (large-scale)",
    dimensions: "200-300 cm per work",
    colorPalette: "Black, White, Gold, Copper",
    emotionalRegister: "institutional presence",
    imageFileName: "Peninsula_hotel_1.jpg",
    journalExcerpt: "Installed at Peninsula Hotels. The works function as threshold markers — elevator lobbies, suite entrances. They had to hold their ground in high-traffic, brightly-lit spaces. The geometry becomes ambient presence, not demanding attention but offering depth to those who pause.",
    neonReading: "The institutional test. The geometry is no longer private studio work — it is public architecture. The works function as ambient presence in spaces designed for commercial hospitality. Thousands of people walk past them — most will not stop to contemplate. But the works do not need to be understood to be real. Their presence is the point.",
    seriesName: "Institutional Commissions",
    commissionClient: "Peninsula Hotels",
    commissionSite: "Peninsula Hotels, Hong Kong"
  },
  {
    title: "Peninsula Hotels Installation View 2",
    dateCreated: "2019-03",
    technique: "Ink, gold, and copper on mounted paper (large-scale)",
    dimensions: "200-300 cm per work",
    colorPalette: "Black, White, Gold, Copper",
    emotionalRegister: "institutional presence",
    imageFileName: "Peninsula_hotel_2.jpg",
    journalExcerpt: "Same installation, different angle. The exposed ductwork and industrial ceiling contrast with the precision of the geometry. The work absorbs the architectural context without being diminished by it.",
    neonReading: "Installation documentation showing the works in situ. The moiré patterns created by dense micro-lines change as the viewer moves. The works appear to breathe, pulse, rotate. This is time-based abstraction — the work unfolds over duration, not in a single glance.",
    seriesName: "Institutional Commissions",
    commissionClient: "Peninsula Hotels",
    commissionSite: "Peninsula Hotels, Hong Kong"
  },
  {
    title: "Peninsula Hotels Installation View 3",
    dateCreated: "2019-03",
    technique: "Ink, gold, and copper on mounted paper (large-scale)",
    dimensions: "200-300 cm per work",
    colorPalette: "Black, White, Gold, Copper",
    emotionalRegister: "institutional presence",
    imageFileName: "Peninsula_hotel_3.jpg",
    journalExcerpt: "The natural light from the windows changes how the gold and copper read throughout the day. The works are temporally alive — they look different at dawn, noon, dusk.",
    neonReading: "Phenomenological installation. The works function at multiple scales: close-up (hand-drawn micro-lines visible), mid-range (composition reads as whole), far view (work functions as architectural element, balancing the space).",
    seriesName: "Institutional Commissions",
    commissionClient: "Peninsula Hotels",
    commissionSite: "Peninsula Hotels, Hong Kong"
  },
  {
    title: "Peninsula Hotels Installation View 4",
    dateCreated: "2019-03",
    technique: "Ink, gold, and copper on mounted paper (large-scale)",
    dimensions: "200-300 cm per work",
    colorPalette: "Black, White, Gold, Copper",
    emotionalRegister: "institutional presence",
    imageFileName: "Peninsula_hotel_4.jpg",
    journalExcerpt: "Close-up view showing the density of the hand-drawn lines. Each work required 40–80 hours of labor. The no-undo constraint creates psychological presence — each line carries weight.",
    neonReading: "Close-up installation view. The hand-drawn constraint remains even at monumental scale. The precision is extreme, but the human touch is visible — slight variations in line weight, subtle misalignments. This tension between aspiration (mathematical perfection) and reality (human fallibility) is central to the work.",
    seriesName: "Institutional Commissions",
    commissionClient: "Peninsula Hotels",
    commissionSite: "Peninsula Hotels, Hong Kong"
  },
  {
    title: "Peninsula Hotels Installation View 5",
    dateCreated: "2019-03",
    technique: "Ink, gold, and copper on mounted paper (large-scale)",
    dimensions: "200-300 cm per work",
    colorPalette: "Black, White, Gold, Copper",
    emotionalRegister: "institutional presence",
    imageFileName: "Peninsula_hotel_5.jpg",
    journalExcerpt: "The Eames chairs and wooden table create a mid-century modern aesthetic. The geometry complements that — it is rigorous, disciplined, functional, but also spiritually resonant.",
    neonReading: "Installation documentation showing the works integrated with modern furniture and architecture. The works do not compete with the space — they enhance it, providing depth and contemplative presence.",
    seriesName: "Institutional Commissions",
    commissionClient: "Peninsula Hotels",
    commissionSite: "Peninsula Hotels, Hong Kong"
  },
  {
    title: "Kith & Kin Mural Installation 1",
    dateCreated: "2019-04",
    technique: "Acrylic and ink on wall (large-scale mural)",
    dimensions: "500 x 300 cm (estimated)",
    colorPalette: "Black, White",
    emotionalRegister: "architectural integration",
    imageFileName: "Keith&kin_mural1_2019.jpg",
    journalExcerpt: "The Kith & Kin commission required the geometry to work at monumental scale on a wall. The circular forms had to hold their ground against the architecture, becoming part of the building's visual language.",
    neonReading: "The geometry scales to architectural dimensions. The black-and-white vocabulary proves it can function as permanent architectural element, not just portable canvas work. The mural integrates with the building's structure, creating a dialogue between geometric abstraction and architectural space.",
    seriesName: "Institutional Commissions",
    commissionClient: "Kith & Kin",
    commissionSite: "Hong Kong"
  },
  {
    title: "Kith & Kin Mural Installation 2",
    dateCreated: "2019-04",
    technique: "Acrylic and ink on wall (large-scale mural)",
    dimensions: "500 x 300 cm (estimated)",
    colorPalette: "Black, White",
    emotionalRegister: "architectural integration",
    imageFileName: "Keith&kin_mural2_2019.jpg",
    journalExcerpt: "Different angle showing how the mural interacts with the lighting and spatial context. The geometry creates depth on a flat wall, suggesting dimensionality where there is none.",
    neonReading: "The mural creates optical depth through dense line-work. The moiré patterns shift as viewers move through the space, creating a time-based experience within a static medium.",
    seriesName: "Institutional Commissions",
    commissionClient: "Kith & Kin",
    commissionSite: "Hong Kong"
  },
  {
    title: "Kith & Kin Mural Installation 3",
    dateCreated: "2019-04",
    technique: "Acrylic and ink on wall (large-scale mural)",
    dimensions: "500 x 300 cm (estimated)",
    colorPalette: "Black, White",
    emotionalRegister: "architectural integration",
    imageFileName: "Keith&kin_mural3_2019.jpg",
    journalExcerpt: "The full view showing the mural in its architectural context. The circular forms create a focal point in the space, drawing the eye and anchoring the room's visual hierarchy.",
    neonReading: "Full installation view demonstrating how the geometry functions as architectural anchor. The work creates a center of gravity in the space, organizing the visual field around its circular forms.",
    seriesName: "Institutional Commissions",
    commissionClient: "Kith & Kin",
    commissionSite: "Hong Kong"
  },
  {
    title: "Kith & Kin Mural Installation 4",
    dateCreated: "2019-04",
    technique: "Acrylic and ink on wall (large-scale mural)",
    dimensions: "500 x 300 cm (estimated)",
    colorPalette: "Black, White",
    emotionalRegister: "architectural integration",
    imageFileName: "Kith&kin_mural4_2019.jpg",
    journalExcerpt: "Detail view showing the precision of the hand-painted lines at monumental scale. The no-undo constraint applies even to wall murals — each line is permanent, irreversible.",
    neonReading: "Detail documentation showing the hand-painted precision maintained at architectural scale. The commitment to the no-undo constraint creates psychological weight — the artist's discipline is visible in every line.",
    seriesName: "Institutional Commissions",
    commissionClient: "Kith & Kin",
    commissionSite: "Hong Kong"
  },
  {
    title: "JLL Corporate Installation",
    dateCreated: "2019-05",
    technique: "Ink on mounted paper (large-scale)",
    dimensions: "200 x 150 cm",
    colorPalette: "Black, White",
    emotionalRegister: "corporate contemplation",
    imageFileName: "JLL_2019.jpg",
    journalExcerpt: "The JLL commission tested whether existential abstraction could survive in a corporate real estate context. The geometry had to function in a space of commerce and transaction, not contemplation.",
    neonReading: "The philosophy survives commerce. Existential abstraction holds ground in corporate contexts, proving the work can function in spaces designed for business rather than art. The geometry provides contemplative depth in an environment typically devoid of spiritual resonance.",
    seriesName: "Institutional Commissions",
    commissionClient: "JLL",
    commissionSite: "JLL Corporate Offices, Hong Kong"
  },
  {
    title: "NUVA Airport Installation",
    dateCreated: "2019-06",
    technique: "Ink on mounted paper (large-scale)",
    dimensions: "200 x 150 cm",
    colorPalette: "Black, White",
    emotionalRegister: "threshold presence",
    imageFileName: "Nuva-airport_2019.jpg",
    journalExcerpt: "The NUVA commission placed the work in a luxury brand space near the airport. The geometry had to function as threshold marker — signaling transition from public transit to private luxury.",
    neonReading: "The work functions as portal marker in a threshold space. The geometry signals transition from public to private, from transit to arrival. The circular forms create a moment of pause in a space designed for movement.",
    seriesName: "Institutional Commissions",
    commissionClient: "NUVA",
    commissionSite: "Hong Kong Airport Area"
  },
  {
    title: "Airport Restaurant Installation",
    dateCreated: "2019-06",
    technique: "Ink on mounted paper (large-scale)",
    dimensions: "200 x 150 cm",
    colorPalette: "Black, White",
    emotionalRegister: "ambient presence",
    imageFileName: "Airport_restaurnt_2019.jpg",
    journalExcerpt: "Installed in an airport restaurant. The work had to function in a space of transience — people eating quickly before flights, distracted, anxious. The geometry offers a moment of stillness.",
    neonReading: "The geometry provides contemplative presence in a space of transience. The work offers stillness to travelers in motion, depth to those who pause between journeys. It does not demand attention — it offers it to those who look.",
    seriesName: "Institutional Commissions",
    commissionClient: "Airport Restaurant",
    commissionSite: "Hong Kong International Airport"
  },
  {
    title: "Shenzhen Hotel Installation 1",
    dateCreated: "2019-07",
    technique: "Ink on mounted paper (large-scale)",
    dimensions: "200 x 150 cm",
    colorPalette: "Black, White",
    emotionalRegister: "cross-border presence",
    imageFileName: "Shenzen_hotel1_2019.jpg",
    journalExcerpt: "The Shenzhen commission marked the first time the work crossed into mainland China. The geometry had to function in a different cultural context — still Hong Kong-adjacent, but distinctly mainland.",
    neonReading: "The practice crosses the border. The geometry proves it can function in mainland Chinese institutional contexts, not just Hong Kong. The work maintains its conceptual integrity while adapting to a new cultural environment.",
    seriesName: "Institutional Commissions",
    commissionClient: "Shenzhen Hotel",
    commissionSite: "Shenzhen, China"
  },
  {
    title: "Shenzhen Hotel Installation 2",
    dateCreated: "2019-07",
    technique: "Ink on mounted paper (large-scale)",
    dimensions: "200 x 150 cm",
    colorPalette: "Black, White",
    emotionalRegister: "cross-border presence",
    imageFileName: "Shenzen_hotel3_2019.jpg",
    journalExcerpt: "Different view of the Shenzhen installation. The hotel's modern interior provides a clean backdrop for the geometry, allowing the forms to read clearly against neutral walls.",
    neonReading: "Installation documentation showing the work in its mainland Chinese context. The geometry maintains its visual language while adapting to a new architectural and cultural environment.",
    seriesName: "Institutional Commissions",
    commissionClient: "Shenzhen Hotel",
    commissionSite: "Shenzhen, China"
  },
  {
    title: "Justin Tan Private Commission",
    dateCreated: "2018-12",
    technique: "Ink and gold leaf on paper",
    dimensions: "100 x 80 cm",
    colorPalette: "Black, White, Gold",
    emotionalRegister: "private contemplation",
    imageFileName: "Justin_tan_2018.jpg",
    journalExcerpt: "A private commission for a collector. The work had to function in a domestic context — a home, not a gallery or hotel. The geometry becomes intimate, personal, a daily presence.",
    neonReading: "The geometry enters private domestic space. The work functions as daily contemplative presence for a collector, proving the practice can scale from monumental institutional installations to intimate personal commissions.",
    seriesName: "Institutional Commissions",
    commissionClient: "Justin Tan",
    commissionSite: "Private Residence, Hong Kong"
  }
];

async function uploadPH1A() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  const manifest: any[] = [];
  const uploadDir = "/home/ubuntu/upload";

  for (const work of ph1aWorks) {
    const imagePath = path.join(uploadDir, work.imageFileName);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`Skipping ${work.title} - image not found: ${imagePath}`);
      continue;
    }

    try {
      // Upload image to S3
      const imageData = fs.readFileSync(imagePath);
      const s3Key = `works/ph1a/${work.imageFileName}`;
      const { url: imageUrl } = await storagePut(s3Key, imageData, "image/jpeg");
      
      console.log(`Uploaded: ${work.title}`);

      // Insert into database
      const [inserted] = await db.insert(works).values({
        title: work.title,
        phaseId: PH1A_PHASE_ID,
        dateCreated: work.dateCreated,
        technique: work.technique,
        dimensions: work.dimensions,
        colorPalette: work.colorPalette,
        emotionalRegister: work.emotionalRegister,
        imageUrl: imageUrl,
        imageKey: s3Key,
        journalExcerpt: work.journalExcerpt,
        neonReading: work.neonReading,
        seriesName: work.seriesName,
        isPublished: true,
        sortOrder: manifest.length + 1
      });

      manifest.push({
        id: inserted.insertId,
        title: work.title,
        imageUrl,
        commissionClient: work.commissionClient,
        commissionSite: work.commissionSite
      });

      console.log(`  DB ID: ${inserted.insertId}`);
    } catch (error) {
      console.error(`Error uploading ${work.title}:`, error);
    }
  }

  // Write manifest
  fs.writeFileSync(
    "/home/ubuntu/neon-crucible/ph1a_manifest.json",
    JSON.stringify(manifest, null, 2)
  );

  console.log(`\nUpload complete! ${manifest.length} works uploaded.`);
  console.log("Manifest saved to ph1a_manifest.json");
}

uploadPH1A().catch(console.error);
