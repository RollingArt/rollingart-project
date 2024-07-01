import { useEffect, useMemo, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import { Canvas } from "@react-three/fiber";
import AsyncStorage from "@react-native-async-storage/async-storage";

import StaticBall from "../../src/components/StaticBall/StaticBall";

import patternTexture1 from "../../assets/images/patternTexture1.png";
import patternTexture2 from "../../assets/images/patternTexture2.png";
import patternTexture3 from "../../assets/images/patternTexture3.png";
import circleImage from "../../assets/images/circle.png";

export default function LoadingScreen() {
  const [patternIndex, setPatternIndex] = useState(0);
  const patterns = useMemo(() => [patternTexture1, patternTexture2, patternTexture3]);
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
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
      <Image style={styles.circleImage} source={circleImage} />
      <View style={styles.circleImage}>
        <View style={styles.ballContainer}>
          <Canvas style={styles.canvasContainer}>
            <ambientLight />
            <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
            <StaticBall currentBallPatternTexture={selectedPattern} />
          </Canvas>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
  },
  canvasContainer: {
    width: vw(50),
    height: vh(25),
    top: vh(-23.5),
    position: "absolute",
    resizeMode: "contain",
    zIndex: 2,
  },
  ballContainer: {
    width: vw(50),
    height: vh(25),
    top: vh(-4),
    position: "absolute",
    resizeMode: "contain",
    zIndex: 2,
  },
  loadingText: {
    marginTop: vh(25),
    fontSize: 38,
    fontWeight: "bold",
    color: "#0F0F0F",
  },
  circleImage: {
    width: vw(50),
    height: vh(30),
    resizeMode: "contain",
  },
});
