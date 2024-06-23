import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSharedValue, useAnimatedReaction, runOnJS } from "react-native-reanimated";

import TransparentObject from "../TransparentObject/TransparentObject";

export default function Ball({
  currentBallPatternTexture,
  initialPosition = { x: 0, y: 0, z: 0 },
  initialVelocity = { x: 0, y: 0, z: 0 },
  accelData = { x: 0, y: 0, z: 0 },
  friction = 1.2,
  initialTilt = { x: 0, y: 0, z: 0 },
  ballMeshRef,
  onPathUpdate,
  showTransparentObject = false,
}) {
  const accumulatedQuaternion = useRef(new THREE.Quaternion());
  const position = useRef({ ...initialPosition });
  const velocity = useRef({ ...initialVelocity });

  const previousPositionRef = useRef({ x: 0, y: 0, z: 0 });
  const distanceThreshold = 2;
  const frameCount = useRef(0);
  const updateInterval = 30;

  const positionX = useSharedValue(initialPosition.x);
  const positionY = useSharedValue(initialPosition.y);
  const positionZ = useSharedValue(initialPosition.z);

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
    if (ballMeshRef?.current && position?.current) {
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

      if (ballMeshRef.current) {
        const mesh = ballMeshRef.current; // 참조된 객체를 새로운 변수에 할당
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

  useAnimatedReaction(
    () => ({
      x: positionX.value,
      y: positionY.value,
      z: positionZ.value,
      rotationX: rotationX.value,
      rotationZ: rotationZ.value,
    }),
    (values) => {
      if (showTransparentObject) {
        const mesh = ballMeshRef.current;
        mesh.position.set(values.x, values.y, values.z);
        mesh.rotation.x = values.rotationX;
        mesh.rotation.z = values.rotationZ;
      }
    },
    [ballMeshRef],
  );

  return (
    <mesh ref={ballMeshRef}>
      <sphereGeometry args={[2, 16, 16]} />
      <meshStandardMaterial map={texture} />
      {showTransparentObject && <TransparentObject ballMeshRef={ballMeshRef} velocity={velocity} />}
    </mesh>
  );
}
