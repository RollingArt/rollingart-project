import { useRef, useMemo } from "react";
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
  startZoneRef,
  endZoneRef,
  colliderRefs,
  onGameOver,
  onGameStart,
  isPaused,
}) {
  const accumulatedQuaternion = useRef(new THREE.Quaternion());
  const position = useRef(
    new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z),
  );
  const velocity = useRef(
    new THREE.Vector3(initialVelocity.x, initialVelocity.y, initialVelocity.z),
  );
  const previousPosition = useRef(
    new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z),
  );

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

  const deadZoneHeight = -80;

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
      const deltaY = positionZ.value - previousPositionRef.current.z;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

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
    if (isPaused) return;

    if (ballMeshRef?.current && position?.current && landRef?.current) {
      previousPosition.current.copy(position.current);

      const adjustedX = accelData.x * 2 - initialTilt.current.x;
      const adjustedY = -(accelData.y * 2 - initialTilt.current.y);

      raycaster.current.set(
        new THREE.Vector3(position.current.x, position.current.y + 10, position.current.z),
        new THREE.Vector3(0, -1, 0),
      );
      const intersects = raycaster.current.intersectObject(landRef.current, true);

      let landSlopeX = 0;
      let landSlopeY = 0;
      const slopeThreshold = 0.1;

      if (intersects.length > 0) {
        const landHeight = intersects[0].point.y;

        if (position.current.y < landHeight + 1) {
          position.current.y = landHeight + 1;
          velocity.current.y *= 0.5;
        }

        const { normal } = intersects[0].face;
        landSlopeX = Math.abs(normal.x) > slopeThreshold ? normal.x : 0;
        landSlopeY = Math.abs(normal.y) > slopeThreshold ? normal.y : 0;
      } else if (position.current.y < deadZoneHeight) {
        runOnJS(onGameOver)();
      }

      velocity.current.x += (adjustedX + landSlopeX) * delta * 8;
      velocity.current.z += (adjustedY + landSlopeY) * delta * 8;
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

        const ballPosition = mesh.position;
        const startBox = new THREE.Box3().setFromObject(startZoneRef.current);
        const endBox = new THREE.Box3().setFromObject(endZoneRef.current);

        if (startBox.containsPoint(ballPosition)) {
          runOnJS(onGameStart)();
        }
        if (endBox.containsPoint(ballPosition)) {
          runOnJS(onGameOver)();
        }
      }

      const colliders = [...colliderRefs.current];
      const collisionDetected = colliders.some((collider) =>
        new THREE.Box3().setFromObject(collider).containsPoint(position.current),
      );

      if (collisionDetected) {
        position.current.copy(previousPosition.current);
        velocity.current.set(0, 0, 0);
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
    <mesh ref={ballMeshRef} castShadow>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
