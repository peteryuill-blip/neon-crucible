import { Separator } from "@/components/ui/separator";
import { Building2, Calendar, MapPin, CheckCircle2 } from "lucide-react";

export default function Commissions() {
  const commissions = [
    {
      title: "Tidal",
      client: "Swire Properties",
      project: "The Headland",
      location: "Chai Wan, Hong Kong",
      year: "2025",
      scale: "300cm × 1000cm",
      format: "7-panel curved installation",
      materials: "Acrylic and spray paint on linen",
      duration: "6 weeks on-site",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663243139088/HBPLSsdFbphVwyis.jpg",
      description: "Monumental lunar cycle installation for main lobby rotunda. Seven curved panels depicting moon phases as a breathing cycle, integrating with the building's oculus ceiling. Site-specific meditation on containment, release, and architectural rhythm.",
      scope: ["Concept development", "On-site painting", "Architectural integration", "Feng shui consultation"]
    },
    {
      title: "Peninsula Hotels Collection",
      client: "Peninsula Hotels",
      project: "Multiple Properties",
      location: "Hong Kong, Bangkok",
      year: "2020-2023",
      scale: "Various scales",
      format: "Geometric abstractions",
      materials: "Ink and metallic paint on paper",
      duration: "Multi-year collaboration",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph1a/Peninsula_hotel_1.jpg",
      description: "Curated collection of geometric works for Peninsula Hotels properties. Precision-drawn sacred geometry pieces combining mathematical rigor with spiritual inquiry. Works selected for timeless elegance and architectural harmony.",
      scope: ["Artwork selection", "Custom framing", "Installation coordination", "Collection curation"]
    },
    {
      title: "Soho House Commissions",
      client: "Soho House",
      project: "Private Members Club",
      location: "Hong Kong",
      year: "2021-2022",
      scale: "Large format",
      format: "Mixed media abstractions",
      materials: "Ink, gold leaf, mixed media",
      duration: "18 months",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph1a/torus_1_soho_house_peteryuill.jpg",
      description: "Series of large-format works for Soho House Hong Kong interiors. Balancing bold visual presence with contemplative depth. Works designed to hold attention in high-traffic social spaces while rewarding sustained viewing.",
      scope: ["Site assessment", "Scale planning", "Material selection", "Installation supervision"]
    },
    {
      title: "Jones Lang LaSalle Corporate Collection",
      client: "Jones Lang LaSalle",
      project: "Corporate Headquarters",
      location: "Hong Kong",
      year: "2020",
      scale: "Medium to large format",
      format: "Alignment series",
      materials: "Ink, gold, copper on paper",
      duration: "3 months",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/alignment/the_limitless_path_of_the_intuitive_mind_1_peteryuill(1).jpg",
      description: "Corporate collection featuring works from the Alignment series. Gold and copper binary geometries encoding metaphysical systems—spirit and matter, eternal and temporal. Professional gravitas meeting philosophical depth.",
      scope: ["Collection design", "Corporate aesthetic alignment", "Delivery and installation"]
    },
    {
      title: "NUVA Luxury Residences",
      client: "NUVA Luxury",
      project: "High-End Residential",
      location: "Hong Kong",
      year: "2019-2020",
      scale: "Various scales",
      format: "Curated selection",
      materials: "Ink on paper, mixed media",
      duration: "Ongoing collaboration",
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph1a/Nuva-airport_2019.jpg",
      description: "Curated artworks for luxury residential developments. Works selected for sophisticated collectors seeking contemporary abstraction with philosophical substance. Balancing aesthetic impact with intellectual engagement.",
      scope: ["Collector consultation", "Artwork curation", "Framing and presentation"]
    }
  ];

  return (
    <div className="space-y-10 sm:space-y-16 pb-16 sm:pb-24">
      {/* Header */}
      <header className="space-y-4 sm:space-y-8 max-w-4xl">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold tracking-tighter">COMMISSIONS</h1>
        <div className="font-mono text-xs sm:text-sm text-primary border-l-2 border-primary pl-3 sm:pl-4">
          INSTITUTIONAL COLLABORATIONS | SITE-SPECIFIC WORKS | 2019—PRESENT
        </div>
        <div className="font-serif text-sm sm:text-lg leading-relaxed text-muted-foreground pt-4">
          <p>
            Over seven years, Peter Yuill has collaborated with leading institutions, luxury brands, and corporate clients to create site-specific works and curated collections. These commissions demonstrate that serious philosophical content can thrive within commercial contexts—works that hold civic weight without collapsing into decoration.
          </p>
        </div>
      </header>

      <Separator className="bg-border max-w-6xl" />

      {/* Featured Commission - Tidal */}
      <section className="space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <h2 className="font-mono text-[10px] sm:text-sm tracking-widest text-primary">FEATURED: TIDAL (2025)</h2>
          <h3 className="text-xl sm:text-3xl font-bold">Swire Properties — The Headland</h3>
        </div>

        <div className="relative aspect-[21/9] overflow-hidden border border-border bg-muted">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663243139088/HBPLSsdFbphVwyis.jpg"
            alt="Peter Yuill - Tidal, 7-panel curved installation showing lunar phases, acrylic and spray paint on linen, 300cm x 1000cm, Swire Properties The Headland rotunda, 2025"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="font-serif text-xs sm:text-base leading-relaxed text-muted-foreground space-y-4">
              <p>
                <strong className="text-foreground">Largest single commission to date.</strong> Seven curved panels spanning 10 meters across The Headland's main lobby rotunda in Chai Wan, Hong Kong. Completed December 2025 after six weeks of daily on-site painting.
              </p>
              <p>
                The work translates lunar phases into a breathing cycle—each crescent is a held breath, the central sphere an exhale. The building's oculus ceiling mirrors the central moon, creating an unplanned architectural circuit. Monument-scale permanence pursued through the most fragile means: acrylic and spray paint on linen, curved to suggest gravitational pull.
              </p>
              <p>
                <em className="text-foreground">"The commission asked for lunar phases. I gave them a breathing cycle. The architecture itself became the ribcage."</em>
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-3 p-4 sm:p-6 border border-border bg-card">
              <h4 className="font-mono text-[10px] sm:text-xs tracking-widest text-primary">PROJECT DETAILS</h4>
              <div className="space-y-2 font-mono text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <div>
                    <div className="text-foreground">Swire Properties</div>
                    <div>The Headland, Chai Wan</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <div>Hong Kong</div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <div>December 2025</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 sm:p-6 border border-border bg-card">
              <h4 className="font-mono text-[10px] sm:text-xs tracking-widest text-primary">SPECIFICATIONS</h4>
              <div className="space-y-1 font-mono text-xs sm:text-sm text-muted-foreground">
                <div>300cm × 1000cm</div>
                <div>7-panel curved format</div>
                <div>Acrylic, spray paint on linen</div>
                <div>6 weeks on-site execution</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-border max-w-6xl" />

      {/* All Commissions */}
      <section className="space-y-8 sm:space-y-12">
        <h2 className="font-mono text-[10px] sm:text-sm tracking-widest text-primary max-w-4xl">INSTITUTIONAL COLLABORATIONS</h2>

        <div className="grid grid-cols-1 gap-8 sm:gap-12 max-w-6xl">
          {commissions.slice(1).map((commission, index) => (
            <div key={index} className="space-y-6 sm:space-y-8 pb-8 sm:pb-12 border-b border-border last:border-0">
              {/* Commission Image */}
              {commission.image && (
                <div className="relative aspect-[16/9] overflow-hidden border border-border bg-muted">
                  <img
                    src={commission.image}
                    alt={`Peter Yuill - ${commission.title}, ${commission.materials}, ${commission.client}, ${commission.year}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-2xl font-bold">{commission.title}</h3>
                  <div className="font-mono text-xs sm:text-sm text-primary">
                    {commission.client} — {commission.year}
                  </div>
                </div>

                <div className="font-serif text-xs sm:text-base leading-relaxed text-muted-foreground">
                  <p>{commission.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-mono text-[10px] sm:text-xs tracking-widest text-foreground">SCOPE OF WORK</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {commission.scope.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 font-mono text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-3 p-4 sm:p-6 border border-border bg-card">
                  <h4 className="font-mono text-[10px] sm:text-xs tracking-widest text-primary">DETAILS</h4>
                  <div className="space-y-2 font-mono text-xs text-muted-foreground">
                    <div>
                      <div className="text-foreground text-[10px] tracking-wider mb-1">CLIENT</div>
                      <div>{commission.client}</div>
                    </div>
                    <div>
                      <div className="text-foreground text-[10px] tracking-wider mb-1">LOCATION</div>
                      <div>{commission.location}</div>
                    </div>
                    <div>
                      <div className="text-foreground text-[10px] tracking-wider mb-1">SCALE</div>
                      <div>{commission.scale}</div>
                    </div>
                    <div>
                      <div className="text-foreground text-[10px] tracking-wider mb-1">MATERIALS</div>
                      <div>{commission.materials}</div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-border max-w-6xl" />

      {/* Commission Process */}
      <section className="space-y-6 sm:space-y-8 max-w-4xl">
        <h2 className="font-mono text-[10px] sm:text-sm tracking-widest text-primary">COMMISSION PROCESS</h2>

        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-xl font-bold">1. Initial Consultation</h3>
            <div className="font-serif text-xs sm:text-base leading-relaxed text-muted-foreground">
              <p>
                Discussion of project goals, site context, architectural integration, and conceptual direction. Review of existing work and exploration of how the practice's philosophical framework can serve the specific space and audience.
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-xl font-bold">2. Concept Development</h3>
            <div className="font-serif text-xs sm:text-base leading-relaxed text-muted-foreground">
              <p>
                Detailed proposal including scale, materials, color palette, and conceptual framework. For site-specific works, this includes architectural drawings, material samples, and visual references. Timeline and budget established.
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-xl font-bold">3. Execution</h3>
            <div className="font-serif text-xs sm:text-base leading-relaxed text-muted-foreground">
              <p>
                Studio or on-site creation depending on project scope. For large installations, scaffolding and extended on-site presence. Regular progress documentation and client updates. Collaboration with design teams, architects, and feng shui consultants as needed.
              </p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-xl font-bold">4. Installation & Documentation</h3>
            <div className="font-serif text-xs sm:text-base leading-relaxed text-muted-foreground">
              <p>
                Professional installation, lighting consultation, and final adjustments. High-resolution photography for documentation and archival purposes. Certificates of authenticity and care instructions provided.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-border max-w-6xl" />

      {/* Why Commission */}
      <section className="space-y-6 sm:space-y-8 max-w-4xl">
        <h2 className="font-mono text-[10px] sm:text-sm tracking-widest text-primary">WHY COMMISSION PETER YUILL</h2>

        <div className="space-y-4 sm:space-y-6 font-serif text-xs sm:text-base leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Philosophical substance meets commercial viability.</strong> Seven years of documented practice demonstrate consistent visual language, technical mastery, and conceptual rigor. Works that hold attention in high-traffic spaces while rewarding sustained contemplation.
          </p>
          <p>
            <strong className="text-foreground">Site-specific intelligence.</strong> Deep understanding of architectural integration, feng shui principles, and spatial psychology. Works designed to enhance—not compete with—their environments.
          </p>
          <p>
            <strong className="text-foreground">Institutional credibility.</strong> Proven track record with Peninsula Hotels, Swire Properties, Soho House, Jones Lang LaSalle. Experience navigating corporate decision-making, design committees, and multi-stakeholder projects.
          </p>
          <p>
            <strong className="text-foreground">Timeless aesthetic.</strong> Avoids trend-dependency. Geometric abstraction grounded in sacred mathematics and existential philosophy—designed for longevity, not fashion cycles.
          </p>
        </div>
      </section>

      <Separator className="bg-border max-w-6xl" />

      {/* Contact */}
      <section className="space-y-6 sm:space-y-8 max-w-4xl">
        <h2 className="font-mono text-[10px] sm:text-sm tracking-widest text-primary">INQUIRIES</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-mono text-xs sm:text-sm text-foreground">CONTACT</h3>
            <div className="space-y-1 sm:space-y-2 font-mono text-xs sm:text-sm text-muted-foreground">
              <p>PETERYUILL@GMAIL.COM</p>
              <p>WHATSAPP: +852 5932 6869</p>
              <p>BANGKOK, THAILAND</p>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-mono text-xs sm:text-sm text-foreground">AVAILABILITY</h3>
            <div className="space-y-1 sm:space-y-2 font-mono text-xs sm:text-sm text-muted-foreground">
              <p>ACCEPTING COMMISSIONS 2025</p>
              <p>LEAD TIME: 3-6 MONTHS</p>
              <p>SITE VISITS: ASIA-PACIFIC</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border border-primary bg-primary/5 font-mono text-xs sm:text-sm text-foreground">
          <p>
            <strong>NOTE:</strong> Commission inquiries require initial consultation (virtual or in-person). Portfolio review, site assessment, and conceptual alignment discussion precede formal proposals.
          </p>
        </div>
      </section>
    </div>
  );
}
