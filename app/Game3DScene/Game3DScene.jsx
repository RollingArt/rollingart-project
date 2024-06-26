import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { StyleSheet, Platform, View } from "react-native";
import { Canvas, extend } from "@react-three/fiber/native";
import * as THREE from "three";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Accelerometer } from "expo-sensors";
import { Box } from "@react-three/drei";

import Ball from "../../src/components/Ball/Ball";
import CameraController from "../../src/components/CameraController/CameraController";
import TransparentObject from "../../src/components/TransparentObject/TransparentObject";
import ColliderBox from "../../src/components/ColliderBox/ColliderBox";

import ModelLoader from "../../src/hooks/ModelLoader";
import ExtractPathVertices from "../../src/hooks/ExtractPathVertices";
import getAssetUri from "../../src/utils/getAssetUri";
import colliderBoxes from "../../src/utils/colliderBoxes";

import patternTexture from "../../assets/images/patternTexture.png";
import patternTextureSecond from "../../assets/images/patternTextureSecond.png";
import patternTextureThird from "../../assets/images/patternTextureThird.png";

extend(THREE);

function EventZone({ zoneRef, position, boxColor, size, rotation }) {
  return (
    <Box ref={zoneRef} args={size} position={position} rotation={rotation}>
      <meshStandardMaterial args={[{ color: boxColor, transparent: true, opacity: 0.3 }]} />
    </Box>
  );
}

function StageOneLand({ setLandRef }) {
  const [landModelUri, setLandModelUri] = useState(null);
  const [landTextureUri, setLandTextureUri] = useState(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    async function loadModel() {
      const modelUri = await getAssetUri(require("../../assets/models/stageOne.glb"));
      const textureUri = await getAssetUri(require("../../assets/images/stageOneTexture.jpg"));

      if (modelUri && textureUri) {
        setLandModelUri(modelUri);
        setLandTextureUri(textureUri);
      }
    }
    loadModel();
  }, []);

  useEffect(() => {
    if (model) {
      setLandRef(model);
    }
  }, [model, setLandRef]);

  if (!landModelUri || !landTextureUri) return null;

  return (
    <>
      <ModelLoader modelUri={landModelUri} textureUri={landTextureUri} onLoad={setModel} />
      {model && <primitive object={model} position={[0, -30, 0]} receiveShadow />}
      {model && <ExtractPathVertices model={model} />}
    </>
  );
}

export default function Game3DScreen({
  isOverlayVisible,
  onGameStart,
  onGameOver,
  isPaused,
  reloadKey,
}) {
  // eslint-disable-next-line no-unused-vars
  const [ballPath, setBallPath] = useState([]);
  const ballMeshRef = useRef();
  const landRef = useRef();
  const startZoneRef = useRef();
  const endZoneRef = useRef();
  const colliderRefs = useRef([]);

  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const initialTilt = useRef({ x: 0, y: 0, z: 0 });
  const position = useRef({ x: -120, y: 1, z: 0 });
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const friction = 1.2;

  const [patternIndex, setPatternIndex] = useState(0);
  const patterns = useMemo(() => [patternTexture, patternTextureSecond, patternTextureThird]);
  const selectedPattern = patterns[patternIndex];

  const setColliderRef = (index) => (ref) => {
    colliderRefs.current[index] = ref;
  };

  function normalizeSensorData(data) {
    if (Platform.OS === "android") {
      return {
        x: -data.x,
        y: -data.y,
        z: data.z,
      };
    }
    if (Platform.OS === "ios") {
      return data;
    }
    return data;
  }

  useEffect(() => {
    const loadPattern = async () => {
      const savedPatternIndex = await AsyncStorage.getItem("selectedPatternIndex");
      if (savedPatternIndex !== null) {
        setPatternIndex(parseInt(savedPatternIndex, 10));
      }
    };
    loadPattern();

    let accelLastUpdate = Date.now();
    Accelerometer.setUpdateInterval(100);
    const accelSubscription = Accelerometer.addListener((result) => {
      const now = Date.now();
      if (now - accelLastUpdate >= 100) {
        const normalizedData = normalizeSensorData(result, "accelerometer");
        if (
          initialTilt.current.x === 0 &&
          initialTilt.current.y === 0 &&
          initialTilt.current.z === 0
        ) {
          initialTilt.current = normalizedData;
        }
        setAccelData(normalizedData);
        accelLastUpdate = now;
      }
    });

    return () => {
      accelSubscription.remove();
    };
  }, [reloadKey]);

  const distance = (pos1, pos2) =>
    Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + (pos1.z - pos2.z) ** 2);

  const handlePathUpdate = (newPosition) => {
    setBallPath((prevPath) => {
      const lastPosition = prevPath[prevPath.length - 1];
      if (!lastPosition || distance(newPosition, lastPosition) > 2) {
        return [...prevPath, newPosition];
      }
      return prevPath;
    });
  };

  const setLandRef = useCallback((model) => {
    landRef.current = model;
  }, []);

  return (
    <>
      <Canvas style={styles.container} shadows>
        <ambientLight color={0xadd8e6} intensity={0.3} />
        <ambientLight color={0xffffff} intensity={0.6} />
        <directionalLight color={0xffffff} intensity={1} position={[5, 5, 5]} castShadow />
        <CameraController followTarget={ballMeshRef} />
        <Ball
          ballMeshRef={ballMeshRef}
          currentBallPatternTexture={selectedPattern}
          initialPosition={position.current}
          initialVelocity={velocity.current}
          accelData={accelData}
          friction={friction}
          initialTilt={initialTilt}
          onPathUpdate={handlePathUpdate}
          landRef={landRef}
          startZoneRef={startZoneRef}
          endZoneRef={endZoneRef}
          colliderRefs={colliderRefs}
          onGameStart={onGameStart}
          onGameOver={onGameOver}
          isPaused={isPaused}
          castShadow
        />
        <TransparentObject ballMeshRef={ballMeshRef} velocity={velocity} />
        <StageOneLand setLandRef={setLandRef} />
        <EventZone
          zoneRef={startZoneRef}
          onGameStart={onGameStart}
          position={[-86, -25, -7]}
          rotation={[0, Math.PI / 34, 0]}
          boxColor="red"
          size={[7, 32, 53]}
        />
        <EventZone
          zoneRef={endZoneRef}
          onGameOver={onGameOver}
          position={[-93, -25, 50]}
          rotation={[0, Math.PI / 28, 0]}
          boxColor="blue"
          size={[7, 32, 53]}
        />
        {colliderBoxes.map((box, index) => {
          return (
            <ColliderBox
              key={box.id}
              size={box.size}
              position={box.position}
              rotation={box.rotation}
              ref={setColliderRef(index)}
            />
          );
        })}
      </Canvas>
      {isOverlayVisible && <View style={styles.overlayContainer} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFEFF",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
