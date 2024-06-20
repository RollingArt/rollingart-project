import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Canvas } from "@react-three/fiber";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Ball from "../../src/components/Ball/Ball";
import ModelLoader from "../../src/hooks/ModelLoader";

import getAssetUri from "../../src/utils/getAssetUri";

import patternTexture from "../../assets/images/patternTexture.png";
import patternTextureSecond from "../../assets/images/patternTextureSecond.png";
import patternTextureThird from "../../assets/images/patternTextureThird.png";

function TransparentObject() {
  return (
    <mesh position={[0, -1, 1.1]}>
      <boxGeometry args={[3.9, 0.1, 2.2]} />
      <meshStandardMaterial color="#DAF7D9" />
    </mesh>
  );
}

function StageOneLand() {
  const [modelUri, setModelUri] = useState(null);
  const [scene, setScene] = useState(null);

  useEffect(() => {
    async function loadModel() {
      const uri = await getAssetUri(require("../../assets/models/stageOneLand.gltf"));
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

export default function Game3DScene({ isOverlayVisible }) {
  const [patternIndex, setPatternIndex] = useState(0);
  const patterns = useMemo(() => [patternTexture, patternTextureSecond, patternTextureThird]);
  const selectedPattern = patterns[patternIndex];

  useEffect(() => {
    const loadPattern = async () => {
      const savedPatternIndex = await AsyncStorage.getItem("selectedPatternIndex");
      if (savedPatternIndex !== null) {
        setPatternIndex(parseInt(savedPatternIndex, 10));
      }
    };
    loadPattern();
  }, []);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas} camera={{ position: [0, 50, 100], fov: 80 }}>
        <ambientLight />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
        <Ball currentBallPatternTexture={selectedPattern} />
        <TransparentObject />
        <StageOneLand />
      </Canvas>
      {isOverlayVisible && <View style={styles.overlayContainer} />}
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
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
