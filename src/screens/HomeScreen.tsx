import React, { useState, useEffect } from 'react';
import { Button, Alert, AppState, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';
import styled from 'styled-components/native';
import { db } from '../config';

import { ScreenComponent } from 'utils/interfaces';
import { stepsPerPoint } from 'res/constants';

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  align-items: center;
  justify-content: center;
`;

const LargeText = styled.Text`
  font-size: 48px;
`;

const MediumText = styled.Text`
  font-size: 36px;
`;

const HomeScreen: ScreenComponent = (props) => {
  const [steps, setSteps] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    let initialSteps = 0;
    let newSteps = 0;
    Pedometer.watchStepCount(({ steps }) => {
      setSteps(steps);
      newSteps = steps;
    });
    db.collection("users").doc("0k2VwKju0LkXZ1MACa8y").get().then((doc) => initialSteps = doc.data()!.steps);
    setInterval(() => db.collection("users").doc("0k2VwKju0LkXZ1MACa8y").update({steps: initialSteps + newSteps}), 10000);
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', state => setActive(state === 'active'));
    return () => AppState.removeEventListener('change', () => {});
  }, []);

  const handlePress = async () => {
    Alert.alert("Testing");
  };

  return (
    <Container>
      <LargeText>{steps} steps</LargeText>
      <LargeText>{Math.floor(steps / stepsPerPoint)} <MediumText>SafeCoins™</MediumText></LargeText>
      <Button title={'press me uwu'} onPress={handlePress} />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
