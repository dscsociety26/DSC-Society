import { writeFile } from "node:fs/promises";

const SITE_URL = "https://dscsociety.org";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required to generate the sitemap."
  );
}

const staticPages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/activities", changefreq: "weekly", priority: "0.9" },
  { path: "/events", changefreq: "weekly", priority: "0.9" },
  { path: "/focus-areas", changefreq: "monthly", priority: "0.8" },
  { path: "/gallery", changefreq: "weekly", priority: "0.8" },
  { path: "/join-us", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
];

const response = await fetch(
  `${SUPABASE_URL}/rest/v1/team_members?select=slug&status=eq.published&order=display_order.asc`,
  {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  }
);

if (!response.ok) {
  const errorText = await response.text();
  throw new Error(
    `Failed to fetch published team members: ${response.status} ${errorText}`
  );
}

const teamMembers = await response.json();

const teamPages = teamMembers
  .filter((member) => member.slug)
  .map((member) => ({
    path: `/team/${encodeURIComponent(member.slug)}`,
    changefreq: "monthly",
    priority: "0.7",
  }));

const pages = [...staticPages, ...teamPages];

const urls = pages
  .map(
    ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls}

</urlset>
`;

await writeFile("public/sitemap.xml", sitemap, "utf8");

console.log(
  `Sitemap generated successfully: ${staticPages.length} static pages + ${teamPages.length} team profiles.`
);
