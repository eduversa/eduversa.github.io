const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");

async function generateSitemap() {
  console.log("Generating sitemap...");

  const baseUrl = "https://eduversa.github.io";
  const staticRoutes = ["/", "/about", "/contact", "/register", "/login"];

  // Define priorities for each route
  const routePriorities = {
    "/": 1,
    "/about": 0.7,
    "/contact": 0.6,
    "/register": 0.9,
    "/login": 0.8,
    // Add more routes and their priorities as needed
  };

  const allRoutes = staticRoutes;

  const sitemapStream = new SitemapStream({ hostname: baseUrl });

  allRoutes.forEach((route) => {
    const priority = routePriorities[route] || 0.5;
    sitemapStream.write({ url: route, changefreq: "daily", priority });
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
