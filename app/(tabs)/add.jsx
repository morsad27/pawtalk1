import { View, Text } from 'react-native';
import React from 'react';
import { useEffect } from "react";
import { setStatusBarStyle } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Add() {

  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle("dark"); //Testing
    }, 0);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
      <Text>Content is in safe area.</Text>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}