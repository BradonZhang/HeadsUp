import { FunctionComponent } from 'react';
import { NavigationScreenProp } from 'react-navigation';

export interface ScreenProps {
  navigation: NavigationScreenProp<any>;
};

export type ScreenComponent = FunctionComponent<ScreenProps>;
