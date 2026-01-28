import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Commissions() {
  const commissions = [
    {
      id: "1",
      title: "Tidal",
      client: "Swire Properties",
      project: "The Headland",
      location: "Chai Wan, Hong Kong",
      year: "2025",
      imageUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663243139088/HBPLSsdFbphVwyis.jpg",
      description: "Monumental lunar cycle installation for main lobby rotunda. Seven curved panels depicting moon phases as a breathing cycle, integrating with the building's oculus ceiling. Site-specific meditation on containment, release, and architectural rhythm. 300cm × 1000cm, 7-panel curved installation, acrylic and spray paint on linen.",
    },
    {
      id: "2",
      title: "Peninsula Hotels Collection",
      client: "Peninsula Hotels",
      project: "Multiple Properties",
      location: "Hong Kong, Bangkok",
      year: "2020-2023",
      imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph1a/Peninsula_hotel_1.jpg",
      description: "Curated collection of geometric works for Peninsula Hotels properties. Precision-drawn sacred geometry pieces combining mathematical rigor with spiritual inquiry. Works selected for timeless elegance and architectural harmony. Multi-year collaboration featuring ink and metallic paint on paper.",
    },
    {
      id: "3",
      title: "Soho House Commissions",
      client: "Soho House",
      project: "Private Members Club",
      location: "Hong Kong",
      year: "2021-2022",
      imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph1a/torus_1_soho_house_peteryuill.jpg",
      description: "Series of large-format works for Soho House Hong Kong interiors. Balancing bold visual presence with contemplative depth. Works designed to hold attention in high-traffic social spaces while rewarding sustained viewing. Ink, gold leaf, and mixed media on paper.",
    },
    {
      id: "4",
      title: "Jones Lang LaSalle Corporate Collection",
      client: "Jones Lang LaSalle",
      project: "Corporate Headquarters",
      location: "Hong Kong",
      year: "2020",
      imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/alignment/the_limitless_path_of_the_intuitive_mind_1_peteryuill(1).jpg",
      description: "Corporate collection featuring works from the Alignment series. Gold and copper binary geometries encoding metaphysical systems—spirit and matter, eternal and temporal. Professional gravitas meeting philosophical depth. Medium to large format ink, gold, and copper on paper.",
    },
    {
      id: "5",
      title: "NUVA Luxury Residences",
      client: "NUVA Luxury",
      project: "High-End Residential",
      location: "Hong Kong",
      year: "2019-2020",
      imageUrl: "https://d2xsxph8kpxj0f.cloudfront.net/310519663243139088/ZLCef8c8rdYgPCof2teogL/works/ph1a/Nuva-airport_2019.jpg",
      description: "Curated artworks for luxury residential developments. Works selected for sophisticated collectors seeking contemporary abstraction with philosophical substance. Balancing aesthetic impact with intellectual engagement. Ink on paper and mixed media.",
    },
  ];

  return (
    <div className="commissions-page">
      
      {/* SECTION 1: Selected Clients (MOVED TO TOP) */}
      <section className="clients py-8 px-4 border-b border-border">
        <h2 className="font-mono text-sm text-muted-foreground text-center mb-8 uppercase tracking-wider">
          Selected Clients
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          <p className="text-center text-sm text-muted-foreground">Swire Properties</p>
          <p className="text-center text-sm text-muted-foreground">Peninsula Hotels</p>
          <p className="text-center text-sm text-muted-foreground">Soho House</p>
          <p className="text-center text-sm text-muted-foreground">Jones Lang LaSalle</p>
          <p className="text-center text-sm text-muted-foreground">NUVA Luxury</p>
        </div>
      </section>

      {/* SECTION 2: Case Studies (UPDATED WITH CTAs) */}
      <section className="case-studies py-16 px-4">
        {commissions.map((project) => (
          <div key={project.id} className="mb-16 max-w-4xl mx-auto">
            {/* Project image */}
            <img 
              src={project.imageUrl} 
              alt={`${project.title} - ${project.client}`}
              className="w-full aspect-video object-cover rounded-lg mb-6"
            />
            
            {/* Project title */}
            <h3 className="font-serif text-2xl mb-2">{project.title}</h3>
            
            {/* Project metadata */}
            <p className="text-muted-foreground text-sm mb-4">
              {project.client} • {project.year}
            </p>
            
            {/* Project description */}
            <p className="leading-relaxed mb-6">{project.description}</p>
            
            {/* CTA button */}
            <Button variant="default" asChild>
              <Link href="/contact">Inquire About Commissions</Link>
            </Button>
          </div>
        ))}
      </section>

      {/* SECTION 3: Inquiry CTA (NEW - Final Conversion Point) */}
      <section className="inquiry-cta py-16 px-4 bg-card text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl mb-4">Ready to commission a work?</h2>
          <p className="text-muted-foreground mb-8">
            Each commission begins with a conversation about vision, context, and intent. 
            Projects typically range from 4-12 weeks depending on scale and complexity.
          </p>
          <Button variant="default" size="lg" asChild>
            <Link href="/contact">Start a Conversation</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
