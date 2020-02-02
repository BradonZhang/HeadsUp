import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, AppState, StyleSheet, Image, Dimensions } from 'react-native';
import { Overlay, Button, Header } from 'react-native-elements';
import { Pedometer } from 'expo-sensors';
import styled from 'styled-components/native';

import Rewards from 'components/Rewards';
import { db } from 'res/firebase';
import { stepsPerPoint, colors } from 'res/constants';
import { ScreenComponent } from 'utils/interfaces';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const imageWidth = screenWidth * 0.8;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.background};
  align-items: center;
  justify-content: center;
  margin-top: ${Platform.OS === 'android' ? StatusBar.currentHeight : 0}px;
`;

const ImageContainer = styled.View`
  position: absolute;
  top: 0px;
  justify-content: center;
  align-items: center;
  width: ${screenWidth}px;
`;

const MegaText = styled.Text`
  font-size: 72px;
  font-weight: bold;
`;

const LargeText = styled.Text`
  font-size: 48px;
`;

const MediumText = styled.Text`
  font-size: 36px;
`;

const ButtonContainer = styled.View`
  transform: translateY(${screenHeight * 0.1}px);
`;

const HomeScreen: ScreenComponent = (props) => {
  const email: string = props.navigation.getParam('email');

  let _subscription: Pedometer.PedometerListener | null = null;
  const [steps, setSteps] = useState(0);
  const [points, setPoints] = useState(0);
  const [active, setActive] = useState(true);
  const [modalActive, setModalActive] = useState(false);

  useEffect(() => {
    let initialSteps = 0;
    let initialPoints = 0;
    let newSteps = 0;
    _subscription = Pedometer.watchStepCount(({ steps }) => {
      setSteps(initialSteps + steps);
      newSteps = steps;
    });
    db.collection('users').doc(email).get().then((doc) => {
      initialSteps = doc.data()!.steps;
      initialPoints = doc.data()!.points;
    });
    setInterval(async () => {
      await db.collection('users').doc(email).update({
        steps: initialSteps + newSteps,
        points: initialPoints + newSteps / stepsPerPoint
      });
      const doc = await db.collection('users').doc(email).get();
      const points = doc.data()!.points;
      setPoints(points);

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
      <ImageContainer>
        <Image
          source={require('assets/logo.png')}
          style={{width: imageWidth}}
          resizeMode={'contain'}
        />
      </ImageContainer>
      <MediumText>{steps} steps</MediumText>
      <MegaText>{Math.floor(points)}
        <MediumText> point{Math.floor(points) !== 1 && 's'}</MediumText>
      </MegaText>
      <ButtonContainer>
        <Button raised type={'solid'} title={'Redeem Rewards!'} onPress={handlePress} />
      </ButtonContainer>
      <Overlay isVisible={modalActive} onBackdropPress={() => setModalActive(false)}>
        <Rewards email={email} />
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
