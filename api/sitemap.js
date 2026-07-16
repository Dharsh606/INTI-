export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).send("Supabase configuration keys missing.");
    return;
  }

  try {
    // Fetch project slugs, details, and gallery images from Supabase
    // We target the Supabase REST API (PostgREST) directly using standard fetch
    const response = await fetch(`${supabaseUrl}/rest/v1/projects?select=slug,created_at,title,hero_img,gallery_imgs`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase returned status ${response.status}`);
    }

    const projects = await response.json();

    // Get current date for lastmod formatting
    const currentDate = new Date().toISOString().split('T')[0];

    // Build the dynamic sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Primary Landing Page -->
  <url>
    <loc>https://inti.design/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://inti.design/assets/logo.png</image:loc>
      <image:title>INTI Luxury Interior Design Studio Bangalore India Logo</image:title>
    </image:image>
    <image:image>
      <image:loc>https://inti.design/assets/photo/z1.jpg</image:loc>
      <image:title>INTI Signature Luxury Space Bangalore India</image:title>
    </image:image>
  </url>
  
  <!-- Standalone Legal Pages -->
  <url>
    <loc>https://inti.design/privacy</loc>
    <lastmod>2026-07-16</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://inti.design/terms</loc>
    <lastmod>2026-07-16</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
`;

    // Append dynamic projects from the database
    for (const project of projects) {
      const projectDate = project.created_at ? project.created_at.split('T')[0] : currentDate;
      
      // Clean and safe titles/images
      const cleanTitle = (project.title || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      const heroImg = project.hero_img ? (project.hero_img.startsWith('http') ? project.hero_img : `https://inti.design${project.hero_img}`) : '';
      
      xml += `
  <url>
    <loc>https://inti.design/project?id=${project.slug}</loc>
    <lastmod>${projectDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>`;

      // Append Hero image
      if (heroImg) {
        xml += `
    <image:image>
      <image:loc>${heroImg}</image:loc>
      <image:title>${cleanTitle} Hero Image</image:title>
    </image:image>`;
      }

      // Append Gallery images
      if (Array.isArray(project.gallery_imgs)) {
        project.gallery_imgs.forEach((img, idx) => {
          if (img && img.trim() !== '') {
            const imgUrl = img.startsWith('http') ? img : `https://inti.design${img}`;
            xml += `
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${cleanTitle} Portfolio Gallery Asset ${idx + 1}</image:title>
    </image:image>`;
          }
        });
      }

      xml += `
  </url>`;
    }

    xml += `
</urlset>`;

    // Set XML content type headers and return response
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache on Edge CDN for 24 hours
    res.status(200).send(xml);

  } catch (error) {
    console.error("Sitemap generation error: ", error);
    res.status(500).send("Error generating sitemap dynamically.");
  }
}
