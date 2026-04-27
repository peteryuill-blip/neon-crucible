export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">

      {/* Summary */}
      <section className="mb-16">
        <p className="font-serif text-xl sm:text-2xl leading-relaxed text-foreground/90">
          Peter Yuill is a painter working at the intersection of sacred geometry,
          ink abstraction, and somatic mark-making. Based in Bangkok, his practice
          spans fifteen years across Hong Kong, Vietnam, and Southeast Asia. 259+
          works catalogued across eight distinct periods from geometric rigor to
          gestural surrender.
        </p>
      </section>

      {/* Practice */}
      <section className="mb-12">
        <h2 className="font-serif text-xl md:text-2xl mb-6 text-foreground">Practice</h2>
        <div className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            The work maps threshold states: moments where structure dissolves into
            intuition, where geometry becomes gesture. Each painting is a single-shot
            irreversible act: sumi ink on East Asian rice paper, no revision, no going back.
            The practice is both rigorous and surrendered, operating in the space between
            control and release.
          </p>
          <p>
            The practice evolved through eight periods (PH0A through NE), each representing
            a distinct approach to the same underlying question: what happens in the space
            between order and chaos? From early geometric grids and sacred geometry
            (2011-2023) to the somatic ink abstractions of the New Era (2025-present),
            the evolution is visible, documented, and witnessed.
          </p>
          <p>
            The current work, the Crucible Year, is an open-ended discipline in
            large-format sumi ink on raw Xuan paper. The methodology is precise: one shot,
            no revision, no going back. The results are tracked in real time across a
            private studio system called Neon.
          </p>
        </div>
      </section>

      {/* Materials & Process */}
      <section className="mb-12">
        <h2 className="font-serif text-xl md:text-2xl mb-6 text-foreground">Materials & Process</h2>
        <div className="space-y-4 text-foreground/80 leading-relaxed">
          <p>
            <strong className="text-foreground">Ink:</strong> Premium sumi inks (Yi De Ge,
            Xuan Zong) on East Asian rice paper. The ink is irreversible. Once it
            touches paper, the mark is permanent. This constraint shapes the entire
            practice: total presence, no revision, no undo.
          </p>
          <p>
            <strong className="text-foreground">Paper:</strong> Raw and semi-cooked Xuan
            paper from Anhui province, sourced in collaboration with specialist suppliers.
            Each substrate responds differently to pressure, dilution, and velocity.
            The paper is a collaborator, not a surface.
          </p>
          <p>
            <strong className="text-foreground">Sacred Geometry (prior periods):</strong> Grid
            systems drawn from Pythagorean, Islamic, and Vedic traditions. Each work began
            with compositional variations hand-drawn using custom geometric formulas. The
            geometry provided structure, but the work lived in how that structure broke down.
          </p>
        </div>
      </section>

      {/* Exhibitions */}
      <section className="mb-12">
        <h2 className="font-serif text-xl md:text-2xl mb-6 text-foreground">Exhibitions</h2>
        <ul className="space-y-3">
          {[
            { year: "2024", title: "Celestial Secrets", venue: "West Eden Gallery, Bangkok" },
            { year: "2023", title: "Rhapsody", venue: "Art Central, Hong Kong (VAIN Projects)" },
            { year: "2022", title: "Echoes", venue: "Kong Art Space, Hong Kong" },
            { year: "2020-21", title: "Equinox of the Gods", venue: "Jonathan LeVine Projects, Jersey City" },
            { year: "2020", title: "Alignment", venue: "Gallery HZ / Pearl Lam Galleries, Hong Kong" },
            { year: "2018", title: "The Absurdity of Meaning", venue: "Kong Art Space, Hong Kong" },
          ].map((ex) => (
            <li key={ex.year + ex.title} className="flex gap-6 text-sm border-b border-border/30 pb-3">
              <span className="font-mono text-muted-foreground shrink-0 w-16">{ex.year}</span>
              <span>
                <em className="text-foreground/90">{ex.title}</em>
                <span className="text-muted-foreground">, {ex.venue}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Collections & Commissions */}
      <section className="mb-12">
        <h2 className="font-serif text-xl md:text-2xl mb-6 text-foreground">Collections & Commissions</h2>
        <div className="text-sm text-foreground/80 leading-relaxed space-y-2">
          <p>
            Works held in private collections in Hong Kong, New York, London, and Bangkok.
          </p>
          <p className="text-muted-foreground">
            Institutional commissions: The Wharf (Holdings), Peninsula Hotels, Jones Lang
            LaSalle, Swire Properties, Soho House, NUVA Luxury, North Face (K11).
          </p>
        </div>
      </section>

      {/* Press */}
      <section className="mb-12">
        <h2 className="font-serif text-xl md:text-2xl mb-6 text-foreground">Press</h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Tatler Asia, Whitewall, GQ Thailand, Lifestyle Asia, Prestige Online,
            Thairath, CBC Canada</p>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-border pt-12">
        <h2 className="font-serif text-xl md:text-2xl mb-6 text-foreground">Contact</h2>
        <div className="space-y-2 text-sm">
          <p>
            For commissions, exhibitions, or inquiries:{" "}
            <a
              href="mailto:peteryuill@gmail.com"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              peteryuill@gmail.com
            </a>
          </p>
          <p className="text-muted-foreground">
            WhatsApp: +852 5932 6869
            <br />
            Bangkok, Thailand
          </p>
        </div>
      </section>

    </div>
  );
}
