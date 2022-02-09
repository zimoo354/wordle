import React from "react";
import { NativeBaseProvider, Box } from "native-base";
import Wordle from "./Wordle";
import { LogBox } from "react-native";

export default function App() {
  LogBox.ignoreLogs(["NativeBase: The contrast ratio"]); // Ignore log notification by message

  return (
    <NativeBaseProvider>
      <Box flex={1} justifyContent="flex-start" pt={20} p={8}>
        <Wordle />
      </Box>
    </NativeBaseProvider>
  );
}
