// The component rendered when logged in. Provides react-navigation for all screens.

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { StackNavigator, DrawerNavigator } from 'react-navigation';

import WelcomeScreen from './screens/welcome.js'
import DebugScreen from './screens/debug.js'

const DrawerHost = DrawerNavigator({
        welcome: {screen: WelcomeScreen},
        debug: {screen: DebugScreen}
      })


const IndexHost = StackNavigator({
        Drawer: {screen: DrawerHost,
        navigationOptions: {
          title: 'PSC Companion'
        }}
      })
module.exports = IndexHost
