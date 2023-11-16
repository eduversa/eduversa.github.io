import { createSitemap } from "sitemap";
import fs from "fs";

function generateSitemap() {
  console.log("Generating sitemap...");

  const baseUrl = "https://eduversa.github.io";
  const staticRoutes = ["/", "/about", "/contact", "/register", "/login"];
  const allRoutes = [...staticRoutes];

  const sitemap = createSitemap({
    hostname: baseUrl,
    cacheTime: 600000,
    urls: allRoutes.map((route) => ({
      url: route,
      changefreq: "daily",
      priority: 0.7,
    })),
  });

  const filePath = "./public/sitemap.xml";

  try {
    fs.writeFileSync(filePath, sitemap.toString());
    console.log("Sitemap successfully written to:", filePath);
  } catch (error) {
    console.error("Error writing sitemap:", error);
  }
}

export default generateSitemap;
