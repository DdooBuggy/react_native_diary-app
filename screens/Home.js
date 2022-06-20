import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../colors";
import { useDB } from "../context";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  TouchableOpacity,
  UIManager,
} from "react-native";
// import { AdMobBanner } from "expo-ads-admob";

const Container = styled.View`
  flex: 1;
  padding: 0px 30px;
  padding-top: 100px;
  background-color: ${colors.bgColor};
  align-items: center;
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-size: 38px;
  font-weight: 500;
  width: 100%;
`;
const Btn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 30px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.btnColor};
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
  elevation: 3;
`;
const Record = styled.View`
  background-color: ${colors.cardColor};
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 1px 1px 1px rgba(41, 30, 95, 0.1);
`;
const Emotion = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`;
const Message = styled.Text`
  font-size: 18px;
`;
const Separator = styled.View`
  height: 10px;
`;

const Home = ({ navigation: { navigate } }) => {
  const realm = useDB();
  const [feelings, setFeelings] = useState([]);
  useEffect(() => {
    const feelings = realm.objects("Feeling");
    feelings.addListener((feelings) => {
      if (Platform.OS === "android") {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
          UIManager.setLayoutAnimationEnabledExperimental(true);
        }
      }
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      LayoutAnimation.linear();
      setFeelings(feelings.sorted("_id", true));
    });
    return () => feelings.removeAllListeners();
  }, []);
  const onPress = (id) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey("Feeling", id);
      realm.delete(feeling);
    });
  };
  return (
    <Container>
      <Title>My journal</Title>
      {/* <AdMobBanner
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-3940256099942544/6300978111"
      /> */}
      <FlatList
        style={{ marginVertical: 50, width: "100%" }}
        data={feelings}
        contentContainerStyle={{ paddingVertical: 10 }}
        ItemSeparatorComponent={Separator}
        keyExtractor={(item) => item._id + ""}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item._id)}>
            <Record>
              <Emotion>{item.emotion}</Emotion>
              <Message>{item.message}</Message>
            </Record>
          </TouchableOpacity>
        )}
      />
      <Btn onPress={() => navigate("Write")}>
        <Ionicons name="add" color="white" size={40} />
      </Btn>
    </Container>
  );
};

export default Home;
