import React, { useState, useEffect } from 'react';
import { Button, Alert, AppState, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';
import styled from 'styled-components/native';
import { db } from '../res/firebase';

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
  let _subscription: Pedometer.PedometerListener | null = null;
  const [steps, setSteps] = useState(0);
  const [points, setPoints] = useState(0);
  const [active, setActive] = useState(true);

  useEffect(() => {
    let initialSteps = 0;
    let newSteps = 0;
    _subscription = Pedometer.watchStepCount(({ steps }) => {
      setSteps(steps);
      newSteps = steps;
    });
    db.collection("users").doc("0k2VwKju0LkXZ1MACa8y").get().then((doc) => initialSteps = doc.data()!.steps);
    setInterval(() => {
      db.collection("users").doc("0k2VwKju0LkXZ1MACa8y").update({steps: initialSteps + newSteps});
      db.collection("users").doc("0k2VwKju0LkXZ1MACa8y").get().then((doc) => setPoints(doc.data()!.steps/stepsPerPoint));
      if (!_subscription && active) {
        _subscription = Pedometer.watchStepCount(({ steps }) => {
          setSteps(steps);
          newSteps = steps;
        });
      }
      if (_subscription && !active) {
        _subscription.remove();
        _subscription = null;
      }
    }, 10000);
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', state => setActive(state === 'active'));
    return () => AppState.removeEventListener('change', () => {_subscription && _subscription.remove();});
  }, []);

  const handlePress = async () => {
    Alert.alert("Testing");
  };

  return (
    <Container>
      <LargeText>{steps} steps</LargeText>
      <LargeText>{Math.floor(points)} <MediumText>SafeCoins</MediumText></LargeText>
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
