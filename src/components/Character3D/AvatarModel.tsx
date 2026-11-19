import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import type { VibeMetrics } from "@/context/AudioVibeContext";

interface AvatarModelProps {
  glbPath: string;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
  vibeRef: React.MutableRefObject<VibeMetrics>;
  reducedMotion: boolean;
}

const HEAD_BONE_CANDIDATES = [
  "Head",
  "head",
  "mixamorigHead",
  "spine006",
  "CC_Base_Head",
];

const NECK_BONE_CANDIDATES = [
  "Neck",
  "neck",
  "mixamorigNeck",
  "spine005",
  "CC_Base_NeckTwist01",
];

function findBone(root: THREE.Object3D, candidates: string[]): THREE.Object3D | null {
  for (const name of candidates) {
    const found = root.getObjectByName(name);
    if (found) return found;
  }
  let fallback: THREE.Object3D | null = null;
  root.traverse((obj) => {
    if (!fallback && (obj as THREE.Bone).isBone) {
      const lower = obj.name.toLowerCase();
      if (candidates.some((c) => lower.includes(c.toLowerCase()))) {
        fallback = obj;
      }
    }
  });
  return fallback;
}

export function AvatarModel({
  glbPath,
  pointerRef,
  vibeRef,
  reducedMotion,
}: AvatarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const entranceProgress = useRef(reducedMotion ? 1 : 0);
  const smoothPointer = useRef({ x: 0, y: 0 });

  // Load standard GLB directly without external Draco CDN dependency
  const gltf = useGLTF(glbPath, false);
  const { actions, names } = useAnimations(gltf.animations, groupRef);

  // Normalize scale and center the model cleanly above the switcher pill
  const { normalizedScale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetHeight = 2.42;
    const scale = targetHeight / maxDim;

    return {
      normalizedScale: scale,
      offset: new THREE.Vector3(
        -center.x * scale,
        -box.min.y * scale - 1.08,
        -center.z * scale
      ),
    };
  }, [gltf.scene]);

  const headBone = useMemo(
    () => findBone(gltf.scene, HEAD_BONE_CANDIDATES),
    [gltf.scene]
  );
  const neckBone = useMemo(
    () => findBone(gltf.scene, NECK_BONE_CANDIDATES),
    [gltf.scene]
  );

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Prevent animated skinned meshes from clipping out of bind-pose bounds
        child.frustumCulled = false;
      }
    });
  }, [gltf.scene]);

  useEffect(() => {
    if (reducedMotion || names.length === 0) return;
    const preferred =
      names.find((n) => /idle|breath|stand|anim|gesture|clean|action/i.test(n)) ||
      names[0];
    const action = actions[preferred];
    if (action) {
      action.reset().fadeIn(0.35).play();
    }
    return () => {
      action?.fadeOut(0.25);
    };
  }, [actions, names, reducedMotion]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (entranceProgress.current < 1) {
      entranceProgress.current = Math.min(
        1,
        entranceProgress.current + delta * 1.4
      );
      const ease = 1 - Math.pow(1 - entranceProgress.current, 3);
      groupRef.current.scale.setScalar(0.85 + 0.15 * ease);
    }

    if (reducedMotion) return;

    smoothPointer.current.x = THREE.MathUtils.lerp(
      smoothPointer.current.x,
      pointerRef.current.x,
      0.08
    );
    smoothPointer.current.y = THREE.MathUtils.lerp(
      smoothPointer.current.y,
      pointerRef.current.y,
      0.08
    );

    const px = smoothPointer.current.x;
    const py = smoothPointer.current.y;
    const elapsed = state.clock.getElapsedTime();
    const vibe = vibeRef.current;

    // Audio-reactive bounce & groove when Vibe Mode is active
    const beatJump = vibe.isPlaying
      ? Math.pow(vibe.bass, 1.2) * 0.13 + vibe.beat * 0.06
      : 0;
    const grooveSway = vibe.isPlaying
      ? Math.sin(elapsed * 5.8) * (0.03 + vibe.mid * 0.05)
      : 0;
    const headBob = vibe.isPlaying
      ? Math.sin(elapsed * 11.6) * (0.04 + vibe.bass * 0.14)
      : 0;

    // Subtle idle breathing / hover float + beat jump
    const idleFloat = Math.sin(elapsed * 1.4) * 0.02;
    groupRef.current.position.y = offset.y + idleFloat + beatJump;

    // Gentle body yaw tracking pointer + musical groove sway
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      px * 0.24 + grooveSway * 1.4,
      0.08
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -py * 0.06,
      0.06
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      grooveSway,
      0.1
    );

    // Smoothly blend pointer look + beat head-nod without accumulating rotation
    if (headBone) {
      headBone.rotation.y = THREE.MathUtils.lerp(
        headBone.rotation.y,
        px * 0.35 + grooveSway * 0.8,
        0.12
      );
      headBone.rotation.x = THREE.MathUtils.lerp(
        headBone.rotation.x,
        THREE.MathUtils.clamp(-py * 0.22 + headBob, -0.32, 0.32),
        0.14
      );
    }
    if (neckBone) {
      neckBone.rotation.y = THREE.MathUtils.lerp(
        neckBone.rotation.y,
        px * 0.15,
        0.09
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={[offset.x, offset.y, offset.z]}
      scale={reducedMotion ? 1 : 0.85}
    >
      <primitive object={gltf.scene} scale={normalizedScale} />
    </group>
  );
}
