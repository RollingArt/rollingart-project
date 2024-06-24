import { useState } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { vh, vw } from "react-native-expo-viewport-units";

import Game3DScene from "../Game3DScene/Game3DScene";
import useTimer from "../../src/hooks/useTimer";
import ConfirmationModal from "../../src/components/ConfirmationModal/ConfirmationModal";
import GameResultModal from "../../src/components/GameResultModal/GameResultModal";

import MainButtonImage from "../../assets/images/home.png";
import pauseButtonImage from "../../assets/images/pause.png";
import playButtonImage from "../../assets/images/play.png";
import increaseImage from "../../assets/images/increase.png";
import decreaseImage from "../../assets/images/decrease.png";

export default function GameScreen() {
  const [sensitiveCount, setSensitiveCount] = useState(5);

  const [isPauseButtonVisible, setIsPauseButtonVisible] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const [isMainModalVisible, setIsMainModalVisible] = useState(false);
  const [isGameResultModalVisible, setIsGameResultModalVisible] = useState(false);

  const initialTime = 60;
  const { timeLeft, startTimer, stopTimer, resetTimer } = useTimer(initialTime);

  function handleGamePauseToggle() {
    if (isPauseButtonVisible) {
      setIsPauseButtonVisible(false);
      setIsOverlayVisible(true);
      stopTimer();
    } else {
      setIsPauseButtonVisible(true);
      setIsOverlayVisible(false);
      startTimer();
    }
  }

  function handleMainButtonTouch() {
    setIsMainModalVisible(true);
    stopTimer();
  }

  function handleRightButtonTouch() {
    setIsMainModalVisible(false);
    startTimer();
  }

  function handleLeftButtonTouch() {
    router.replace("/MainScreen/MainScreen");
    resetTimer();
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

  function onGameStart() {
    startTimer();
  }

  function onGameOver() {
    setIsGameResultModalVisible(true);
    stopTimer();
  }

  return (
    <>
      <View style={styles.container}>
        <Game3DScene
          isOverlayVisible={isOverlayVisible}
          onGameStart={onGameStart}
          onGameOver={onGameOver}
        />
        <View style={styles.uiContainer}>
          <TouchableOpacity onPress={handleMainButtonTouch}>
            <Image style={styles.Images} source={MainButtonImage} />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.stageText}>stage 1</Text>
            <Text style={styles.timeText}>{timeLeft}</Text>
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
      <GameResultModal visible={isGameResultModalVisible} />
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
