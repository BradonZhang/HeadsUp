import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import HomeScreen from 'screens/HomeScreen';
import LoginScreen from 'screens/LoginScreen';

console.disableYellowBox = true;

const AppNavigator = createSwitchNavigator({
  LoginScreen: {
    screen: LoginScreen,
  },
  HomeScreen: {
    screen: HomeScreen,
  },
}, {
  initialRouteName: 'LoginScreen',
  // initialRouteName: 'HomeScreen',
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
