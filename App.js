import Realm from "realm";
import React, { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./navigator";
import { DBContext } from "./context";
// import { setTestDeviceIDAsync } from "expo-ads-admob";

const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [realm, setRealm] = useState(null);
  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        // await setTestDeviceIDAsync("EMULATOR");
        const connection = await Realm.open({
          path: "diaryDB",
          schema: [FeelingSchema],
        });
        setRealm(connection);
      } catch (e) {
        console.log(e);
      } finally {
        setIsReady(true);
      }
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <DBContext.Provider value={realm}>
      <NavigationContainer onReady={onLayoutRootView}>
        <Navigator />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
