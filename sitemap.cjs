const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");

async function generateSitemap() {
  console.log("Generating sitemap...");

  const baseUrl = "https://eduversa.github.io";
  const staticRoutes = ["/", "/about", "/contact", "/register", "/login"];
  const allRoutes = [...staticRoutes];

  const sitemapStream = new SitemapStream({ hostname: baseUrl });

  allRoutes.forEach((route) => {
    sitemapStream.write({ url: route, changefreq: "daily", priority: 0.7 });
  });

  sitemapStream.end();

  const filePath = "./public/sitemap.xml";

  try {
    const sitemapXml = await streamToPromise(sitemapStream).then((data) =>
      data.toString()
    );
    fs.writeFileSync(filePath, sitemapXml);
    console.log("Sitemap successfully written to:", filePath);
  } catch (error) {
    console.error("Error writing sitemap:", error);
  }
}

generateSitemap();
