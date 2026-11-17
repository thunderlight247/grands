import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { businessInfo } from "@/data/businessInfo";

export const alt = `${businessInfo.name}: Ghanaian, Nigerian and continental dishes in Bortianor`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 1200×630 share card: platter photo on the right, name and details on the left. */
export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public/images/hero-mixed-platter.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#1c1917" }}>
        <div
          style={{
            width: 600,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            color: "#fafaf9",
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#eca577" }}>
            Bortianor · Accra
          </div>
          <div style={{ marginTop: 20, fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            {businessInfo.name}
          </div>
          <div style={{ marginTop: 24, fontSize: 28, lineHeight: 1.35, color: "#d6d3d1" }}>
            Ghanaian, Nigerian &amp; continental plates, cooked fresh daily.
          </div>
          <div
            style={{
              marginTop: 36,
              display: "flex",
              alignSelf: "flex-start",
              padding: "12px 24px",
              borderRadius: 999,
              background: "#c2501f",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Order on WhatsApp
          </div>
        </div>
        <img src={src} alt="" width={630} height={630} style={{ width: 600, height: 630, objectFit: "cover" }} />
      </div>
    ),
    { ...size },
  );
}
