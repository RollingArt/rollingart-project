import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { vw, vh } from "react-native-expo-viewport-units";

import CustomButton from "../../src/components/CustomButton/CustomButton";
import sharedStyles from "../../src/styles/sharedStyles";

import emptyStar from "../../assets/images/emptyStar.png";
import filledStar from "../../assets/images/filledStar.png";

function StageCardButton({
  cardDisabled,
  cardButtonStyle,
  stageLevel,
  starCount,
  onStageCardPress,
  id,
}) {
  const starImages = [];
  for (let i = 0; i < 3; i++) {
    starImages.push(
      <Image key={i} style={styles.starImage} source={i < starCount ? filledStar : emptyStar} />,
    );
  }

  return (
    <TouchableOpacity
      style={cardButtonStyle}
      disabled={cardDisabled}
      onPress={() => onStageCardPress(id)}
    >
      <Text style={!cardDisabled ? styles.enableCardText : styles.disableCardText}>
        {stageLevel}
      </Text>
      {!cardDisabled && <View style={styles.starWrapper}>{starImages}</View>}
    </TouchableOpacity>
  );
}

export default function StageSelectScreen() {
  const [starCounts, setStarCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadStarCounts();
  }, []);

  async function loadStarCounts() {
    const starData = await AsyncStorage.getItem("starData");
    if (starData) {
      setStarCounts(JSON.parse(starData));
    }
  }

  function handleStageCardButtonTouch(id) {
    setSelectedStage(id);
    setIsLoading(true);
  }

  useEffect(() => {
    if (isLoading && selectedStage !== null) {
      router.replace("/LoadingScreen/LoadingScreen");
      setTimeout(() => {
        setIsLoading(false);
        router.replace(`/StageScreen/Stage${selectedStage}Screen`);
      }, 2000);
    }
  }, [isLoading, selectedStage]);

  function handleMainButtonTouch() {
    router.replace("/MainScreen/MainScreen");
  }

  return (
    <View style={[sharedStyles.container, sharedStyles.centerHorizontal, styles.containerPadding]}>
      <Text style={sharedStyles.title}>STAGE</Text>
      <View style={[sharedStyles.ColumnWrapper, styles.cardWrapper]}>
        <StageCardButton
          cardDisabled={false}
          cardButtonStyle={styles.enableCardButton}
          stageLevel="Stage 1"
          id={1}
          starCount={starCounts[1] || 0}
          onStageCardPress={handleStageCardButtonTouch}
        />
        <StageCardButton
          cardDisabled={false}
          cardButtonStyle={styles.disableCardButton}
          stageLevel="Stage 2"
          id={2}
          starCount={starCounts[2] || 0}
          onStageCardPress={handleStageCardButtonTouch}
        />
      </View>
      <CustomButton
        buttonText="메인"
        containerStyle={styles.buttonContainer}
        textStyle={styles.buttonText}
        onPress={handleMainButtonTouch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerPadding: {
    padding: 50,
  },
  buttonContainer: {
    width: vw(30),
    height: vh(6),
    marginTop: vh(22),
    backgroundColor: "#38D530",
    borderRadius: 5,
  },
  cardWrapper: {
    justifyContent: "space-between",
    height: vh(34),
    marginVertical: 36,
  },
  enableCardButton: {
    width: vw(50),
    height: vh(18),
    marginTop: vh(6),
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
