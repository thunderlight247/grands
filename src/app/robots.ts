import type { MetadataRoute } from "next";
import { businessInfo } from "@/data/businessInfo";

export default function robots(): MetadataRoute.Robots {
  const site = businessInfo.siteUrl.replace(/\/$/, "");
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
