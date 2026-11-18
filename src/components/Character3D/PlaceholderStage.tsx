import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PlaceholderStageProps {
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}

/**
 * Abstract architectural 3D calibration rings shown behind the static portrait
 * fallback when `/models/elias-avatar.glb` is not yet supplied.
 * Intentionally avoids fabricating a fake 3D human figure.
 */
export function PlaceholderStage({
  pointerRef,
  reducedMotion,
}: PlaceholderStageProps) {
  const rigRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!rigRef.current || reducedMotion) return;
    const t = state.clock.getElapsedTime();

    rigRef.current.rotation.y = THREE.MathUtils.lerp(
      rigRef.current.rotation.y,
      pointerRef.current.x * 0.28,
      0.05
    );
    rigRef.current.rotation.x = THREE.MathUtils.lerp(
      rigRef.current.rotation.x,
      -pointerRef.current.y * 0.18,
      0.05
    );
    rigRef.current.position.y = Math.sin(t * 1.1) * 0.06;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 0.14;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.22;
    }
  });

  return (
    <group ref={rigRef}>
      {/* Outer orbital cyan ring */}
      <mesh ref={outerRingRef} rotation={[0.35, 0.2, 0]}>
        <torusGeometry args={[1.55, 0.012, 16, 96]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={0.65}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Secondary teal ring */}
      <mesh ref={innerRingRef} rotation={[-0.45, -0.3, 0.4]}>
        <torusGeometry args={[1.25, 0.01, 16, 80]} />
        <meshStandardMaterial
          color="#14b8a6"
          emissive="#14b8a6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Subtle violet calibration arc */}
      <mesh rotation={[Math.PI / 2.2, 0.15, 0]}>
        <torusGeometry args={[1.78, 0.008, 12, 72, Math.PI * 1.25]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.6}
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
}
