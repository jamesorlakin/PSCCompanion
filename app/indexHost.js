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
import FreeRoomScreen from './screens/freeroom.js'

const DrawerHost = DrawerNavigator({
        welcome: {screen: WelcomeScreen},
        debug: {screen: DebugScreen},
        freeroom: {screen: FreeRoomScreen}
      })


const IndexHost = StackNavigator({
        Drawer: {screen: DrawerHost,
        navigationOptions: {
          title: 'PSC Companion'
        }}
      })
module.exports = IndexHost
