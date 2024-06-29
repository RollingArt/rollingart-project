import { useEffect, useState } from "react";
import { Modal, Text, StyleSheet, Pressable } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

export default function ChallengeModal({ currentStage, gameStarted }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (gameStarted) {
      setVisible(false);
    }
  }, [gameStarted]);

  function descriptionText1() {
    switch (currentStage) {
      case 1:
        return "스테이지 1 도전 과제 입니다.";
      case 2:
        return "스테이지 2 도전 과제 입니다.";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  function descriptionText2() {
    switch (currentStage) {
      case 1:
        return "스테이지 1 도전 과제 입니다.";
      case 2:
        return "스테이지 2 도전 과제 입니다.";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  function descriptionText3() {
    switch (currentStage) {
      case 1:
        return "스테이지 1 도전 과제 입니다.";
      case 2:
        return "스테이지 2 도전 과제 입니다.";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable onPress={() => setVisible(false)} style={styles.modalBackGround}>
        <Pressable onPress={() => {}} style={styles.modalView}>
          <Text style={styles.titleText}>도전 과제</Text>
          <Text style={styles.descriptionText1}>{descriptionText1()}</Text>
          <Text style={styles.descriptionText2}>{descriptionText2()}</Text>
          <Text style={styles.descriptionText2}>{descriptionText3()}</Text>
          <Text style={styles.descriptionText3}>빈곳을 터치하거나 스타트존을 벗어나면</Text>
          <Text style={{ color: "#ffffff", fontSize: 12 }}>도전 과제 안내 창이 사라집니다.</Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: vw(90),
    height: vh(25),
    marginTop: vh(-60),
    alignItems: "center",
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "#49a246",
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  titleText: {
    fontSize: 25,
    marginTop: vh(1),
    color: "#ffffff",
  },
  descriptionText1: {
    fontSize: 16,
    marginTop: vh(2),
    color: "#38D530",
  },
  descriptionText2: {
    fontSize: 16,
    marginTop: vh(2),
    color: "#38D530",
  },
  descriptionText3: {
    fontSize: 12,
    marginTop: vh(3),
    color: "#ffffff",
  },
});
