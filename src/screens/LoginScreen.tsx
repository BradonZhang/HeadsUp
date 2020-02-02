import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { ScreenComponent } from 'utils/interfaces';
import CaptionedTextBox from 'components/CaptionedTextBox';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Dialog = styled.View`
  width: 90%;
  height: 80%;
  border-radius: 4px;
  background-color: orange;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
`;

const LoginScreen: ScreenComponent = (props) => {
  const [creatingNewAccount, setCreatingNewAccount] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Dialog>
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
    </Dialog>
  );
};

export default LoginScreen;
