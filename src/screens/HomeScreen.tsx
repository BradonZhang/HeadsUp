import React, { useState, useEffect } from 'react';
import {Platform, StatusBar, AppState, StyleSheet, ActivityIndicator } from 'react-native';
import { Pedometer } from 'expo-sensors';
import styled from 'styled-components/native';
import { db } from '../config';
import {Overlay, Button, Header} from 'react-native-elements';
import Rewards from '../components/Rewards';

import { ScreenComponent } from 'utils/interfaces';
import { stepsPerPoint } from 'res/constants';

const Container = styled.View`
  flex: 1;
  background-color: lightblue;
  align-items: center;
  justify-content: center;
  margin-top: ${Platform.OS === 'android' ? StatusBar.currentHeight : 0}px;
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
  const [modalActive, setModalActive] = useState(false);

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

  const handlePress = () => {
    setModalActive(true);
  };

  return (
    <Container>
      <Header backgroundColor= "rgb(232, 255, 251)" containerStyle={{
        position: 'absolute',
        top: 0,
        width: '100%'
      }}/>
      <LargeText>{steps} steps</LargeText>
      <LargeText>{Math.floor(points)} <MediumText>SafeCoins™</MediumText></LargeText>
      <Button raised type="solid" title={'Redeem Rewards!'} onPress={handlePress} />
      <Overlay isVisible={modalActive} onBackdropPress={() => setModalActive(false)}>
        <Rewards/>
      </Overlay>
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
