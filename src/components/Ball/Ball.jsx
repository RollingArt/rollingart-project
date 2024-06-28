import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSharedValue, runOnJS } from "react-native-reanimated";

import ModelLoader from "../../hooks/ModelLoader";
import getAssetUri from "../../utils/getAssetUri";

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
  sensitiveCount,
}) {
  const [landModelUri, setLandModelUri] = useState(null);
  const [landTextureUri, setLandTextureUri] = useState(null);

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
  const distanceThreshold = 3;
  const frameCount = useRef(0);
  const updateInterval = 30;

  const positionX = useSharedValue(initialPosition?.x);
  const positionY = useSharedValue(initialPosition?.y);
  const positionZ = useSharedValue(initialPosition?.z);

  const rotationX = useSharedValue(0);
  const rotationZ = useSharedValue(0);

  const deadZoneHeight = -80;
  const collisionCheckInterval = 10;

  useEffect(() => {
    async function loadModel() {
      const modelUri = await getAssetUri(require("../../../assets/models/stageOne.glb"));
      const textureUri = await getAssetUri(require("../../../assets/images/stageOneTexture.jpg"));

      if (modelUri && textureUri) {
        setLandModelUri(modelUri);
        setLandTextureUri(textureUri);
      }
    }
    loadModel();
  }, []);

  const ballTexture = useMemo(() => {
    const ballPatternTexture = new THREE.TextureLoader().load(currentBallPatternTexture);
    ballPatternTexture.wrapS = THREE.RepeatWrapping;
    ballPatternTexture.wrapT = THREE.RepeatWrapping;
    ballPatternTexture.repeat.set(3, 1);

    return ballPatternTexture;
  }, [currentBallPatternTexture]);

  function handleModelLoad(scene) {
    landRef.current = scene;
  }

  const dynamicTexture = useMemo(() => {
    const size = 1024;
    const data = new Uint8Array(size * size * 4);
    for (let i = 0; i < size * size * 4; i += 4) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }, []);

  const ballPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    if (ballMeshRef.current) {
      ballPosition.current.copy(ballMeshRef.current.position);
    }
  }, [ballMeshRef]);

  function updateTexture(uvX, uvY) {
    const radius = 3;
    const width = 1024;
    const height = 1024;
    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        const distance = Math.sqrt(i * i + j * j);
        if (distance <= radius) {
          const xi = uvX + i;
          const yj = uvY + j;
          if (xi >= 0 && xi < width && yj >= 0 && yj < height) {
            const index = (yj * width + xi) * 4;
            dynamicTexture.image.data[index] = 255;
            dynamicTexture.image.data[index + 1] = 165;
            dynamicTexture.image.data[index + 2] = 0;
            dynamicTexture.image.data[index + 3] = 255;
          }
        }
      }
    }
    dynamicTexture.needsUpdate = true;
  }

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

      const adjustedX = accelData.x - initialTilt.current.x;
      const adjustedY = -(accelData.y - initialTilt.current.y);
      const extraTiltX = adjustedX * 4;
      const extraTiltY = adjustedY * 4;

      let landHeight = null;
      let landSlopeX = 0;
      let landSlopeY = 0;
      const slopeThreshold = 1;

      raycaster.current.set(
        new THREE.Vector3(position.current.x, position.current.y + 10, position.current.z),
        new THREE.Vector3(0, -1, 0),
      );
      const intersects = raycaster.current.intersectObject(landRef.current, true);

      if (intersects.length > 0) {
        landHeight = intersects[0].point.y;

        if (position.current.y < landHeight + 1) {
          position.current.y = landHeight + 1;
          velocity.current.y *= 0.5;
        }

        const { normal } = intersects[0].face;
        landSlopeX = Math.abs(normal.x) > slopeThreshold ? normal.x : 0;
        landSlopeY = Math.abs(normal.y) > slopeThreshold ? normal.y : 0;
      } else if (position.current.y < deadZoneHeight) {
        runOnJS(onGameOver)("fall");
      }

      velocity.current.x += (extraTiltX + landSlopeX) * delta * (sensitiveCount + 3);
      velocity.current.z += (extraTiltY + landSlopeY) * delta * (sensitiveCount + 3);
      velocity.current.y += gravity * delta;

      velocity.current.x *= 1 - friction * delta;
      velocity.current.z *= 1 - friction * delta;

      if (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.z) > 0.1) {
        position.current.x += velocity.current.x * delta * 2;
        position.current.z += velocity.current.z * delta * 2;
        position.current.y += velocity.current.y * delta * 2;
      }

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

        const ballCurrentPosition = mesh.position;
        const startBox = new THREE.Box3().setFromObject(startZoneRef.current);
        const endBox = new THREE.Box3().setFromObject(endZoneRef.current);

        if (startBox.containsPoint(ballCurrentPosition)) {
          runOnJS(onGameStart)();
        }
        if (endBox.containsPoint(ballCurrentPosition)) {
          runOnJS(onGameOver)("finish");
        }
      }

      if (frameCount.current % collisionCheckInterval === 0) {
        const colliders = [...colliderRefs.current];
        const collisionDetected = colliders.some((collider) =>
          new THREE.Box3().setFromObject(collider).containsPoint(position.current),
        );

        if (collisionDetected) {
          position.current.copy(previousPosition.current);
          velocity.current.set(0, 0, 0);
        }
      }

      positionX.value = position.current.x;
      positionY.value = position.current.y;
      positionZ.value = position.current.z;

      rotationX.value = accumulatedQuaternion.current.x;
      rotationZ.value = accumulatedQuaternion.current.z;

      if (ballMeshRef.current) {
        const mesh = ballMeshRef.current;
        mesh.quaternion.copy(accumulatedQuaternion.current);
        mesh.position.set(position.current.x, position.current.y, position.current.z);

        const ballPositionVector = new THREE.Vector3(
          position.current.x,
          position.current.y,
          position.current.z,
        );

        ballPosition.current.copy(ballPositionVector);

        const startBox = new THREE.Box3().setFromObject(startZoneRef.current);
        const endBox = new THREE.Box3().setFromObject(endZoneRef.current);

        if (startBox.containsPoint(ballPositionVector)) {
          runOnJS(onGameStart)();
        }
        if (endBox.containsPoint(ballPositionVector)) {
          runOnJS(onGameOver)("finish");
        }
      }

      if (frameCount.current % collisionCheckInterval === 0) {
        const colliders = [...colliderRefs.current];
        const collisionDetected = colliders.some((collider) =>
          new THREE.Box3().setFromObject(collider).containsPoint(position.current),
        );

        if (collisionDetected) {
          position.current.copy(previousPosition.current);
          velocity.current.set(0, 0, 0);
        }
      }

      positionX.value = position.current.x;
      positionY.value = position.current.y;
      positionZ.value = position.current.z;

      rotationX.value = accumulatedQuaternion.current.x;
      rotationZ.value = accumulatedQuaternion.current.z;

      if (landRef.current) {
        const ballPositionVector = new THREE.Vector3(
          position.current.x,
          position.current.y,
          position.current.z,
        );
        landRef.current.traverse((child) => {
          if (
            child.isMesh &&
            child.material &&
            child.material.uniforms &&
            child.material.uniforms.ballPosition
          ) {
            if (child.material.uniforms.ballPosition.value instanceof THREE.Vector3) {
              child.material.uniforms.ballPosition.value.copy(ballPositionVector);
              child.material.uniforms.dynamicTexture.value.needsUpdate = true;
            }
          }
        });
      }

      updateBallPath();
      const uv = intersects[0]?.uv;
      if (uv) {
        const uvX = Math.floor(uv.x * 1024);
        const uvY = Math.floor(uv.y * 1024);
        updateTexture(uvX, uvY);
      }
    }
  });

  return (
    <>
      <mesh ref={ballMeshRef} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial map={ballTexture} />
      </mesh>
      {landModelUri && (
        <ModelLoader
          modelUri={landModelUri}
          textureUri={landTextureUri}
          onLoad={handleModelLoad}
          dynamicTexture={dynamicTexture}
          ballPosition={position.current}
          brushRadius={0.01}
        />
      )}
    </>
  );
}
