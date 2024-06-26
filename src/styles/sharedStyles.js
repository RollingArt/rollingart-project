import { StyleSheet } from "react-native";

const sharedStyles = StyleSheet.create({
  rowWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#0F0F0F",
  },
  container: {
    flex: 1,
  },
  centerHorizontal: {
    alignItems: "center",
  },
});

export default sharedStyles;
