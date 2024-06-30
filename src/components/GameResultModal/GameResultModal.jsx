import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Modal, View, Text, Image, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../CustomButton/CustomButton";

import emptyStar from "../../../assets/images/emptyStar.png";
import filledStar from "../../../assets/images/filledStar.png";
import successImage from "../../../assets/images/success.png";
import failedImage from "../../../assets/images/fail.png";

export default function GameResultModal({
  visible,
  currentStage,
  gameResultMessage,
  timeLeft,
  matchedRate,
}) {
  const [storedStarData, setStoredStarData] = useState({});
  const [completeAchievements, setCompleteAchievements] = useState({});
  const [starCount, setStarCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (visible) {
      const newAchievements = checkAchievements(timeLeft);
      const newStarCount = getStarCount(newAchievements);
      setCompleteAchievements(newAchievements);
      setStarCount(newStarCount);
      saveStarCount(currentStage, newStarCount);
    }
  }, [visible, matchedRate, timeLeft]);

  function handleMainButtonTouch() {
    router.replace("/MainScreen/MainScreen");
  }

  function reStartGameButtonTouch() {
    router.replace(`/StageScreen/Stage${currentStage}Screen`);
  }

  function nextStageButtonTouch() {
    const nextStage = currentStage + 1;
    router.replace(`/StageScreen/Stage${nextStage}Screen`);
  }

  function gameOverMessage() {
    switch (gameResultMessage) {
      case "finish":
        return "훌륭합니다!";
      case "fall":
        return "다시 도전하세요!";
      case "timeout":
        return "시간이 종료되었습니다";
      default:
        return "오류가 발생했습니다. 다시 시도해주세요.";
    }
  }

  function getStarCount(achievements) {
    if (gameResultMessage === "finish") {
      let count = 0;
      if (achievements.achievement1) count++;
      if (achievements.achievement2) count++;
      if (achievements.achievement3) count++;
      return count;
    }
    return 0;
  }

  function checkAchievements(timeRemaining) {
    return {
      achievement1: matchedRate > 60,
      achievement2: timeRemaining > 10,
      achievement3: timeRemaining > 20,
    };
  }

  function isAchievementCompleted(achievement) {
    if (gameResultMessage === "finish") {
      return achievement ? successImage : failedImage;
    }
    return failedImage;
  }

  async function saveStarCount(stage, count) {
    const starData = await AsyncStorage.getItem("starData");
    const stars = starData ? JSON.parse(starData) : {};

    if (!stars[stage] || stars[stage] < count) {
      stars[stage] = count;
      await AsyncStorage.setItem("starData", JSON.stringify(stars));
    }

    setStoredStarData(stars);
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackGround}>
        <View style={styles.modalView}>
          <Text style={styles.messageText}>{gameOverMessage()}</Text>
          {gameResultMessage === "finish" && <Text>일치율 {matchedRate}%</Text>}
          <View style={styles.starContainer}>
            <Image style={styles.smallStarImage} source={starCount >= 1 ? filledStar : emptyStar} />
            <Image style={styles.bigStarImage} source={starCount >= 2 ? filledStar : emptyStar} />
            <Image style={styles.smallStarImage} source={starCount >= 3 ? filledStar : emptyStar} />
          </View>
          <Text style={styles.challengeText}>
            일치율 60% 이상
            <Image
              style={styles.challengeImage}
              source={isAchievementCompleted(completeAchievements.achievement1)}
            />
          </Text>
          <Text style={styles.challengeText}>
            남은 시간 10초 이상
            <Image
              style={styles.challengeImage}
              source={isAchievementCompleted(completeAchievements.achievement2)}
            />
          </Text>
          <Text style={styles.challengeText}>
            남은 시간 20초 이상
            <Image
              style={styles.challengeImage}
              source={isAchievementCompleted(completeAchievements.achievement3)}
            />
          </Text>
          <View>
            {currentStage < 2 && storedStarData[1] >= 1 ? (
              <CustomButton
                containerStyle={styles.buttonContainer}
                buttonText="다음 스테이지"
                onPress={nextStageButtonTouch}
              />
            ) : null}
            <CustomButton
              containerStyle={styles.buttonContainer}
              buttonText="다시하기"
              onPress={reStartGameButtonTouch}
            />
            <CustomButton
              containerStyle={styles.buttonContainer}
              buttonText="메인으로"
              onPress={handleMainButtonTouch}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: vw(80),
    height: vh(58),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "#49a246",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  messageText: {
    fontSize: 25,
  },
  buttonContainer: {
    backgroundColor: "#DAF7D9",
    width: vw(30),
    marginHorizontal: 15,
    marginTop: 20,
    padding: 10,
  },
  starContainer: {
    flexDirection: "row",
  },
  smallStarImage: {
    width: vw(10),
    height: vh(10),
    resizeMode: "contain",
  },
  bigStarImage: {
    width: vw(15),
    height: vh(8),
    resizeMode: "contain",
  },
  challengeImage: {
    marginTop: -4,
    width: vw(7),
    height: vh(2),
    resizeMode: "contain",
  },
  challengeText: {
    margin: 5,
    fontSize: 14,
  },
});
