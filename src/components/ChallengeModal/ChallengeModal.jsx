import { useState } from "react";
import { Modal, Text, View, StyleSheet, Pressable } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

export default function ChallengeModal({ currentStage, setIsPaused }) {
  const [visible, setVisible] = useState(true);
  function descriptionText1() {
    switch (currentStage) {
      case 1:
        return "그림과 길의 일치율 65% 이상";
      case 2:
        return "그림과 길의 일치율 60% 이상";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  function descriptionText2() {
    switch (currentStage) {
      case 1:
        return "남은 시간 5초 이상";
      case 2:
        return "남은 시간 10초 이상";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  function descriptionText3() {
    switch (currentStage) {
      case 1:
        return "남은 시간 15초 이상";
      case 2:
        return "남은 시간 20초 이상";
      default:
        return "오류가 발생했습니다. 게임을 다시 시작해주세요.";
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        onPress={() => {
          setVisible(false);
          setIsPaused(false);
        }}
        style={styles.modalBackGround}
      >
        <Pressable onPress={() => {}} style={styles.modalView}>
          <Text style={styles.titleText}>도전 과제</Text>
          <View style={styles.descriptionView}>
            <Text style={styles.descriptionText1}>{descriptionText1()}</Text>
            <Text style={styles.descriptionText2}>{descriptionText2()}</Text>
            <Text style={styles.descriptionText2}>{descriptionText3()}</Text>
          </View>
          <Text style={styles.descriptionText3}>
            위 도전과제를 하나 달성할 때마다 별이 하나 부여됩니다.
          </Text>
          <Text style={styles.descriptionText4}>빈곳을 터치하면 안내 창이 사라집니다.</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    width: vw(90),
    height: vh(29),
    marginTop: vh(-57),
    alignItems: "center",
    borderWidth: 3,
    borderStyle: "solid",
    borderColor: "#49a246",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  descriptionView: {
    textAlign: "center",
    width: vw(70),
    marginTop: vh(2),
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#DAF7D9",
  },
  titleText: {
    fontSize: 25,
    marginTop: vh(3),
    color: "#0f0f0f",
  },
  descriptionText1: {
    textAlign: "center",
    fontSize: 16,
    color: "#0f0f0f",
  },
  descriptionText2: {
    textAlign: "center",
    fontSize: 16,
    marginTop: vh(2),
    color: "#0f0f0f",
  },
  descriptionText3: {
    fontSize: 12,
    marginTop: vh(3),
    color: "#0f0f0f",
  },
  descriptionText4: {
    position: "absolute",
    fontSize: 16,
    marginTop: vh(45),
    color: "#ffffff",
  },
});
