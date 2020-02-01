import React, { useEffect, useState } from 'react';
import { Alert, AppState, StyleSheet, Button, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import styled from 'styled-components/native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Battery from 'expo-battery';
import * as IntentLauncher from 'expo-intent-launcher';

import { stepsPerPoint } from 'res/constants';

const LargeText = styled.Text`
  font-size: 48px;
`;

const MediumText = styled.Text`
  font-size: 36px;
`;

// let steps = 0;
TaskManager.defineTask('countSteps', () => {
  if (AppState.currentState === 'active') {
    console.log('activity');
  } else {
    console.log('loggers?');
    Alert.alert('oh no you are not on the app');
  }
});

export default function App() {
  const [steps, setSteps] = useState(0);
  const [active, setActive] = useState(true);

  // useEffect(() => {
  //   setInterval(() => {
  //     Battery.getBatteryLevelAsync()
  //       .then(batteryLevel => setBatteryLevel(Math.round(100 * batteryLevel)));
  //   }, 1000);
  // });

  useEffect(() => {
    BackgroundFetch.registerTaskAsync('countSteps', {
      stopOnTerminate: false,
      startOnBoot: true,
    });
    Pedometer.watchStepCount(({ steps }) => {
      setSteps(steps);
    });
    // setInterval(() => {
    //     .then(res => console.log(res));
    // }, 1000);
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', state => setActive(state === 'active'));
    return () => AppState.removeEventListener('change', () => {});
  }, []);

  const handlePress = () => {
    Alert.alert(`rahul's wish is my command`);
  };

  return (
    <View style={styles.container}>
      <LargeText>{steps} steps</LargeText>
      <LargeText>{Math.floor(steps / stepsPerPoint)} <MediumText>SafeCoins™</MediumText></LargeText>
      <Button title={'press me uwu'} onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
