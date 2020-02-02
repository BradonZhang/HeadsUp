import React, { FunctionComponent, memo } from 'react';
import styled from 'styled-components/native';

interface CaptionedTextBoxProps {
  caption: string;
  value: string;
  type: 'email' | 'password';
  onChangeText: (text: string) => any;
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`;

const Caption = styled.Text`
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin: 2px;
`;

const TextInput = styled.TextInput`
  width: 100%;
  border: 1px solid black;
  border-radius: 2px;
  background-color: white;
  margin: 2px;
`;

const CaptionedTextBox: FunctionComponent<CaptionedTextBoxProps> = (props) => {

  const { caption, value, type, onChangeText } = props;

  return (
    <Container>
      <Caption>{caption}</Caption>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        autoCompleteType={type}
        secureTextEntry={type === 'password'}
        textContentType={type === 'email' ? 'emailAddress' : type}
      />
    </Container>
  );
};

export default memo(CaptionedTextBox);
