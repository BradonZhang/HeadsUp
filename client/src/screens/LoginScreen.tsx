import React, { useState } from 'react';
import { Alert } from 'react-native';
import { functions } from 'res/firebase';
import styled from 'styled-components/native';

import { ScreenComponent } from 'utils/interfaces';
import CaptionedTextBox from 'components/CaptionedTextBox';
import LoadingModal from 'components/LoadingModal';
import { colors } from 'res/constants';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TitleText = styled.Text`
  font-size: 28px;
  color: white;
  margin-bottom: 10%;
  font-weight: bold;
  width: 100%;
  text-align: left;
`;

const Dialog = styled.View`
  width: 90%;
  height: 80%;
  border-radius: 12px;
  background-color: ${colors.foreground2};
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 10%;
`;

const HintTouchable = styled.TouchableOpacity`
  width: 100%;
`;

const HintText = styled.Text`
  font-size: 16px;
  color: black;
  width: 100%;
  text-align: left;
`;

const LinkText = styled.Text`
  color: ${colors.foreground1};
  font-weight: bold;
`;

const SubmitButton = styled.TouchableOpacity`
  width: 80%;
  background-color: ${colors.foreground1};
  border-radius: 20px;
  margin: 10%;
  padding: 2%;
  position: absolute;
  bottom: 0%;
`;

const SubmitText = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

const LoginScreen: ScreenComponent = (props) => {

  const [loadingVisible, setLoadingVisible] = useState(false);
  const [creatingNewAccount, setCreatingNewAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    setLoadingVisible(true);
    const login = functions.httpsCallable('login');
    try {
      const result = await login({email, password});
      if (result.data && result.data.error) {
        Alert.alert(result.data.error);
      } else {
        props.navigation.navigate('HomeScreen', {email});
      }
    } catch (err) {
      console.warn(err);
    }
    setLoadingVisible(false);
  };

  const handleCreateAccount = async () => {
    setLoadingVisible(true);
    const createAccount = functions.httpsCallable('createAccount');
    try {
      const result = await createAccount({email, password});
      if (result.data && result.data.error) {
        Alert.alert(result.data.error);
      } else {
        props.navigation.navigate('HomeScreen', {email});
      }
    } catch (err) {
      console.warn(err);
    }
    setLoadingVisible(false);
  };

  return (
    <Container>
      <LoadingModal visible={loadingVisible} />
      <Dialog>
        <TitleText>
          {creatingNewAccount ? 'Create account' : 'Log in'}
        </TitleText>
        <CaptionedTextBox
          type={'email'}
          caption={'Email Address'}
          value={email}
          onChangeText={setEmail}
        />
        <CaptionedTextBox
          type={'password'}
          caption={'Password'}
          value={password}
          onChangeText={setPassword}
        />
        <HintTouchable onPress={() => setCreatingNewAccount(state => !state)}>
          <HintText>
            {creatingNewAccount ? (
              `Already have an account? `
              ) : (
              `Don't have an account? `
            )}
            <LinkText>
              {creatingNewAccount ? (
                `Log in here.`
                ) : (
                `Create one!`
              )}
            </LinkText>
          </HintText>
        </HintTouchable>
        <SubmitButton
          onPress={creatingNewAccount ? handleCreateAccount : handleLogin}
        >
          <SubmitText>
            {creatingNewAccount ? 'Create Account' : 'Log In'}
          </SubmitText>
        </SubmitButton>
      </Dialog>
    </Container>
  );
};

export default LoginScreen;
