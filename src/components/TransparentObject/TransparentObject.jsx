import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function TransparentObject({ ballMeshRef, velocity }) {
  const transparentMeshRef = useRef();

  useFrame(() => {
    if (ballMeshRef?.current && transparentMeshRef.current) {
      const ballPosition = ballMeshRef.current.position;
      const moveDirection = new THREE.Vector3(
        velocity.current.x,
        0,
        velocity.current.z,
      ).normalize();

      transparentMeshRef.current.position.set(
        ballPosition.x - moveDirection.x,
        ballPosition.y - 2,
        ballPosition.z - moveDirection.z,
      );

      transparentMeshRef.current.rotation.set(0, 0, 0);
    }
  });

  return (
    <mesh ref={transparentMeshRef}>
      <cylinderGeometry args={[2, 2, 0.3, 15]} />
      <meshStandardMaterial color="#DAF7D9" />
    </mesh>
  );
}
