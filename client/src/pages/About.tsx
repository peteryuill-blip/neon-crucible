export default function About() {
  return (
    <div className="about-page">
      <div className="max-w-3xl mx-auto py-16 px-4">
        
        {/* SECTION 1: Summary */}
        <section className="summary mb-12">
          <p className="text-lg leading-relaxed">
            Peter Yuill is a painter working at the intersection of sacred geometry, 
            ink abstraction, and threshold cosmology. Based in Bangkok since 2018, 
            his practice is an archive of seven years—163 paintings catalogued, 
            spanning seven distinct phases from geometric rigor to somatic intuition.
          </p>
        </section>

        {/* SECTION 2: Practice */}
        <section className="practice mb-12">
          <h2 className="font-serif text-xl md:text-2xl mb-4">Practice</h2>
          <p className="leading-relaxed mb-4">
            The work maps threshold states—moments where structure dissolves into 
            intuition, where geometry becomes gesture. Each painting is a single-shot 
            irreversible act: ink on paper, no revision, no going back. The practice 
            is both rigorous and surrendered, operating in the space between control 
            and release.
          </p>
          <p className="leading-relaxed mb-4">
            The archive spans seven phases (PH1-PH7), each representing a distinct 
            approach to the same underlying question: What happens in the space 
            between order and chaos? From early geometric grids (2018–2020) to later 
            somatic abstractions and color explosions (2021–2024), the evolution is 
            visible, documented, catalogued.
          </p>
          <p className="leading-relaxed">
            In December 2024, Yuill began studying traditional East Asian ink painting 
            under master teacher Man Luen Choon in Hong Kong, integrating 20+ years of 
            lived experience in Asia with rigorous classical training. The New Era 
            practice (2025–present) combines sacred geometry's mathematical precision 
            with Zen spontaneity.
          </p>
        </section>

        {/* SECTION 3: Materials & Process */}
        <section className="materials mb-12">
          <h2 className="font-serif text-xl md:text-2xl mb-4">Materials & Process</h2>
          <p className="leading-relaxed mb-4">
            <strong>Ink:</strong> Sumi ink and high-flow acrylic ink on cotton paper. 
            The ink is irreversible—once it touches paper, the mark is permanent. This 
            constraint shapes the entire practice: total presence, no revision, no undo.
          </p>
          <p className="leading-relaxed mb-4">
            <strong>Gold Leaf:</strong> 24k gold leaf applied as geometric accent 
            or threshold marker. The gold functions as both material presence and 
            alchemical symbol—transformation captured in metal. Introduced in the 
            <em>Alignment</em> series (2020) to encode metaphysical binaries: spirit 
            and matter, eternal and temporal.
          </p>
          <p className="leading-relaxed">
            <strong>Sacred Geometry:</strong> Underlying grid systems drawn from 
            Pythagorean, Islamic, and Vedic traditions. Each work begins with 30 
            compositional variations; each line is hand-drawn using custom geometric 
            formulas, never mechanical aids. The geometry provides structure, but the 
            work lives in how that structure breaks down.
          </p>
        </section>

        {/* SECTION 4: Exhibitions & Clients */}
        <section className="exhibitions mb-12">
          <h2 className="font-serif text-xl md:text-2xl mb-4">Exhibitions & Clients</h2>
          <ul className="space-y-2">
            <li className="text-sm">
              <span className="font-mono text-muted">2024</span> — <em>Celestial Secrets</em>, West Eden Gallery, Bangkok
            </li>
            <li className="text-sm">
              <span className="font-mono text-muted">2020</span> — <em>Equinox of the Gods</em>, Jonathan LeVine Projects, NYC
            </li>
            <li className="text-sm">
              <span className="font-mono text-muted">2020</span> — <em>Alignment</em>, Gallery HZ, Pearl Lam Galleries, Hong Kong
            </li>
            <li className="text-sm">
              <span className="font-mono text-muted">2018</span> — <em>The Absurdity of Meaning</em>, Kong Art Space, Hong Kong
            </li>
            <li className="text-sm">
              <span className="font-mono text-muted">—</span> — Institutional Commissions: Peninsula Hotels, Jones Lang LaSalle, Soho House, NUVA Luxury
            </li>
          </ul>
        </section>

        {/* SECTION 5: Contact */}
        <section className="contact">
          <h2 className="font-serif text-xl md:text-2xl mb-4">Contact</h2>
          <p className="text-sm">
            For commissions, exhibitions, or inquiries:<br />
            <a 
              href="mailto:peteryuill@gmail.com" 
              className="text-primary hover:text-secondary transition-colors"
            >
              peteryuill@gmail.com
            </a>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            WhatsApp: +852 5932 6869<br />
            Bangkok, Thailand
          </p>
        </section>

      </div>
    </div>
  );
}
