const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");

async function generateSitemap() {
  console.log("Generating sitemap...");

  const baseUrl = "https://eduversa.github.io";
  const staticRoutes = [
    "/",
    "/about",
    "/contact",
    "/register",
    "/forgetpassword",
    "/forgetusername",
    "/applicant",
    "/applicant/about",
    "/applicant/contact",
    "/applicant/update",
    "/student",
    "/student/about",
    "/student/contact",
    "/student/update",
    "/admin",
    "/admin/about",
    "/admin/contact",
    "/admin/manage/applicants",
    "/admin/manage/students",
    "/admin/update/applicants",
    "/admin/update/students",
  ];

  const routePriorities = {
    "/": 1,
    "/about": 0.7,
    "/contact": 0.6,
    "/register": 0.9,
    "/forgetpassword": 0.8,
    "/forgetusername": 0.8,
    "/applicant": 0.8,
    "/applicant/about": 0.8,
    "/applicant/contact": 0.8,
    "/applicant/update": 0.8,
    "/student": 0.8,
    "/student/about": 0.8,
    "/student/contact": 0.8,
    "/student/update": 0.8,
    "/admin": 0.8,
    "/admin/about": 0.8,
    "/admin/contact": 0.8,
    "/admin/manage/applicants": 0.8,
    "/admin/manage/students": 0.8,
    "/admin/update/applicants": 0.8,
    "/admin/update/students": 0.8,
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
