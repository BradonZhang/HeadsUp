import React, { FunctionComponent, memo } from 'react';
import { Dimensions, Modal, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { colors } from 'res/constants';

const modalSize = Dimensions.get('window').width / 2;

interface LoadingModalProps {
  visible?: boolean;
}

const ActivityIndicatorContainer = styled.View`
  width: 100%;
  height: 100%;
  background-color: #0008;
  justify-content: center;
  align-items: center;
`;

const LoadingModal: FunctionComponent<LoadingModalProps> = (props) => {
  return (
    <Modal visible={props.visible} transparent>
      <ActivityIndicatorContainer>
        <ActivityIndicator size={modalSize / 2} color={colors.foreground1} />
      </ActivityIndicatorContainer>
    </Modal>
  );
};

export default LoadingModal;
