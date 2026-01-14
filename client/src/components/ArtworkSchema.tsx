import { useEffect } from "react";

interface ArtworkSchemaProps {
  work: {
    id: number;
    title: string;
    dateCreated?: string | null;
    technique?: string | null;
    dimensions?: string | null;
    imageUrl?: string | null;
    seriesName?: string | null;
    journalExcerpt?: string | null;
    neonReading?: string | null;
  };
  phaseCode?: string;
}

/**
 * Schema.org CreativeWork structured data for individual artworks
 * Enables rich snippets in Google Image Search and search results
 */
export function ArtworkSchema({ work, phaseCode }: ArtworkSchemaProps) {
  console.log('[ArtworkSchema] Component rendered for:', work.title, work.id);
  
  useEffect(() => {
    console.log('[ArtworkSchema] useEffect running for:', work.title, work.id);
    const schema: any = {
      "@context": "https://schema.org",
      "@type": "VisualArtwork",
      "name": work.title,
      "creator": {
        "@type": "Person",
        "name": "Peter Yuill",
        "jobTitle": "Contemporary Artist",
        "url": "https://peteryuill.art",
        "sameAs": [
          "https://peteryuill.art",
          "https://peter-yuill.manus.space",
          "https://instagram.com/peteryuill"
        ]
      },
      "dateCreated": work.dateCreated || undefined,
      "artMedium": work.technique || undefined,
      "artform": "Painting",
      "image": work.imageUrl || undefined,
      "url": `https://peteryuill.art/works?id=${work.id}`,
      "isPartOf": work.seriesName ? {
        "@type": "CreativeWorkSeries",
        "name": work.seriesName
      } : undefined,
      "description": work.neonReading || work.journalExcerpt || `${work.title} by Peter Yuill, ${work.technique || 'contemporary artwork'}, ${work.dateCreated || 'date unknown'}`,
      "keywords": [
        "Peter Yuill",
        "contemporary art",
        "Bangkok artist",
        work.technique,
        work.seriesName,
        phaseCode,
        "The Neon Crucible"
      ].filter(Boolean).join(", "),
      "inLanguage": "en",
      "copyrightHolder": {
        "@type": "Person",
        "name": "Peter Yuill"
      },
      "copyrightYear": work.dateCreated ? new Date(work.dateCreated).getFullYear() : undefined,
      "license": "All Rights Reserved"
    };

    // Add dimensions if available (format: "120x80cm" or "120cm x 80cm")
    if (work.dimensions) {
      const dimensionMatch = work.dimensions.match(/(\d+)\s*x\s*(\d+)/i);
      if (dimensionMatch) {
        const [_, height, width] = dimensionMatch;
        schema["height"] = {
          "@type": "QuantitativeValue",
          "value": height,
          "unitCode": "CMT" // centimeters
        };
        schema["width"] = {
          "@type": "QuantitativeValue",
          "value": width,
          "unitCode": "CMT"
        };
      }
    }

    // Create and inject schema script tag
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = `artwork-schema-${work.id}`;
    schemaScript.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(schemaScript);

    // Create and inject Open Graph meta tags
    const ogTags = [
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: `${work.title} | Peter Yuill` },
      { property: 'og:description', content: work.neonReading || work.journalExcerpt || `${work.title} by Peter Yuill, ${work.technique || 'contemporary artwork'}` },
      { property: 'og:url', content: `https://peteryuill.art/works?id=${work.id}` },
    ];

    if (work.imageUrl) {
      ogTags.push({ property: 'og:image', content: work.imageUrl });
    }

    const ogMetaTags = ogTags.map(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);
      meta.setAttribute('data-artwork-og', work.id.toString());
      return meta;
    });

    ogMetaTags.forEach(meta => document.head.appendChild(meta));

    // Cleanup function to remove schema and meta tags when component unmounts
    return () => {
      const existingSchema = document.getElementById(`artwork-schema-${work.id}`);
      if (existingSchema) {
        existingSchema.remove();
      }

      // Remove OG tags
      const ogMetas = document.querySelectorAll(`[data-artwork-og="${work.id}"]`);
      ogMetas.forEach(meta => meta.remove());
    };
  }, [work, phaseCode]);

  return null;
}
