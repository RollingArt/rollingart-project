import { useRouter } from "expo-router";
import { Modal, View, Text, Image, StyleSheet, Platform } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

import CustomButton from "../CustomButton/CustomButton";

import filledStar from "../../../assets/images/filledStar.png";
import successImage from "../../../assets/images/success.png";

export default function TutorialResultModal({ visible, currentStage }) {
  const router = useRouter();

  function handleMainButtonTouch() {
    router.replace("/MainScreen/MainScreen");
  }

  function reStartGameButtonTouch() {
    router.replace(`/StageScreen/Stage${currentStage}Screen`);
  }

  function handleStage1ButtonTouch() {
    const nextStage = currentStage + 1;
    router.replace(`/StageScreen/Stage${nextStage}Screen`);
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackGround}>
        <View style={styles.modalView}>
          <Text style={styles.messageText}>스테이지 1에 도전하세요!</Text>
          <View style={styles.starContainer}>
            <Image style={styles.smallStarImage} source={filledStar} />
            <Image style={styles.bigStarImage} source={filledStar} />
            <Image style={styles.smallStarImage} source={filledStar} />
          </View>
          <Text style={styles.challengeText}>
            최고에요!
            <Image style={styles.challengeImage} source={successImage} />
          </Text>
          <Text style={styles.challengeText}>
            최고에요!
            <Image style={styles.challengeImage} source={successImage} />
          </Text>
          <Text style={styles.challengeText}>
            최고에요!
            <Image style={styles.challengeImage} source={successImage} />
          </Text>
          <View>
            <CustomButton
              containerStyle={styles.buttonContainer}
              buttonText="스테이지 1"
              onPress={handleStage1ButtonTouch}
            />
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
    height: Platform.OS === "ios" ? vh(51) : vh(58),
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
