import { useEffect, useState } from "react";
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

import CustomButton from "../CustomButton/CustomButton";

import arrowButtonImage from "../../../assets/images/arrowButton.png";
import homeImage from "../../../assets/images/homeImage.png";
import pauseImage from "../../../assets/images/pauseImage.png";
import sensitiveImage from "../../../assets/images/sensitiveImage.png";
import timerImage from "../../../assets/images/timerImage.png";

export default function GameDescriptionModal({ setIsPaused, onGameStart }) {
  const [descriptionImages, setDescriptionImages] = useState(0);
  const [visible, setVisible] = useState(true);
  const images = [homeImage, timerImage, pauseImage, sensitiveImage];

  useEffect(() => {
    setIsPaused(visible);
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
    setVisible(false);
    setIsPaused(!visible);
    onGameStart(true);
  }

  function descriptionText1() {
    switch (descriptionImages) {
      case 0:
        return "메인 화면으로 이동이 가능한 버튼입니다.";
      case 1:
        return "남은 타이머가 표시됩니다.";
      case 2:
        return "일시 정지가 가능한 버튼입니다.";
      case 3:
        return "센서의 민감도를 설정할 수 있는 버튼입니다.";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  function descriptionText2() {
    switch (descriptionImages) {
      case 0:
        return "터치하면 메인 화면으로 이동이 가능합니다.";
      case 1:
        return "타이머가 0이 되면 게임이 종료됩니다.";
      case 2:
        return "버튼을 터치하면 타이머와 공이 멈춥니다.";
      case 3:
        return "1에 가까워질수록 센서가 둔감해집니다.";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  function descriptionText3() {
    switch (descriptionImages) {
      case 0:
        return null;
      case 1:
        return null;
      case 2:
        return "일시정지 상태에서 터치하면 게임이 재개됩니다.";
      case 3:
        return "9에 가까워질수록 센서가 민감해집니다.";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackGround}>
        <View style={styles.modalView}>
          <Text style={styles.titleText}>게임 시작</Text>
          <View style={styles.rowWrapper}>
            <TouchableOpacity onPress={descriptionImages > 0 ? handlePrevImageButtonTouch : null}>
              <Image style={styles.arrowImage} source={arrowButtonImage} />
            </TouchableOpacity>
            <Image source={images[descriptionImages]} style={styles.descriptionImage} />
            <TouchableOpacity onPress={descriptionImages < 3 ? handleNextImageButtonTouch : null}>
              <Image
                style={[styles.arrowImage, { transform: [{ scaleX: -1 }] }]}
                source={arrowButtonImage}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.descriptionText1}>{descriptionText1()}</Text>
          <Text style={styles.descriptionText2}>{descriptionText2()}</Text>
          <Text style={styles.descriptionText2}>{descriptionText3()}</Text>
          <View>
            <CustomButton
              containerStyle={styles.closeButton}
              buttonText="설명 닫기"
              onPress={handleCloseButtonTouch}
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
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalView: {
    width: vw(80),
    height: vh(60),
    alignItems: "center",
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "#49a246",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  rowWrapper: {
    width: "80%",
    height: "46%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#DAF7D9",
    width: vw(30),
    marginHorizontal: 15,
    marginTop: vh(3),
    padding: 10,
  },
  arrowImage: {
    width: vw(7),
    marginHorizontal: 15,
    marginBottom: vh(-3),
    resizeMode: "contain",
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
  },
  descriptionText2: {
    fontSize: 16,
    marginTop: vh(2),
  },
});
