import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eensell.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/workspace/", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/workspace/", "/api/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: [
          "/",
          "/favicon.ico",
          "/icon.png",
          "/icon.svg",
          "/icon-48.png",
          "/icon-96.png",
          "/icon-192.png",
          "/icon-512.png",
          "/apple-icon.png",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
