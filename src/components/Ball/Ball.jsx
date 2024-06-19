import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function Ball({ currentBallPatternTexture }) {
  const mesh = useRef();
  const texture = useMemo(() => {
    const ballPatternTexture = new THREE.TextureLoader().load(currentBallPatternTexture);
    ballPatternTexture.wrapS = THREE.RepeatWrapping;
    ballPatternTexture.wrapT = THREE.RepeatWrapping;
    ballPatternTexture.repeat.set(3, 1);
    return ballPatternTexture;
  }, [currentBallPatternTexture]);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x -= 0.02;
      mesh.current.rotation.y += 0.02;
      mesh.current.rotation.z += 0.02;
    }
  });

  return (
    <mesh ref={mesh} position={[0, 1, 0]}>
      <sphereGeometry args={[2, 42, 42]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
