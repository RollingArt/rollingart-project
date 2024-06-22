import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import TransparentObject from "../TransparentObject/TransparentObject";

export default function Ball({
  currentBallPatternTexture,
  initialPosition,
  initialVelocity,
  accelData,
  friction,
  initialTilt,
  ballMeshRef,
  showTransparentObject = false,
}) {
  const accumulatedQuaternion = useRef(new THREE.Quaternion());
  const position = useRef({ ...initialPosition });
  const velocity = useRef({ ...initialVelocity });

  const texture = useMemo(() => {
    const ballPatternTexture = new THREE.TextureLoader().load(currentBallPatternTexture);
    ballPatternTexture.wrapS = THREE.RepeatWrapping;
    ballPatternTexture.wrapT = THREE.RepeatWrapping;
    ballPatternTexture.repeat.set(3, 1);
    return ballPatternTexture;
  }, [currentBallPatternTexture]);

  useFrame((_, delta) => {
    if (ballMeshRef?.current && position.current) {
      const adjustedX = accelData.x - initialTilt.current.x;
      const adjustedY = -(accelData.y - initialTilt.current.y);

      velocity.current.x += adjustedX * delta * 20;
      velocity.current.z += adjustedY * delta * 20;

      velocity.current.x *= 1 - friction * delta;
      velocity.current.z *= 1 - friction * delta;

      position.current.x += velocity.current.x * delta * 3;
      position.current.z += velocity.current.z * delta * 3;

      const moveDirection = new THREE.Vector3(
        velocity.current.x,
        0,
        velocity.current.z,
      ).normalize();

      const linearSpeed = Math.sqrt(velocity.current.x ** 2 + velocity.current.z ** 2);
      const rotationSpeed = linearSpeed * delta;

      const rotationAxis = new THREE.Vector3()
        .crossVectors(new THREE.Vector3(0, 1, 0), moveDirection)
        .normalize();

      const quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(rotationAxis, rotationSpeed);
      accumulatedQuaternion.current.multiplyQuaternions(quaternion, accumulatedQuaternion.current);

      ballMeshRef.current.quaternion.copy(accumulatedQuaternion.current);
      ballMeshRef.current.position.set(position.current.x, position.current.y, position.current.z);
    }
  });

  return (
    <mesh ref={ballMeshRef}>
      <sphereGeometry args={[2, 16, 16]} />
      <meshStandardMaterial map={texture} />
      {showTransparentObject && <TransparentObject ballMeshRef={ballMeshRef} velocity={velocity} />}
    </mesh>
  );
}
