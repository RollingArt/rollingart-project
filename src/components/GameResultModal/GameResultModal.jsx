import { router } from "expo-router";
import { Modal, View, Text, Image, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import CustomButton from "../CustomButton/CustomButton";

import emptyStar from "../../../assets/images/emptyStar.png";
import filledStar from "../../../assets/images/filledStar.png";
import successImage from "../../../assets/images/success.png";
import failedImage from "../../../assets/images/fail.png";

export default function GameResultModal() {
  function handleMainButtonTouch() {
    router.replace("/MainScreen/MainScreen");
  }

  return (
    <Modal transparent animationType="fade">
      <View style={styles.modalBackGround}>
        <View style={styles.modalView}>
          <Text style={styles.messageText}>훌륭합니다!</Text>
          <View style={styles.starContainer}>
            <Image style={styles.smallStarImage} source={filledStar} />
            <Image style={styles.bigStarImage} source={filledStar} />
            <Image style={styles.smallStarImage} source={emptyStar} />
          </View>
          <Text style={styles.challengeText}>
            도전과제
            <Image style={styles.challengeImage} source={successImage} />
          </Text>
          <Text style={styles.challengeText}>
            도전과제
            <Image style={styles.challengeImage} source={failedImage} />
          </Text>
          <Text style={styles.challengeText}>
            도전과제
            <Image style={styles.challengeImage} source={successImage} />
          </Text>
          <View>
            <CustomButton containerStyle={styles.buttonContainer} buttonText="다음스테이지" />
            <CustomButton containerStyle={styles.buttonContainer} buttonText="다시하기" />
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
    height: vh(50),
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
