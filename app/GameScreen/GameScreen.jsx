import { useState } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { vh, vw } from "react-native-expo-viewport-units";

import Game3DScene from "../Game3DScene/Game3DScene";
import ConfirmationModal from "../../src/components/ConfirmationModal/ConfirmationModal";

import MainButtonImage from "../../assets/images/home.png";
import pauseButtonImage from "../../assets/images/pause.png";
import playButtonImage from "../../assets/images/play.png";
import increaseImage from "../../assets/images/increase.png";
import decreaseImage from "../../assets/images/decrease.png";

export default function GameScreen() {
  const [isPauseButtonVisible, setIsPauseButtonVisible] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isMainModalVisible, setIsMainModalVisible] = useState(false);
  const [sensitiveCount, setSensitiveCount] = useState(5);

  function handleGamePauseToggle() {
    if (isPauseButtonVisible) {
      setIsPauseButtonVisible(false);
      setIsOverlayVisible(true);
    } else {
      setIsPauseButtonVisible(true);
      setIsOverlayVisible(false);
    }
  }

  function handleMainButtonTouch() {
    setIsMainModalVisible(true);
  }

  function handleRightButtonTouch() {
    setIsMainModalVisible(false);
  }

  function handleLeftButtonTouch() {
    router.replace("/MainScreen/MainScreen");
  }

  function handleIncreseCount() {
    if (sensitiveCount < 9 && increaseImage) {
      setSensitiveCount((prevCount) => prevCount + 1);
    }
  }

  function handleDecreaseCount() {
    if (sensitiveCount > 1 && decreaseImage) {
      setSensitiveCount((prevCount) => prevCount - 1);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Game3DScene isOverlayVisible={isOverlayVisible} />
        <View style={styles.uiContainer}>
          <TouchableOpacity onPress={handleMainButtonTouch}>
            <Image style={styles.Images} source={MainButtonImage} />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.stageText}>stage1</Text>
            <Text style={styles.timeText}>00</Text>
          </View>
          {isPauseButtonVisible ? (
            <TouchableOpacity onPress={handleGamePauseToggle}>
              <Image style={styles.Images} source={pauseButtonImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleGamePauseToggle}>
              <Image style={styles.Images} source={playButtonImage} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.countContainer}>
          <TouchableOpacity onPress={handleDecreaseCount}>
            <Image style={styles.Images} source={decreaseImage} />
          </TouchableOpacity>
          <Text style={styles.countText}>{sensitiveCount}</Text>
          <TouchableOpacity onPress={handleIncreseCount}>
            <Image style={styles.Images} source={increaseImage} />
          </TouchableOpacity>
        </View>
      </View>
      <ConfirmationModal
        visible={isMainModalVisible}
        onLeftButtonTouch={handleLeftButtonTouch}
        onRightButtonTouch={handleRightButtonTouch}
        modalMessage="메인으로 이동하시겠습니까?"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  uiContainer: {
    flexDirection: "row",
    position: "absolute",
    width: vw(90),
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  countContainer: {
    flexDirection: "row",
    position: "absolute",
    top: vh(70),
    left: vw(20),
    width: vw(60),
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: "solid",
    borderColor: "#49a246",
    backgroundColor: "rgba(218, 247, 217, 0.4)",
  },
  textContainer: {
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: 8,
    borderStyle: "solid",
    borderColor: "#49a246",
    backgroundColor: "rgba(218, 247, 217, 0.4)",
  },
  Images: {
    width: vw(10),
    height: vh(10),
    resizeMode: "contain",
  },
  stageText: {
    fontSize: 14,
    color: "#49a246",
  },
  timeText: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: "#49a246",
  },
  countText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#49a246",
  },
});
