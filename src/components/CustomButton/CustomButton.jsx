import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CustomButton({ containerStyle, buttonText, textStyle, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, containerStyle]} onPress={onPress}>
      <Text style={textStyle}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
