import * as THREE from "three";

const canvasTexture = (size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  draw(canvas.getContext("2d")!, size);
  return new THREE.CanvasTexture(canvas);
};

/** Soft-edged circular alpha mask so square photos sit on the plate as a round mound of food. */
export const makeCircleMask = () =>
  canvasTexture(512, (ctx, size) => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, size, size);
    const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.36, size / 2, size / 2, size / 2);
    g.addColorStop(0, "#fff");
    g.addColorStop(0.9, "#fff");
    g.addColorStop(1, "#000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  });

/** Radial glow used for the floating ember sprites. */
export const makeGlow = () => {
  const texture = canvasTexture(128, (ctx, size) => {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,248,236,1)");
    g.addColorStop(0.2, "rgba(255,226,190,0.7)");
    g.addColorStop(0.5, "rgba(255,190,140,0.2)");
    g.addColorStop(1, "rgba(255,170,120,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  });
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};
