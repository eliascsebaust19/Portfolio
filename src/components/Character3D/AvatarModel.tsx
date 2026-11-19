import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";

interface AvatarModelProps {
  glbPath: string;
  pointerRef: React.MutableRefObject<{ x: number; y: number }>;
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
  reducedMotion,
}: AvatarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const entranceProgress = useRef(reducedMotion ? 1 : 0);

  // Uses Drei's useGLTF with Draco CDN decoder enabled by default
  const gltf = useGLTF(glbPath, true);
  const { actions, names } = useAnimations(gltf.animations, groupRef);

  // Normalize scale and center the model cleanly in view
  const { normalizedScale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetHeight = 2.7;
    const scale = targetHeight / maxDim;

    return {
      normalizedScale: scale,
      offset: new THREE.Vector3(
        -center.x * scale,
        -box.min.y * scale - 1.35,
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

    const px = pointerRef.current.x;
    const py = pointerRef.current.y;
    const elapsed = state.clock.getElapsedTime();

    // Subtle idle breathing / hover float
    const idleFloat = Math.sin(elapsed * 1.4) * 0.025;
    groupRef.current.position.y = offset.y + idleFloat;

    // Gentle body yaw tracking pointer
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      px * 0.22,
      0.06
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -py * 0.06,
      0.06
    );

    // Head & neck bone tracking when model rig provides them
    if (headBone) {
      headBone.rotation.y = THREE.MathUtils.lerp(
        headBone.rotation.y,
        px * 0.35,
        0.09
      );
      headBone.rotation.x = THREE.MathUtils.lerp(
        headBone.rotation.x,
        THREE.MathUtils.clamp(-py * 0.22, -0.28, 0.28),
        0.09
      );
    }
    if (neckBone) {
      neckBone.rotation.y = THREE.MathUtils.lerp(
        neckBone.rotation.y,
        px * 0.14,
        0.07
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
