import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { AvatarModel } from "./AvatarModel";
import { PlaceholderStage } from "./PlaceholderStage";
import { profile } from "@/data/profile";

// Preload all 3D GLB avatar assets eagerly for seamless instant switching
if (typeof window !== "undefined" && profile.avatar?.models) {
  profile.avatar.models.forEach((model) => {
    if (model.glbPath) {
      useGLTF.preload(model.glbPath, true);
    }
  });
}

interface AvatarCanvasProps {
  glbPath: string;
  hasGlbModel: boolean;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}

export default function AvatarCanvas({
  glbPath,
  hasGlbModel,
  pointerRef,
  reducedMotion,
}: AvatarCanvasProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 4.4], fov: 36, near: 0.1, far: 100 }}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        powerPreference: "high-performance",
      }}
      className="h-full w-full"
    >
      {/* Cinematic 3-point lighting */}
      <ambientLight intensity={0.45} color="#cbd5e1" />
      <directionalLight
        position={[3, 4, 4]}
        intensity={1.6}
        color="#e2e8f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Cyan rim light */}
      <spotLight
        position={[-3.5, 3, -2]}
        angle={0.5}
        penumbra={1}
        intensity={4.2}
        color="#00e5ff"
      />
      {/* Subtle violet fill */}
      <pointLight position={[2.8, -1.2, -2]} intensity={2.2} color="#7c3aed" />

      <Environment preset="city" environmentIntensity={0.45} />

      <Suspense
        fallback={
          <PlaceholderStage
            pointerRef={pointerRef}
            reducedMotion={reducedMotion}
          />
        }
      >
        {hasGlbModel ? (
          <AvatarModel
            key={glbPath}
            glbPath={glbPath}
            pointerRef={pointerRef}
            reducedMotion={reducedMotion}
          />
        ) : (
          <PlaceholderStage
            pointerRef={pointerRef}
            reducedMotion={reducedMotion}
          />
        )}
      </Suspense>

      <ContactShadows
        position={[0, -1.38, 0]}
        opacity={0.42}
        scale={6}
        blur={2.4}
        far={3}
        color="#00e5ff"
      />
    </Canvas>
  );
}
