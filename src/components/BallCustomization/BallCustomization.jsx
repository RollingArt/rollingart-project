import { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Canvas } from "@react-three/fiber";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { vw, vh } from "react-native-expo-viewport-units";

import StaticBall from "../StaticBall/StaticBall";

import arrowButtonImage from "../../../assets/images/arrowButton.png";
import circleImage from "../../../assets/images/circle.png";
import patternTexture1 from "../../../assets/images/patternTexture1.png";
import patternTexture2 from "../../../assets/images/patternTexture2.png";
import patternTexture3 from "../../../assets/images/patternTexture3.png";

export default function BallCustomization() {
  const [patternIndex, setPatternIndex] = useState(0);
  const patterns = [patternTexture1, patternTexture2, patternTexture3];

  useEffect(() => {
    AsyncStorage.setItem("selectedPatternIndex", patternIndex.toString());
  }, [patternIndex]);

  function handleNextPattern() {
    setPatternIndex((prevIndex) => (prevIndex + 1) % patterns.length);
  }

  function handlePrevPattern() {
    setPatternIndex((prevIndex) => (prevIndex - 1 + patterns.length) % patterns.length);
  }

  return (
    <View style={styles.rowWrapper}>
      <TouchableOpacity onPress={handlePrevPattern}>
        <Image style={styles.arrowImage} source={arrowButtonImage} testID="arrow-button" />
      </TouchableOpacity>
      <View style={styles.circleContainer}>
        <Image style={styles.circleImage} source={circleImage} />
        <View style={styles.ballContainer} testID="ball-container">
          <Canvas style={styles.canvasContainer}>
            <ambientLight />
            <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
            <StaticBall currentBallPatternTexture={patterns[patternIndex]} testID="static-ball" />
          </Canvas>
        </View>
      </View>
      <TouchableOpacity onPress={handleNextPattern}>
        <Image
          style={[styles.arrowImage, { transform: [{ scaleX: -1 }] }]}
          source={arrowButtonImage}
          testID="arrow-button"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  circleContainer: {
    position: "relative",
    width: vw(50),
    height: vh(25),
  },
  ballContainer: {
    width: vw(50),
    height: vh(25),
    top: vh(-4),
    position: "absolute",
    resizeMode: "contain",
    zIndex: 2,
  },
  rowWrapper: {
    width: "80%",
    height: "46%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowImage: {
    width: vw(10),
    marginHorizontal: 15,
    marginBottom: vh(8),
    resizeMode: "contain",
  },
  circleImage: {
    width: vw(50),
    height: vh(50),
    marginTop: vh(-16.5),
    resizeMode: "contain",
  },
});
