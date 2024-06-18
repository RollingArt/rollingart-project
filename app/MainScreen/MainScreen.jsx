import { useState } from "react";
import { router } from "expo-router";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

import CustomButton from "../../src/components/CustomButton/CustomButton";
import ConfirmationModal from "../../src/components/ConfirmationModal/ConfirmationModal";

import rogoImage from "../../assets/images/rogoTitle.png";
import arrowButtonImage from "../../assets/images/arrowButton.png";
import squareImage from "../../assets/images/square.png";

function BallCustomization() {
  return (
    <View style={styles.rowWrapper}>
      <TouchableOpacity>
        <Image style={styles.arrowImage} source={arrowButtonImage} />
      </TouchableOpacity>
      <Image style={styles.squareImage} source={squareImage} />
      <TouchableOpacity>
        <Image
          style={[styles.arrowImage, { transform: [{ scaleX: -1 }] }]}
          source={arrowButtonImage}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function MainScreen() {
  const [isExitGameModalVisible, setIsExitGameModalVisible] = useState(false);

  function handleOpenModal() {
    setIsExitGameModalVisible(true);
  }

  function handleCloseModal() {
    setIsExitGameModalVisible(false);
  }

  function handleStartButtonTouch() {
    router.replace("/StageSelectScreen/StageSelectScreen");
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.main}>
          <Image style={styles.logoImage} source={rogoImage} />
          <BallCustomization />
          <CustomButton
            containerStyle={[styles.button, styles.brightGreen]}
            textStyle={styles.text}
            buttonText="게임 시작"
            onPress={handleStartButtonTouch}
          />
          <CustomButton
            containerStyle={[styles.button, styles.black]}
            textStyle={styles.text}
            buttonText="게임 종료"
            onPress={handleOpenModal}
          />
        </View>
      </View>
      <ConfirmationModal
        visible={isExitGameModalVisible}
        onLeftButtonTouch={null}
        onRightButtonTouch={handleCloseModal}
        modalMessage="게임을 종료하시겠습니까?"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    justifyContent: "center",
    alignItems: "center",
  },
  rowWrapper: {
    width: "80%",
    height: "46%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#ffffff",
  },
  logoImage: {
    width: vw(70),
    marginTop: vh(8),
    resizeMode: "contain",
  },
  arrowImage: {
    width: vw(10),
    resizeMode: "contain",
  },
  squareImage: {
    width: vw(50),
    margin: vw(6),
    resizeMode: "contain",
  },
  button: {
    width: vw(70),
    height: vh(7),
    marginBottom: vw(5),
    borderRadius: 10,
  },
  brightGreen: {
    backgroundColor: "#38D530",
  },
  black: {
    backgroundColor: "#0f0f0f",
  },
});
