import { useEffect, useRef, useState, useMemo } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Canvas } from "@react-three/fiber";
import { Accelerometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Ball from "../../src/components/Ball/Ball";
import CameraController from "../../src/components/CameraController/CameraController";
import TransparentObject from "../../src/components/TransparentObject/TransparentObject";
import ModelLoader from "../../src/hooks/ModelLoader";
import getAssetUri from "../../src/utils/getAssetUri";

import patternTexture from "../../assets/images/patternTexture.png";
import patternTextureSecond from "../../assets/images/patternTextureSecond.png";
import patternTextureThird from "../../assets/images/patternTextureThird.png";

function StageOneLand() {
  const [modelUri, setModelUri] = useState(null);
  const [scene, setScene] = useState(null);

  useEffect(() => {
    async function loadModel() {
      const uri = await getAssetUri(require("../../assets/models/stageOne.glb"));
      setModelUri(uri);
    }
    loadModel();
  }, []);

  if (!modelUri) return null;

  return (
    <>
      <ModelLoader modelUri={modelUri} onLoad={setScene} />
      {scene && <primitive object={scene} position={[0, -100, 0]} />}
    </>
  );
}

export default function Game3DScreen() {
  const ballMeshRef = useRef();

  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const initialTilt = useRef({ x: 0, y: 0, z: 0 });
  const position = useRef({ x: 0, y: 1, z: 0 });
  const velocity = useRef({ x: 0, y: 0, z: 0 });
  const friction = 1.2;

  const [patternIndex, setPatternIndex] = useState(0);
  const patterns = useMemo(() => [patternTexture, patternTextureSecond, patternTextureThird]);
  const selectedPattern = patterns[patternIndex];

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
  }, []);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <ambientLight />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <CameraController followTarget={ballMeshRef} />
        <Ball
          ballMeshRef={ballMeshRef}
          currentBallPatternTexture={selectedPattern}
          initialPosition={position.current}
          initialVelocity={velocity.current}
          accelData={accelData}
          friction={friction}
          initialTilt={initialTilt}
          showTransparentObject={false}
        />
        <TransparentObject ballMeshRef={ballMeshRef} velocity={velocity} />
        <StageOneLand />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DAF7D9",
  },
  canvas: {
    flex: 1,
  },
});
