import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraController({ followTarget }) {
  const { camera } = useThree();

  useFrame(() => {
    if (followTarget.current) {
      const ballPosition = followTarget.current.position;
      const desiredPosition = new THREE.Vector3(
        ballPosition.x,
        ballPosition.y + 15,
        ballPosition.z + 30,
      );

      camera.position.lerp(desiredPosition, 0.1);
      camera.lookAt(ballPosition);
    }
  });

  return null;
}
