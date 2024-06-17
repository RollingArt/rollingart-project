import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { vw, vh } from "react-native-expo-viewport-units";

import CustomButton from "../../src/components/CustomButton/CustomButton";

import sharedStyles from "../../src/styles/sharedStyles";

import emptyStar from "../../assets/images/emptyStar.png";
import filledStar from "../../assets/images/filledStar.png";

function StageCardButton({
  cardDisabled,
  cardButtonStyle,
  stageLevel,
  sterOneImage,
  starTwoImage,
  starThreeImage,
}) {
  return (
    <TouchableOpacity style={cardButtonStyle} disabled={cardDisabled}>
      <Text style={[!cardDisabled ? styles.enableCardText : styles.disableCardText]}>
        {stageLevel}
      </Text>
      {!cardDisabled && (
        <View style={styles.starWrapper}>
          <Image style={styles.starImage} source={sterOneImage} />
          <Image style={styles.starImage} source={starTwoImage} />
          <Image style={styles.starImage} source={starThreeImage} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function StageSelectScreen() {
  return (
    <View style={[sharedStyles.container, sharedStyles.centerHorizontal, styles.containerPadding]}>
      <Text style={sharedStyles.title}>STAGE</Text>
      <View style={[sharedStyles.ColumnWrapper, styles.cardWrapper]}>
        <StageCardButton
          cardDisabled={false}
          cardButtonStyle={styles.enableCardButton}
          stageLevel="Stage 1"
          sterOneImage={filledStar}
          starTwoImage={filledStar}
          starThreeImage={filledStar}
        />
        <StageCardButton
          cardDisabled={false}
          cardButtonStyle={styles.enableCardButton}
          stageLevel="Stage 2"
          sterOneImage={emptyStar}
          starTwoImage={emptyStar}
          starThreeImage={emptyStar}
        />
        <StageCardButton
          cardDisabled={true}
          cardButtonStyle={styles.disableCardButton}
          stageLevel="Stage 3"
        />
      </View>
      <CustomButton
        buttonText="메인"
        containerStyle={styles.buttonContainer}
        textStyle={styles.buttonText}
        onPress={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerPadding: {
    padding: 50,
  },
  enableCardButton: {
    width: vw(50),
    height: vh(18),
    alignItems: "center",
    justifyContent: "center",
    margin: 12,
    borderRadius: 10,
    backgroundColor: "#DAF7D9",
  },
  disableCardButton: {
    width: vw(50),
    height: vh(18),
    alignItems: "center",
    justifyContent: "center",
    margin: 12,
    borderRadius: 10,
    backgroundColor: "#D6D6D6",
  },
  cardWrapper: {
    justifyContent: "space-between",
    height: vh(64),
    marginVertical: 36,
  },
  buttonContainer: {
    width: vw(30),
    height: vh(6),
    backgroundColor: "#38D530",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
  },
  enableCardText: {
    color: "#38A333",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  disableCardText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  starImage: {
    height: vh(5),
    width: vh(5),
    resizeMode: "contain",
    marginHorizontal: 3,
  },
  starWrapper: {
    flexDirection: "row",
  },
});
