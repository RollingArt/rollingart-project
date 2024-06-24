import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSharedValue, runOnJS } from "react-native-reanimated";

export default function Ball({
  currentBallPatternTexture,
  initialPosition,
  initialVelocity,
  accelData,
  friction,
  initialTilt,
  ballMeshRef,
  onPathUpdate,
  landRef,
}) {
  const accumulatedQuaternion = useRef(new THREE.Quaternion());
  const position = useRef({ ...initialPosition });
  const velocity = useRef({ ...initialVelocity });

  const gravity = -9.8;
  const raycaster = useRef(new THREE.Raycaster());

  const previousPositionRef = useRef({ x: 0, y: 0, z: 0 });
  const distanceThreshold = 2;
  const frameCount = useRef(0);
  const updateInterval = 30;

  const positionX = useSharedValue(initialPosition?.x);
  const positionY = useSharedValue(initialPosition?.y);
  const positionZ = useSharedValue(initialPosition?.z);

  const rotationX = useSharedValue(0);
  const rotationZ = useSharedValue(0);

  const texture = useMemo(() => {
    const ballPatternTexture = new THREE.TextureLoader().load(currentBallPatternTexture);
    ballPatternTexture.wrapS = THREE.RepeatWrapping;
    ballPatternTexture.wrapT = THREE.RepeatWrapping;
    ballPatternTexture.repeat.set(3, 1);

    return ballPatternTexture;
  }, [currentBallPatternTexture]);

  function updateBallPath() {
    frameCount.current += 1;

    if (frameCount.current % updateInterval === 0) {
      const deltaX = positionX.value - previousPositionRef.current.x;
      const daltaY = positionZ.value - previousPositionRef.current.z;
      const distance = Math.sqrt(deltaX * deltaX + daltaY * daltaY);

      if (distance >= distanceThreshold) {
        runOnJS(onPathUpdate)({
          x: positionX.value,
          y: positionY.value,
          z: positionZ.value,
        });
        previousPositionRef.current = {
          x: positionX.value,
          y: positionY.value,
          z: positionZ.value,
        };
      }
    }
  }

  useFrame((_, delta) => {
    if (ballMeshRef?.current && position?.current && landRef?.current) {
      const adjustedX = accelData.x * 2 - initialTilt.current.x;
      const adjustedY = -(accelData.y * 2 - initialTilt.current.y);

      raycaster.current.set(
        new THREE.Vector3(position.current.x, position.current.y + 10, position.current.z),
        new THREE.Vector3(0, -1, 0),
      );
      const intersects = raycaster.current.intersectObject(landRef.current, true);

      let landSlopleX = 0;
      let landSlopleY = 0;

      if (intersects.length > 0) {
        const landHeight = intersects[0].point.y;

        if (position.current.y < landHeight + 1) {
          position.current.y = landHeight + 1;
          velocity.current.y *= 0.5;
        }

        const { normal } = intersects[0].face;
        landSlopleX = normal.x;
        landSlopleY = normal.y;
      }

      velocity.current.x += (adjustedX + landSlopleX) * delta * 8;
      velocity.current.z += (adjustedY + landSlopleY) * delta * 8;
      velocity.current.y += gravity * delta;

      velocity.current.x *= 1 - friction * delta;
      velocity.current.z *= 1 - friction * delta;

      position.current.x += velocity.current.x * delta * 3;
      position.current.z += velocity.current.z * delta * 3;
      position.current.y += velocity.current.y * delta * 3;

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

      if (ballMeshRef.current) {
        const mesh = ballMeshRef.current;
        mesh.quaternion.copy(accumulatedQuaternion.current);
        mesh.position.set(position.current.x, position.current.y, position.current.z);
      }

      positionX.value = position.current.x;
      positionY.value = position.current.y;
      positionZ.value = position.current.z;

      rotationX.value = accumulatedQuaternion.current.x;
      rotationZ.value = accumulatedQuaternion.current.z;

      updateBallPath();
    }
  });

  return (
    <mesh ref={ballMeshRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
