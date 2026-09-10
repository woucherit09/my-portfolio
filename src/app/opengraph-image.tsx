import { ImageResponse } from "next/og";

export const alt = "Константин Матейкович — Fullstack-разработчик";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#e8e8ea",
          background: "linear-gradient(135deg, #0a0a0f 0%, #10172e 70%, #182f69 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ color: "#7c9cff", fontSize: 28 }}>FULLSTACK-РАЗРАБОТЧИК</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, fontWeight: 700, lineHeight: 0.98 }}>
          <span>Константин</span>
          <span>Матейкович</span>
        </div>
        <div style={{ color: "#a7aabd", fontSize: 28 }}>От интерфейса до API и продакшена</div>
      </div>
    ),
    size,
  );
}
