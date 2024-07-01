import { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Image, Text, StyleSheet, AppState } from "react-native";
import { useRouter } from "expo-router";
import { vh, vw } from "react-native-expo-viewport-units";
import AsyncStorage from "@react-native-async-storage/async-storage";

import LoadingScreen from "../LoadingScreen/LoadingScreen";
import Game3DScene from "../Game3DScene/Game3DScene";
import useTimer from "../../src/hooks/useTimer";
import ConfirmationModal from "../../src/components/ConfirmationModal/ConfirmationModal";
import GameResultModal from "../../src/components/GameResultModal/GameResultModal";
import ChallengeModal from "../../src/components/ChallengeModal/ChallengeModal";

import MainButtonImage from "../../assets/images/home.png";
import pauseButtonImage from "../../assets/images/pause.png";
import playButtonImage from "../../assets/images/play.png";
import increaseImage from "../../assets/images/increase.png";
import decreaseImage from "../../assets/images/decrease.png";

const GAME_STATE_KEY = "gameState";

export default function Stage2Screen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [sensitiveCount, setSensitiveCount] = useState(5);
  const [isSensitiveButtonVisible, setIsSensitiveButtonVisible] = useState(true);
  const [isPauseButtonVisible, setIsPauseButtonVisible] = useState(true);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isMainModalVisible, setIsMainModalVisible] = useState(false);
  const [isGameResultModalVisible, setIsGameResultModalVisible] = useState(false);
  const [gameResultMessage, setGameResultMessage] = useState("");
  const [ballPath, setBallPath] = useState([]);
  const [correctPath, setCorrectPath] = useState([]);
  const [matchedRate, setMatchedRate] = useState(0);

  const initialTime = 60;
  const { timeLeft, startTimer, stopTimer, resetTimer, setTimeLeft } = useTimer(initialTime);

  const router = useRouter();
  const appState = useRef(AppState.currentState);
  const hasGameStarted = useRef(true);

  const currentStage = 2;

  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    if (timeLeft === 0) {
      onGameOver("timeout");
    }

    return () => {
      subscription.remove();
    };
  }, [timeLeft, isPaused, sensitiveCount, isPauseButtonVisible]);

  async function handleAppStateChange(nextAppState) {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      await loadGameState();
    } else if (nextAppState.match(/inactive|background/)) {
      if (hasGameStarted.current) {
        handleGamePauseButtonTouch();
        await saveGameState();
      }
    }
    appState.current = nextAppState;
  }

  async function saveGameState() {
    const gameState = {
      timeLeft,
      isPaused: true,
      sensitiveCount,
      isPauseButtonVisible: false,
    };
    await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  }

  async function loadGameState() {
    const savedState = await AsyncStorage.getItem(GAME_STATE_KEY);

    if (savedState) {
      const gameState = JSON.parse(savedState);

      setTimeLeft(gameState.timeLeft);
      setSensitiveCount(gameState.sensitiveCount);
      setIsPauseButtonVisible(gameState.isPauseButtonVisible);
      setIsPaused(gameState.isPaused);
    }
  }

  function handleGamePauseButtonTouch() {
    if (isPauseButtonVisible) {
      setIsPauseButtonVisible(false);
      setIsOverlayVisible(true);
      setIsPaused(true);
      stopTimer();
    }
  }

  function handleGameResumeButtonTouch() {
    setIsPauseButtonVisible(true);
    setIsOverlayVisible(false);
    setIsPaused(false);
    if (!isSensitiveButtonVisible) {
      startTimer();
    }
  }

  function handleMainButtonTouch() {
    setIsMainModalVisible(true);
    setIsPaused(true);
    stopTimer();
  }

  function handleRightButtonTouch() {
    setIsMainModalVisible(false);
    if (isPauseButtonVisible) {
      setIsPaused(false);
      startTimer();
    }
  }

  function handleLeftButtonTouch() {
    router.replace("/MainScreen/MainScreen");
    resetTimer();
  }

  function handleIncreaseCount() {
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
    hasGameStarted.current = true;
    startTimer();
    setIsSensitiveButtonVisible(false);
  }

  async function onGameOver(message) {
    const matchRate = await calculateMatchRate();
    setMatchedRate(matchRate);
    setIsPaused(true);
    setGameResultMessage(message);
    setIsGameResultModalVisible(true);
    stopTimer();
  }

  function handlePathUpdate(newPosition) {
    setBallPath((prevPath) => [...prevPath, newPosition]);
  }

  async function calculateMatchRate() {
    if (correctPath.length === 0) {
      return 0;
    }
    const rate = ballPath.length / correctPath.length;
    const roundedRate = parseFloat(rate.toFixed(2)) * 100;

    return roundedRate;
  }

  return (
    <>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LoadingScreen />
        </View>
      )}
      {isAnimating && (
        <View style={styles.centered}>
          <View style={styles.textInfoContainer}>
            <Text style={styles.infoText}>
              길을 따라 <Text style={styles.specialText}>토끼</Text>를 정확하게 그려보세요!
            </Text>
          </View>
        </View>
      )}
      <View style={styles.container}>
        <Game3DScene
          isOverlayVisible={isOverlayVisible}
          onGameStart={onGameStart}
          onGameOver={onGameOver}
          isPaused={isPaused}
          reloadKey={appState.current}
          sensitiveCount={sensitiveCount}
          currentStage={currentStage}
          correctPath={correctPath}
          setCorrectPath={setCorrectPath}
          handlePathUpdate={handlePathUpdate}
          ballPath={ballPath}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          setIsAnimating={setIsAnimating}
          isAnimating={isAnimating}
        />
        <View style={styles.uiContainer}>
          <TouchableOpacity onPress={handleMainButtonTouch}>
            <Image style={styles.Images} source={MainButtonImage} />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.stageText}>Stage 2</Text>
            <Text style={styles.timeText}>{timeLeft}</Text>
          </View>
          {isPauseButtonVisible ? (
            <TouchableOpacity onPress={handleGamePauseButtonTouch}>
              <Image style={styles.Images} source={pauseButtonImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleGameResumeButtonTouch}>
              <Image style={styles.Images} source={playButtonImage} />
            </TouchableOpacity>
          )}
        </View>
        {isSensitiveButtonVisible ? (
          <View style={styles.countContainer}>
            <TouchableOpacity onPress={handleDecreaseCount}>
              <Image style={styles.Images} source={decreaseImage} />
            </TouchableOpacity>
            <Text style={styles.countText}>{sensitiveCount}</Text>
            <TouchableOpacity onPress={handleIncreaseCount}>
              <Image style={styles.Images} source={increaseImage} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {!isAnimating && <ChallengeModal currentStage={currentStage} setIsPaused={setIsPaused} />}
      <GameResultModal
        visible={isGameResultModalVisible}
        currentStage={currentStage}
        gameResultMessage={gameResultMessage}
        timeLeft={timeLeft}
        matchedRate={matchedRate}
      />
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
  textInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: vw(90),
    height: vh(7),
    top: 130,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    zIndex: 1,
  },
  centered: {
    width: vw(100),
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  infoText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#0f0f0f",
    textShadowColor: "#fff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: "#fff",
  },
  specialText: {
    color: "#ff7f00",
  },
});
