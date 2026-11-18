import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import type { TechnologyItem } from "@/data/technologies";

interface TechNodeProps {
  tech: TechnologyItem;
  position: [number, number, number];
  isHighlighted: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  active: boolean;
}

function createTechTexture(label: string, accent: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0b1224";
  ctx.fillRect(0, 0, 256, 256);

  // Accent radial tint
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
  grad.addColorStop(0, `${accent}44`);
  grad.addColorStop(1, "#0b1224");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Ring border
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(128, 128, 96, 0, Math.PI * 2);
  ctx.stroke();

  // Label text
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 44px 'Space Grotesk', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 128, 130);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function TechNode({
  tech,
  position,
  isHighlighted,
  isSelected,
  onSelect,
  active,
}: TechNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(
    () => createTechTexture(tech.shortLabel, tech.accent),
    [tech.shortLabel, tech.accent]
  );

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  useFrame((_state, delta) => {
    if (!meshRef.current || !active) return;

    const targetScale = isSelected ? 1.24 : isHighlighted ? 1.0 : 0.72;
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
    meshRef.current.scale.setScalar(s);

    meshRef.current.rotation.y += delta * (isSelected ? 0.65 : 0.25);
  });

  return (
    <Float
      speed={active ? 1.4 : 0}
      rotationIntensity={0.25}
      floatIntensity={0.45}
      position={position}
    >
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(tech.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[0.56, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.35}
          metalness={0.25}
          emissive={tech.accent}
          emissiveIntensity={isSelected ? 0.38 : isHighlighted ? 0.16 : 0.04}
          transparent
          opacity={isHighlighted ? 1 : 0.35}
        />
      </mesh>
    </Float>
  );
}

function TechSceneRig({
  items,
  highlightedIds,
  selectedId,
  onSelect,
  active,
}: {
  items: TechnologyItem[];
  highlightedIds: Set<string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo<[number, number, number][]>(() => {
    const count = items.length;
    return items.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 2.45;
      return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.cos(phi) * 0.75,
        radius * Math.sin(theta) * Math.sin(phi) * 0.75,
      ];
    });
  }, [items]);

  useFrame((state) => {
    if (!groupRef.current || !active) return;
    const { pointer } = state;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.45 + state.clock.getElapsedTime() * 0.08,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.2,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      {items.map((tech, idx) => (
        <TechNode
          key={tech.id}
          tech={tech}
          position={positions[idx]}
          isHighlighted={highlightedIds.has(tech.id)}
          isSelected={selectedId === tech.id}
          onSelect={onSelect}
          active={active}
        />
      ))}
    </group>
  );
}

interface TechOrbitCanvasProps {
  items: TechnologyItem[];
  highlightedIds: Set<string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  active: boolean;
}

export default function TechOrbitCanvas({
  items,
  highlightedIds,
  selectedId,
  onSelect,
  active,
}: TechOrbitCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.6], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 5, 5]} intensity={1.4} color="#f8fafc" />
      <pointLight position={[-4, -3, 3]} intensity={1.6} color="#00e5ff" />
      <pointLight position={[3, 2, -3]} intensity={1.4} color="#7c3aed" />
      <TechSceneRig
        items={items}
        highlightedIds={highlightedIds}
        selectedId={selectedId}
        onSelect={onSelect}
        active={active}
      />
    </Canvas>
  );
}
