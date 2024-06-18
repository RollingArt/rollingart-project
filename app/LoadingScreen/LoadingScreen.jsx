import { View, Image, Text, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

import squareImage from "../../assets/images/square.png";

export default function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
      <Image style={styles.squareImage} source={squareImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
  },
  loadingText: {
    marginTop: vh(25),
    fontSize: 38,
    fontWeight: "bold",
    color: "#0F0F0F",
  },
  squareImage: {
    width: vw(50),
    height: vh(30),
    resizeMode: "contain",
  },
});
