import type { MetadataRoute } from "next";
import { businessInfo } from "@/data/businessInfo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: businessInfo.siteUrl.replace(/\/$/, ""),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
