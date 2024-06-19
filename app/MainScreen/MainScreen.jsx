import { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { vw, vh } from "react-native-expo-viewport-units";

import CustomButton from "../../src/components/CustomButton/CustomButton";
import ConfirmationModal from "../../src/components/ConfirmationModal/ConfirmationModal";
import BallCustomization from "../../src/components/BallCustomization/BallCustomization";

import rogoImage from "../../assets/images/rogoTitle.png";

export default function MainScreen() {
  const [isExitGameModalVisible, setIsExitGameModalVisible] = useState(false);
  const router = useRouter();

  function handleOpenModal() {
    setIsExitGameModalVisible(true);
  }

  function handleCloseModal() {
    setIsExitGameModalVisible(false);
  }

  async function handleStartButtonTouch() {
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
  logoImage: {
    width: vw(70),
    marginTop: vh(8),
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
  text: {
    fontSize: 16,
    color: "#ffffff",
  },
});
