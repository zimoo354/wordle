import React, { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import {
  Input,
  Center,
  useToast,
  Button,
  HStack,
  Heading,
  Divider,
} from "native-base";
import words from "./utils/words";
import { ColorType } from "native-base/lib/typescript/components/types";

const Wordle = () => {
  const inputRef = useRef<TextInput>(null);

  const toast = useToast();

  const [solution, setSolution] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [intents, setIntents] = useState<string[]>([]);
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);

  useEffect(() => {
    restartGame();
  }, []);

  const focusField = () => {
    inputRef?.current?.focus();
  };

  const restartGame = () => {
    setSolution(words[Math.floor(Math.random() * words.length)]);
    setInputValue("");
    setIntents([]);
    setSubmitDisabled(false);
    focusField();
  };

  const handleInputField = (value: string) => {
    if (value.length <= 5) setInputValue(value.toUpperCase());
  };

  const handleSubmit = () => {
    focusField();
    if (inputValue.length !== 5) {
      toast.show({ description: "The word must have 5 characters" });
      return;
    }
    const newValue = inputValue.toLowerCase();
    if (!words.includes(newValue)) {
      toast.show({ description: "The word doesn't exist" });
      return;
    }

    if (intents.includes(newValue)) {
      toast.show({ description: "You already tried that word" });
      setInputValue("");
      return;
    }

    setInputValue("");
    setIntents((oldIntents) => {
      const newIntents = [...oldIntents, newValue];

      if (newValue === solution) {
        toast.show({
          title: "You win!!",
          description: `After ${newIntents.length} intents you've guessed the word`,
          status: "success",
        });
        setSubmitDisabled(true);
        return newIntents;
      }

      if (newIntents.length === 6) {
        toast.show({
          title: "You lose!!",
          description: `You haven't guessed the word. Which was: "${solution.toUpperCase()}. Please restart the game"`,
          status: "error",
        });
        setSubmitDisabled(true);
        return newIntents;
      }
      return newIntents;
    });
  };

  const CardWord = ({ word }: { word: string }) => {
    const letters = word.split("");
    return (
      <HStack key={word} space={2} marginBottom={2}>
        {letters.map((letter, idx) => {
          let cardBg: ColorType = "gray.300";

          if (solution[idx] === letter) {
            cardBg = "green.300";
          } else if (solution.indexOf(letter) >= 0) {
            cardBg = "yellow.300";
          }

          return (
            <Center
              key={`Letter-${idx}`}
              w={16}
              h={16}
              borderRadius={4}
              bg={cardBg}
            >
              <Text style={styles.letterContent}>{letter}</Text>
            </Center>
          );
        })}
      </HStack>
    );
  };

  return (
    <>
      <HStack justifyContent="space-between">
        <Heading size="xl">Wordle</Heading>
        <Button
          variant="ghost"
          colorScheme="danger"
          onPress={restartGame}
          p={0}
        >
          RESTART
        </Button>
      </HStack>
      <Divider bg="gray.300" my={8} />
      <HStack space={2} marginBottom={4}>
        <Input
          ref={inputRef}
          size="2xl"
          w="100%"
          maxW="280px"
          value={inputValue}
          autoCorrect={false}
          onChangeText={handleInputField}
          onSubmitEditing={handleSubmit}
          isDisabled={submitDisabled}
        />
        <Button onPress={handleSubmit} disabled={submitDisabled}>
          SUBMIT
        </Button>
      </HStack>

      {intents.map((word, idx) => (
        <CardWord key={`Word-${idx}-${word}`} word={word} />
      ))}

      <StatusBar style="auto" />
    </>
  );
};

const styles = StyleSheet.create({
  letterContent: {
    fontSize: 32,
    textTransform: "uppercase",
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
  },
});

export default Wordle;
