import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import type { VibeMetrics } from "@/context/AudioVibeContext";
import { AvatarModel } from "./AvatarModel";
import { PlaceholderStage } from "./PlaceholderStage";
import { profile } from "@/data/profile";

// Preload all 3D GLB avatar assets locally (standard GLB, no external Draco CDN needed)
if (typeof window !== "undefined" && profile.avatar?.models) {
  profile.avatar.models.forEach((model) => {
    if (model.glbPath) {
      useGLTF.preload(model.glbPath, false);
    }
  });
}

function CameraRig({
  hasGlbModel,
  viewMode,
  reducedMotion,
}: {
  hasGlbModel: boolean;
  viewMode: "close" | "full";
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0.68, 0));

  useEffect(() => {
    const targetPos = !hasGlbModel
      ? new THREE.Vector3(0, 0.2, 4.4)
      : viewMode === "close"
        ? new THREE.Vector3(0, 0.74, 2.45)
        : new THREE.Vector3(0, 0.25, 4.55);
    const targetLook = !hasGlbModel
      ? new THREE.Vector3(0, 0, 0)
      : viewMode === "close"
        ? new THREE.Vector3(0, 0.68, 0)
        : new THREE.Vector3(0, 0.18, 0);

    if (reducedMotion) {
      camera.position.copy(targetPos);
      lookTarget.current.copy(targetLook);
      camera.lookAt(lookTarget.current);
    }
  }, [camera, hasGlbModel, viewMode, reducedMotion]);

  useFrame(() => {
    const targetPos = !hasGlbModel
      ? new THREE.Vector3(0, 0.2, 4.4)
      : viewMode === "close"
        ? new THREE.Vector3(0, 0.74, 2.45)
        : new THREE.Vector3(0, 0.25, 4.55);
    const targetLook = !hasGlbModel
      ? new THREE.Vector3(0, 0, 0)
      : viewMode === "close"
        ? new THREE.Vector3(0, 0.68, 0)
        : new THREE.Vector3(0, 0.18, 0);

    if (!reducedMotion) {
      camera.position.lerp(targetPos, 0.08);
      lookTarget.current.lerp(targetLook, 0.08);
    }
    camera.lookAt(lookTarget.current);
  });

  return null;
}

function VibeStageLights({
  vibeRef,
  reducedMotion,
}: {
  vibeRef: React.MutableRefObject<VibeMetrics>;
  reducedMotion: boolean;
}) {
  const cyanSpotRef = useRef<THREE.SpotLight>(null);
  const violetPointRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const vibe = vibeRef.current;
    const boost =
      vibe.isPlaying && !reducedMotion
        ? vibe.bass * 3.5 + vibe.beat * 4.5
        : 0;

    if (cyanSpotRef.current) {
      cyanSpotRef.current.intensity = THREE.MathUtils.lerp(
        cyanSpotRef.current.intensity,
        4.5 + boost,
        0.2
      );
    }
    if (violetPointRef.current) {
      violetPointRef.current.intensity = THREE.MathUtils.lerp(
        violetPointRef.current.intensity,
        2.4 + boost * 0.7,
        0.2
      );
    }
  });

  return (
    <>
      <spotLight
        ref={cyanSpotRef}
        position={[-3.2, 3.2, -1.8]}
        angle={0.55}
        penumbra={1}
        intensity={4.5}
        color="#00e5ff"
      />
      <pointLight
        ref={violetPointRef}
        position={[2.6, 0.4, -1.8]}
        intensity={2.4}
        color="#7c3aed"
      />
    </>
  );
}

interface AvatarCanvasProps {
  glbPath: string;
  hasGlbModel: boolean;
  viewMode: "close" | "full";
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  vibeRef: React.MutableRefObject<VibeMetrics>;
  reducedMotion: boolean;
}

export default function AvatarCanvas({
  glbPath,
  hasGlbModel,
  viewMode,
  pointerRef,
  vibeRef,
  reducedMotion,
}: AvatarCanvasProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.74, 2.45], fov: 33, near: 0.1, far: 100 }}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        powerPreference: "high-performance",
      }}
      className="h-full w-full"
    >
      <CameraRig
        hasGlbModel={hasGlbModel}
        viewMode={viewMode}
        reducedMotion={reducedMotion}
      />

      {/* Cinematic 3-point lighting + audio-reactive rim lights */}
      <ambientLight intensity={0.72} color="#cbd5e1" />
      <directionalLight
        position={[2.5, 3.8, 4]}
        intensity={1.75}
        color="#f8fafc"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <VibeStageLights vibeRef={vibeRef} reducedMotion={reducedMotion} />
      {/* Soft front key fill for crisp facial details */}
      <directionalLight position={[0, 1.4, 3.5]} intensity={1.0} color="#e2e8f0" />

      {/* Local procedural IBL reflections (no external HDR network request) */}
      <Environment resolution={256} frames={1} environmentIntensity={0.55}>
        <Lightformer
          form="rect"
          intensity={2.2}
          color="#e2e8f0"
          position={[0, 5, 3]}
          scale={[6, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2.5}
          color="#00e5ff"
          position={[-4, 2, -2]}
          scale={[4, 5, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color="#7c3aed"
          position={[4, 1, -2]}
          scale={[4, 5, 1]}
          target={[0, 0, 0]}
        />
      </Environment>

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
            vibeRef={vibeRef}
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
        position={[0, -1.12, 0]}
        opacity={0.42}
        scale={5.5}
        blur={2.4}
        far={3}
        color="#00e5ff"
      />
    </Canvas>
  );
}
