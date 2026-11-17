import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** "GG" monogram on the brand terracotta. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c2501f",
          borderRadius: 14,
          color: "#fdf5ee",
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        GG
      </div>
    ),
    { ...size },
  );
}
