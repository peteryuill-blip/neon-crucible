import { Request, Response } from "express";
import { getDb } from "./db";
import { works } from "../drizzle/schema";
import { eq, isNotNull } from "drizzle-orm";

const BASE_URL = "https://peteryuill.art";

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { url: "/",          changefreq: "weekly",  priority: "1.0" },
  { url: "/works",     changefreq: "weekly",  priority: "0.9" },
  { url: "/neon",      changefreq: "monthly", priority: "0.8" },
  { url: "/journey",   changefreq: "monthly", priority: "0.7" },
  { url: "/archive",   changefreq: "monthly", priority: "0.7" },
  { url: "/about",     changefreq: "monthly", priority: "0.6" },
  { url: "/press",     changefreq: "monthly", priority: "0.6" },
];

export async function sitemapHandler(_req: Request, res: Response) {
  try {
    const db = await getDb();

    let workEntries: { slug: string; updatedAt: Date | null }[] = [];

    if (db) {
      const rows = await db
        .select({ slug: works.slug, updatedAt: works.updatedAt })
        .from(works)
        .where(eq(works.isPublished, true));
      workEntries = rows
        .filter((r): r is { slug: string; updatedAt: Date } => typeof r.slug === 'string' && r.slug.length > 0);
    }

    const today = new Date().toISOString().split("T")[0];

    const urlTags = [
      // Static pages
      ...STATIC_PAGES.map(page => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`),

      // Dynamic work pages
      ...workEntries.map(work => {
        const lastmod = work.updatedAt
          ? work.updatedAt.toISOString().split("T")[0]
          : today;
        return `
  <url>
    <loc>${BASE_URL}/works/${work.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }),
    ].join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600"); // cache 1 hour
    res.status(200).send(xml);
  } catch (err) {
    console.error("[Sitemap] Error generating sitemap:", err);
    res.status(500).send("Error generating sitemap");
  }
}
