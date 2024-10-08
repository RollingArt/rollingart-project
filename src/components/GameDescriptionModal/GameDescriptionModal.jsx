import { useEffect } from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

import CustomButton from "../CustomButton/CustomButton";

import arrowButtonImage from "../../../assets/images/arrowButton.png";
import homeImage from "../../../assets/images/homeImage.png";
import pauseImage from "../../../assets/images/pauseImage.png";
import sensitiveImage from "../../../assets/images/sensitiveImage.png";
import timerImage from "../../../assets/images/timerImage.png";
import gameResultImage from "../../../assets/images/gameResultImage.png";
import stageImage from "../../../assets/images/stageImage.jpeg";
import questionButtonImage from "../../../assets/images/questionButtonImage.png";
import phoneImage from "../../../assets/images/phoneImage.png";

export default function GameDescriptionModal({
  setIsPaused,
  onGameStart,
  setIsGameDescriptionModalVisible,
  isGameDescriptionModalVisible,
  isPauseButtonVisible,
  descriptionImages,
  setDescriptionImages,
}) {
  const images = [
    phoneImage,
    homeImage,
    timerImage,
    pauseImage,
    sensitiveImage,
    stageImage,
    gameResultImage,
    questionButtonImage,
  ];

  useEffect(() => {
    setIsPaused(true);
  }, []);

  function handleNextImageButtonTouch() {
    if (descriptionImages < images.length - 1) {
      setDescriptionImages((prevIndex) => prevIndex + 1);
    }
  }

  function handlePrevImageButtonTouch() {
    if (descriptionImages > 0) {
      setDescriptionImages((prevIndex) => prevIndex - 1);
    }
  }

  async function handleCloseButtonTouch() {
    setIsGameDescriptionModalVisible(false);
    setDescriptionImages(0);
    if (isPauseButtonVisible) {
      setIsPaused(false);
      onGameStart(true);
    }
  }

  function descriptionText1() {
    switch (descriptionImages) {
      case 0:
        return "스테이지 최초 입장시 기울기가 0으로 적용됩니다.";
      case 1:
        return null;
      case 2:
        return "남은 타이머가 표시됩니다.";
      case 3:
        return "일시 정지가 가능한 버튼입니다.";
      case 4:
        return "센서의 민감도를 설정할 수 있는 버튼입니다.";
      case 5:
        return null;
      case 6:
        return "게임이 종료되면 보이는 화면입니다.";
      case 7:
        return "튜토리얼 모드에만 존재하는 버튼입니다.";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  function descriptionText2() {
    switch (descriptionImages) {
      case 0:
        return "디바이스 기울기가 앞, 뒤, 좌, 우로 90도가 넘을 시 센서가 정상적으로 작동하지 않습니다.";
      case 1:
        return "메인 화면으로 이동할 수 있는 버튼입니다.";
      case 2:
        return "타이머가 0이 되면 게임이 종료됩니다.";
      case 3:
        return "버튼을 터치하면 타이머와 공이 멈춥니다.";
      case 4:
        return "1에 가까워질수록 센서가 둔감해집니다.";
      case 5:
        return "스테이지를 위에서 바라본 모습입니다.";
      case 6:
        return "도전 과제를 달성하면 별을 획득합니다.";
      case 7:
        return "터치하면 게임 설명을 다시 읽을 수 있습니다.";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  function descriptionText3() {
    switch (descriptionImages) {
      case 0:
        return "튜토리얼을 통해 조작감을 익혀보세요!";
      case 1:
        return null;
      case 2:
        return null;
      case 3:
        return "일시정지 상태에서 터치하면 게임이 재개됩니다.";
      case 4:
        return "9에 가까워질수록 센서가 민감해집니다.";
      case 5:
        return "스테이지의 길을 따라 공으로 그림을 그려보세요!";
      case 6:
        return "도전 과제를 클리어해 별을 획득해보세요!";
      case 7:
        return null;
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  return (
    <Modal visible={isGameDescriptionModalVisible} transparent animationType="fade">
      <View style={styles.modalBackGround}>
        <View style={styles.modalView}>
          <Text style={styles.titleText}>게임 시작</Text>
          <View style={styles.rowWrapper}>
            <TouchableOpacity
              testID="prev-button"
              onPress={descriptionImages > 0 ? handlePrevImageButtonTouch : null}
            >
              <Image
                style={descriptionImages > 0 ? styles.arrowImage : styles.arrowImageBlurred}
                source={arrowButtonImage}
              />
            </TouchableOpacity>
            <Image source={images[descriptionImages]} style={styles.descriptionImage} />
            <TouchableOpacity
              testID="next-button"
              onPress={descriptionImages < 7 ? handleNextImageButtonTouch : null}
            >
              <Image
                style={
                  descriptionImages < 7
                    ? [styles.arrowImage, { transform: [{ scaleX: -1 }] }]
                    : [styles.arrowImageBlurred, { transform: [{ scaleX: -1 }] }]
                }
                source={arrowButtonImage}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.descriptionText1}>{descriptionText1()}</Text>
          <Text style={styles.descriptionText2}>{descriptionText2()}</Text>
          <Text style={styles.descriptionText2}>{descriptionText3()}</Text>
          <CustomButton
            testID="close-button"
            containerStyle={styles.closeButton}
            buttonText="설명 닫기"
            onPress={handleCloseButtonTouch}
          />
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
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalView: {
    width: Platform.OS === "ios" ? vw(85) : vw(88),
    height: Platform.OS === "ios" ? vh(60) : vh(78),
    padding: 8,
    alignItems: "center",
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "#49a246",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  rowWrapper: {
    width: "80%",
    height: Platform.OS === "ios" ? "46%" : "40%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    backgroundColor: "#DAF7D9",
    top: "88%",
    width: vw(30),
    marginTop: vh(3),
    padding: 10,
  },
  arrowImage: {
    width: vw(7),
    marginHorizontal: 15,
    marginBottom: vh(-3),
    resizeMode: "contain",
  },
  arrowImageBlurred: {
    width: vw(7),
    marginHorizontal: 15,
    marginBottom: vh(-3),
    resizeMode: "contain",
    opacity: 0.1,
  },
  descriptionImage: {
    width: vw(52),
    marginTop: vh(3),
    resizeMode: "contain",
  },
  titleText: {
    fontSize: 25,
    marginTop: vh(4),
  },
  descriptionText1: {
    fontSize: 16,
    marginTop: vh(2),
    textAlign: "center",
  },
  descriptionText2: {
    fontSize: 16,
    marginTop: vh(2),
    textAlign: "center",
  },
});
