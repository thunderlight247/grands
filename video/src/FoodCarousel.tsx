import { useMemo } from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { makeCircleMask, makeGlow } from "./textures";

/** The house favourite sits in the middle; the rest orbit around it. */
const CENTERPIECE = "hero-mixed-platter";
const RING = [
  "okra-soup-seafood",
  "egusi-smoked-fish",
  "efo-riro",
  "fufu-goat-light-soup",
  "yam-palava-sauce-avocado",
  "assorted-pepper-soup",
] as const;

const RING_RADIUS = 3.3;
const TAU = Math.PI * 2;

/**
 * Brand terracotta. The edge colour must equal the website hero panel
 * (Tailwind `brand-800`) so the video blends into it with no visible seam.
 */
export const EDGE = "#7f3317";
const BACKDROP = `radial-gradient(circle at 50% 46%, #d9622b 0%, #b2481c 30%, #96401a 52%, ${EDGE} 72%)`;

/** Ceramic plate profile, spun around the Y axis. */
const plateGeometry = new THREE.LatheGeometry(
  [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(1.05, 0),
    new THREE.Vector2(1.12, 0.03),
    new THREE.Vector2(1.32, 0.16),
    new THREE.Vector2(1.42, 0.2),
    new THREE.Vector2(1.45, 0.17),
    new THREE.Vector2(1.3, 0.1),
    new THREE.Vector2(1.08, -0.05),
    new THREE.Vector2(0, -0.05),
  ],
  96,
);

/** Dense plane so the photo can be displaced into real relief. */
const foodGeometry = new THREE.PlaneGeometry(2.1, 2.1, 160, 160);

const Plate: React.FC<{
  texture: THREE.Texture;
  mask: THREE.Texture;
  position: [number, number, number];
  tilt: number;
  spin: number;
  scale: number;
}> = ({ texture, mask, position, tilt, spin, scale }) => (
  <group position={position} rotation={[tilt, 0, 0]} scale={scale}>
    <group rotation={[0, spin, 0]}>
      <mesh geometry={plateGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#fbf6ef"
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh geometry={foodGeometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} castShadow>
        <meshStandardMaterial
          map={texture}
          displacementMap={texture}
          displacementScale={0.12}
          displacementBias={-0.02}
          alphaMap={mask}
          alphaTest={0.5}
          roughness={0.6}
          metalness={0}
        />
      </mesh>
    </group>
  </group>
);

/** Soft warm specks drifting upward, like steam catching the light. Each wraps exactly within the loop. */
const Specks: React.FC<{ progress: number }> = ({ progress }) => {
  const glow = useMemo(() => makeGlow(), []);
  const specks = useMemo(() => {
    let seed = 11;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: 36 }, () => ({
      x: (rand() - 0.5) * 11,
      z: (rand() - 0.5) * 8 - 1,
      offset: rand(),
      cycles: 1 + Math.floor(rand() * 2),
      size: 0.02 + rand() * 0.03,
      sway: rand() * TAU,
    }));
  }, []);

  return (
    <>
      {specks.map((speck, i) => {
        const t = (speck.offset + progress * speck.cycles) % 1;
        const fade = Math.sin(t * Math.PI);
        return (
          <sprite
            key={i}
            position={[speck.x + Math.sin(progress * TAU * speck.cycles + speck.sway) * 0.3, -3 + t * 7, speck.z]}
            scale={speck.size * 6 * (0.6 + fade)}
          >
            <spriteMaterial
              map={glow}
              transparent
              opacity={0.55 * fade}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        );
      })}
    </>
  );
};

const URLS = [CENTERPIECE, ...RING].map((name) => staticFile(`food/${name}.jpg`));

/** Lives inside <ThreeCanvas>, whose Suspense boundary holds the render until textures load. */
const Dishes: React.FC<{ progress: number }> = ({ progress }) => {
  const textures = useLoader(THREE.TextureLoader, URLS);
  const mask = useMemo(() => makeCircleMask(), []);
  useMemo(() => {
    for (const texture of textures) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      // Zoom into the centre of each photo so only food shows, not the bowl or table.
      texture.repeat.set(0.62, 0.62);
      texture.offset.set(0.19, 0.19);
      texture.needsUpdate = true;
    }
  }, [textures]);

  const [center, ...ring] = textures;
  // Every periodic term completes whole cycles per loop, so the last frame flows into the first.
  const centerBob = Math.sin(progress * TAU) * 0.08;

  return (
    <group>
      <Plate
        texture={center}
        mask={mask}
        position={[0, 0.55 + centerBob, 0]}
        tilt={0.55}
        spin={-progress * TAU}
        scale={1.12}
      />
      {ring.map((texture, i) => {
        const angle = (i / ring.length) * TAU + progress * TAU;
        return (
          <Plate
            key={RING[i]}
            texture={texture}
            mask={mask}
            position={[
              Math.sin(angle) * RING_RADIUS,
              Math.sin(progress * TAU * 2 + i * 1.7) * 0.14,
              Math.cos(angle) * RING_RADIUS,
            ]}
            tilt={0.6 + Math.sin(progress * TAU * 3 + i) * 0.05}
            spin={progress * TAU + i}
            scale={0.72}
          />
        );
      })}

      {/* Invisible floor that only shows the plates' soft shadows. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <circleGeometry args={[9, 64]} />
        <shadowMaterial opacity={0.22} />
      </mesh>
    </group>
  );
};

export const FoodCarousel: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;

  return (
    <AbsoluteFill style={{ background: BACKDROP }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        camera={{ position: [0, 8.6, 16], fov: 34 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
        onCreated={({ camera }) => camera.lookAt(0, -0.2, 0)}
      >
        <ambientLight intensity={1.1} color="#fff4e8" />
        <hemisphereLight args={["#fff6ea", "#b2481c", 0.8]} />
        <directionalLight
          position={[4, 10, 6]}
          intensity={2.6}
          color="#fff6ec"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.03}
          shadow-radius={8}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />
        <pointLight position={[-6, 3, 4]} intensity={25} color="#ffb27a" distance={20} />

        <Dishes progress={progress} />
        <Specks progress={progress} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
