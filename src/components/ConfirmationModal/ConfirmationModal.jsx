import { Modal, View, Text, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";
import CustomButton from "../CustomButton/CustomButton";
import sharedStyles from "../../styles/sharedStyles";

export default function ConfirmationModal({
  visible,
  modalMessage,
  onLeftButtonTouch,
  onRightButtonTouch,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackGround}>
        <View style={styles.modalView}>
          <Text style={styles.messageText}>{modalMessage}</Text>
          <View style={sharedStyles.rowWrapper}>
            <CustomButton
              containerStyle={styles.buttonContainer}
              buttonText="YES"
              onPress={onLeftButtonTouch}
            />
            <CustomButton
              containerStyle={styles.buttonContainer}
              buttonText="NO"
              onPress={onRightButtonTouch}
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
    height: vh(25),
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
    borderWidth: 3,
    borderRadius: 8,
    borderStyle: "solid",
    borderColor: "#49a246",
    backgroundColor: "#ffffff",
  },
  messageText: {
    fontSize: 18,
  },
  buttonContainer: {
    backgroundColor: "#DAF7D9",
    width: "40%",
    marginHorizontal: 15,
    marginTop: 30,
    padding: 10,
  },
});
