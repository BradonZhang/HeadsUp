import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import HomeScreen from 'screens/HomeScreen';
import LoginScreen from 'screens/LoginScreen';

const AppNavigator = createSwitchNavigator({
  HomeScreen: {
    screen: HomeScreen,
  },
  Login: {
    screen: LoginScreen,
  }
}, {
  initialRouteName: 'HomeScreen'
});

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
