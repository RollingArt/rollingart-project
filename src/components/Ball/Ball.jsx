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
  correctPath,
  ballPath,
  onPathUpdate,
  landRef,
  startZoneRef,
  endZoneRef,
  colliderRefs,
  onGameOver,
  onGameStart,
  isPaused,
  sensitiveCount,
  currentStage,
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
  const distanceThreshold = 2;

  const positionX = useSharedValue(initialPosition?.x);
  const positionY = useSharedValue(initialPosition?.y);
  const positionZ = useSharedValue(initialPosition?.z);

  const rotationX = useSharedValue(0);
  const rotationZ = useSharedValue(0);

  const deadZoneHeight = -80;

  useEffect(() => {
    async function loadModel() {
      let modelUri = null;
      let textureUri = null;

      switch (currentStage) {
        case 0:
          modelUri = await getAssetUri(require("../../../assets/models/tutorialStage.glb"));
          textureUri = await getAssetUri(
            require("../../../assets/images/tutorialStageTexture.jpg"),
          );
          setLandModelUri(modelUri);
          setLandTextureUri(textureUri);
          break;
        case 1:
          modelUri = await getAssetUri(require("../../../assets/models/stage1.glb"));
          textureUri = await getAssetUri(require("../../../assets/images/stage1Texture.jpg"));
          setLandModelUri(modelUri);
          setLandTextureUri(textureUri);
          break;
        case 2:
          modelUri = await getAssetUri(require("../../../assets/models/stage2.glb"));
          textureUri = await getAssetUri(require("../../../assets/images/stage2Texture.jpg"));
          setLandModelUri(modelUri);
          setLandTextureUri(textureUri);
          break;
        default:
          break;
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
    const currentX = Math.floor(position.current.x);
    const currentZ = Math.floor(position.current.z);

    const differenceInX = currentX - previousPositionRef.current.x;
    const differenceInZ = currentZ - previousPositionRef.current.z;
    const distance = Math.sqrt(differenceInX * differenceInX + differenceInZ * differenceInZ);

    if (distance < distanceThreshold || !correctPath.length) {
      return;
    }

    const newPathPoint = { x: currentX, z: currentZ };

    let closestPoint = null;
    let minDistance = Infinity;

    correctPath.forEach((point) => {
      const differenceInCorrectX = point.x - newPathPoint.x;
      const differenceInCorrectZ = point.z - newPathPoint.z;
      const correctDistance = Math.sqrt(
        differenceInCorrectX * differenceInCorrectX + differenceInCorrectZ * differenceInCorrectZ,
      );

      if (correctDistance < minDistance) {
        minDistance = correctDistance;
        closestPoint = point;
      }
    });

    if (!closestPoint || minDistance > distanceThreshold) {
      return;
    }

    const isAlreadyInPath = ballPath.some(
      (point) => point.x === closestPoint.x && point.z === closestPoint.z,
    );

    if (!isAlreadyInPath) {
      runOnJS(onPathUpdate)(closestPoint);
    }

    previousPositionRef.current = { x: currentX, z: currentZ };
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

      if (intersects.length > 0 && intersects[0]?.face) {
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

        const ballPositionVector = new THREE.Vector3(
          position.current.x,
          position.current.y,
          position.current.z,
        );

        ballPosition.current.copy(ballPositionVector);

        if (currentStage) {
          const startBox = new THREE.Box3().setFromObject(startZoneRef.current);
          const endBox = new THREE.Box3().setFromObject(endZoneRef.current);

          if (startBox.containsPoint(ballPositionVector)) {
            runOnJS(onGameStart)();
          }
          if (endBox.containsPoint(ballPositionVector)) {
            runOnJS(onGameOver)("finish");
          }
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
              if (child.material.uniforms.dynamicTexture.value) {
                child.material.uniforms.dynamicTexture.value.needsUpdate = true;
              }
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
