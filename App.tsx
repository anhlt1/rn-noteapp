import React from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "./src/constants/colors";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./src/Routers/Router";

const App = () => {
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgColor }}>
        <StatusBar style="light" backgroundColor={colors.bgColor} />
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

export default App;
