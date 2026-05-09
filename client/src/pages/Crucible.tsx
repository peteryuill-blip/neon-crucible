import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const CYAN = "#00FFCC";
const MAGENTA = "#d946ef";

const SUB_PAGES = [
  {
    href: "/crucible/works",
    number: "01",
    title: "The Archive",
    desc: "Every work made inside the year, weighted by curatorial significance.",
  },
  {
    href: "/crucible/materials",
    number: "02",
    title: "Substrate & Ink",
    desc: "Twelve papers, six inks. The grammar of the year.",
  },
  {
    href: "/crucible/time",
    number: "03",
    title: "The Year Unfolding",
    desc: "Quality arc, kill rate, weekly volume — the year as it moves.",
  },
  {
    href: "/crucible/anatomy",
    number: "04",
    title: "Anatomy of the Year",
    desc: "The same archive without time. Structure, distribution, apex.",
  },
];

const validWorks = useMemo(() => {
  if (!allWorks) return [];

  return allWorks.filter((work) => {
    // PASS 1: The Hard "TR" Wall
    if (work.disposition === "TR") return false;

    // PASS 2: Probabilistic Extraction
    // We dig into the somatic metadata we synced earlier
    try {
      const oracleData = work.technicalObservation ? JSON.parse(work.technicalObservation) : null;
      
      // If the Oracle has already flagged it as a 'kill' or it's 'Probably Trash', 
      // we don't display it, even if the disposition column is empty.
      const isProbablyTrash = oracleData?.matrix_flags?.is_kill === true;
      const isConfirmedSave = work.disposition === "SA" || oracleData?.matrix_flags?.is_save === true;
      
      // LOGIC: Discard if 'is_kill' is true AND it's not a confirmed 'SA'
      if (isProbablyTrash && !isConfirmedSave) return false;

      // PASS 3: Minimum Quality Threshold (Optional)
      // Only show works that have 'Potential' (Rating > 2 or confirmed Save)
      if ((work.rating || 0) < 2 && !isConfirmedSave) return false;

    } catch (e) {
      // Fallback: If JSON is corrupt, default to showing only if not TR
      return work.disposition !== "TR";
    }

    return true;
  });
}, [allWorks]);


const Crucible = () => {
  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="max-w-3xl mx-auto py-16 sm:py-24 px-4 space-y-32 sm:space-y-40">

        {/* TLDR */}
        <section>
          <p className="font-mono text-[11px] sm:text-xs tracking-wider uppercase text-muted-foreground italic leading-relaxed max-w-2xl">
            For 2026, Peter Yuill is in the studio with sumi ink and Chinese
            rice paper, making large work, in a one-year intensive he calls
            the Crucible Year. This site goes up as the work gets made.
          </p>
        </section>

        {/* ATMOSPHERIC THRESHOLD */}
        <section className="space-y-10 sm:space-y-14">
          <p className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight leading-[1.1]">
            What this studio destroys, it records.
          </p>

          <p className="font-serif text-xl sm:text-2xl md:text-[1.65rem] font-light leading-snug text-foreground/90">
            The destruction is not theatre and the record is not
            afterthought. They are the practice itself, two motions of one
            hand, and they form a position Peter has held since long before
            this studio was built, since long before this year of intensive
            practice gave it a name.
          </p>

          <p className="font-serif text-xl sm:text-2xl md:text-[1.65rem] font-light leading-snug text-foreground/90">
            He has stated this publicly, in writing and in conversation:
            that the volcanic and the meticulous are not opposites in his
            work but two sides of one coin. The gesture on the page would
            be bravado without the ledger beside it. The ledger without the
            gesture would be a clerk's office. Either failure is available.
            He has chosen the harder thing, which is to keep both.
          </p>

          <p className="font-serif text-xl sm:text-2xl md:text-[1.65rem] font-light leading-snug text-foreground/90">
            The wager is whether the conviction Peter has carried since his
            early twenties is real, or whether he has been the most
            persuasive audience of his own life. He named the question in
            his own hand before the studio was built, in the words people
            use when they have stopped being polite to themselves. The work
            made on the table and the work counted in the notebooks:
            nothing else will answer it.
          </p>

          <p className="font-serif text-xl sm:text-2xl md:text-[1.65rem] font-light leading-snug text-foreground/90">
            The room where the work is made is loud and fast. The room
            where the work is counted is quiet and slow. They share a wall.
            He has not built that wall higher and he has not torn it down.
            The argument of his practice is that the wall should stay
            exactly where it is.
          </p>

          <p className="font-serif text-xl sm:text-2xl md:text-[1.65rem] font-light leading-snug text-foreground/90">
            The journals record what the gestures cost. The works record
            what the journals are for. Neither side is the explanation of
            the other. They are the two halves of a single position, held
            across every year he has worked.
          </p>

          <div className="py-10 sm:py-16">
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-tight" style={{ color: CYAN }}>
              Both rooms are open.
            </p>
          </div>
        </section>

        {/* ORIENTATION */}
        <section className="space-y-8">
          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            The Crucible Year is an intensive studio practice undertaken by
            Peter Yuill beginning in January 2026. The work consists
            primarily of large-format ink paintings on Chinese rice paper,
            produced continuously in his Bangkok studio. Every work is
            documented at the moment of completion. Each sheet that leaves
            the table, including the ones that are killed, is photographed
            and entered into the archive with its full record: paper, ink,
            dimensions, hours worked, tools used, date, notes, rating, and
            disposition. The site below is the ongoing contents of that
            record.
          </p>

          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/75 italic pl-6 border-l border-white/15">
            The works, the data, the studio logs, the substrate analyses,
            the weekly roundups, and the rolling archive of what survived
            and what did not.
          </p>

          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            The documentation is updated as the work is produced. Nothing
            has been added retroactively. The numbers do not lie because
            the ink does not lie. They are the two halves of a single
            record.
          </p>
        </section>

        {/* THE PRACTICE */}
        <section className="space-y-8">
          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            Peter's Bangkok studio is built around a single custom plywood
            table, topped with heavy wool felt, accessible from all four
            sides. Paper lies flat on the felt. He works from above, using
            sumi ink on Chinese rice paper, at a scale that requires the
            whole arm and frequently the whole body. Gravity is part of
            the method, not a problem to be managed.
          </p>

          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            The work is large at the scale of Peter's body. A picture made
            for the wrist looks like a picture made for the wrist. A
            picture made for the body has a different physical signature:
            the arc of the swing, the weight that travels through the
            shoulder, the moment the torso commits before the hand does.
            He stands at the table, and the marks register the body that
            made them at the scale at which the body operates. The
            relationship between body and work is not metaphor. It is the
            physical fact the practice is built on.
          </p>

          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            The medium is directionally irreversible. Ink goes onto paper
            and stays. Different substrates carry that direction
            differently. The raw paper commits hard on first contact,
            taking the mark whole, with no negotiation past the
            millisecond the brush touches down. The semi-cooked paper is
            more forgiving in the early seconds and unforgiving across the
            longer time scale: it can sustain five or six layers before it
            is exhausted. The bark paper has its own slower temper. Each
            substrate has a behavioral fingerprint Peter has learned by
            working it. But the direction is always additive. Marks can be
            built upon. Nothing can be retracted.
          </p>

          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            The standard is one-shot integrity. Hesitation does not
            survive contact regardless of how many layers follow. Works
            that fail this standard are removed from the archive and
            destroyed. Peter calls them the Tithe, drawing on the
            religious vocabulary of necessary offerings. The Tithe is not
            a metaphor. It is an actual pile of paper that gets smaller as
            the year goes on, the cost the surviving work pays for being
            legible as work.
          </p>

          <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/85">
            This is the Crucible Year. This body, at this scale, on this
            paper, under this standard, produces work that could not be
            produced any other way. The site is the record of what the
            table kept.
          </p>
        </section>

        {/* SUB-NAV — bottom only */}
        <section className="space-y-10 pt-12 border-t border-white/10">
          <div className="space-y-3">
            <div className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              The Record
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-tight">
              Four ways into the year
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUB_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group border border-white/10 p-6 sm:p-7 hover:border-[#00FFCC]/40 transition-colors block"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    Section {page.number}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#00FFCC] group-hover:translate-x-1 transition-all" />
                </div>
                <div className="font-serif text-xl sm:text-2xl font-light leading-tight mb-3 group-hover:text-[#00FFCC] transition-colors">
                  {page.title}
                </div>
                <div className="font-serif text-sm text-foreground/65 leading-relaxed">
                  {page.desc}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* LIVE INDICATOR */}
        <section className="pt-8 flex items-center gap-3 font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: CYAN }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: CYAN }} />
          </span>
          <span>The year is not finished · live</span>
        </section>

      </div>
    </div>
  );
};

export default Crucible;
