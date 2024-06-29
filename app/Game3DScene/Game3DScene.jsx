import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { StyleSheet, Platform, View } from "react-native";
import { Canvas, extend } from "@react-three/fiber/native";
import * as THREE from "three";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Accelerometer } from "expo-sensors";

import { StageOneLand, TutorialStageLand } from "../../src/components/Land/Land";
import Ball from "../../src/components/Ball/Ball";
import CameraController from "../../src/components/CameraController/CameraController";

import patternTexture1 from "../../assets/images/patternTexture1.png";
import patternTexture2 from "../../assets/images/patternTexture2.png";
import patternTexture3 from "../../assets/images/patternTexture3.png";

extend(THREE);

export default function Game3DScreen({
  isOverlayVisible,
  onGameStart,
  onGameOver,
  isPaused,
  reloadKey,
  sensitiveCount,
  currentStage,
}) {
  // eslint-disable-next-line no-unused-vars
  const [ballPath, setBallPath] = useState([]);
  const [landLoaded, setLandLoaded] = useState(false);

  const ballMeshRef = useRef();
  const landRef = useRef();
  const startZoneRef = useRef();
  const endZoneRef = useRef();
  const colliderRefs = useRef([]);

  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const initialTilt = useRef({ x: 0, y: 0, z: 0 });
  const position = useRef({ x: -120, y: 0, z: 0 });
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const friction = 1.2;

  const [patternIndex, setPatternIndex] = useState(0);
  const patterns = useMemo(() => [patternTexture1, patternTexture2, patternTexture3]);
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
    Accelerometer.setUpdateInterval(300);
    const accelSubscription = Accelerometer.addListener((result) => {
      const now = Date.now();
      if (now - accelLastUpdate >= 300) {
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

  const distance = useCallback(
    (pos1, pos2) =>
      Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2 + (pos1.z - pos2.z) ** 2),
    [],
  );

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
    setLandLoaded(true);
  }, []);

  return (
    <>
      <Canvas style={styles.container} shadows>
        <ambientLight color={0xffffff} intensity={0.6} />
        <directionalLight color={0xffffff} intensity={1} position={[5, 5, 5]} castShadow />
        <CameraController followTarget={ballMeshRef} />
        {currentStage === 0 && <TutorialStageLand setLandRef={setLandRef} />}
        {currentStage === 1 && (
          <StageOneLand
            setLandRef={setLandRef}
            setColliderRef={setColliderRef}
            startZoneRef={startZoneRef}
            endZoneRef={endZoneRef}
            onGameStart={onGameStart}
            onGameOver={onGameOver}
          />
        )}
        {landLoaded && (
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
            sensitiveCount={sensitiveCount}
            currentStage={currentStage}
            castShadow
          />
        )}
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
