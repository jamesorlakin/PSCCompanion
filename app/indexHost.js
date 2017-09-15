// The component rendered when logged in. Provides react-navigation for all screens.

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { StackNavigator, DrawerNavigator, NavigationActions } from 'react-navigation';

import BannerAd from './adComponent.js'

import WelcomeScreen from './screens/welcome.js'
import DebugScreen from './screens/debug.js'
import FreeRoomScreen from './screens/freeroom.js'
import UserTimetableScreen from './screens/userTimetable.js'
import RoomTimetableScreen from './screens/roomTimetable.js'
import MapScreen from './screens/map.js'
import IntranetScreen from './screens/intranet.js'
import SettingsScreen from './screens/settings.js'

const Drawer = DrawerNavigator({
  welcome: {screen: WelcomeScreen},
  debug: {screen: DebugScreen},
  freeroom: {screen: FreeRoomScreen},
  userTimetable: {screen: UserTimetableScreen},
  roomTimetable: {screen: RoomTimetableScreen},
  map: {screen: MapScreen},
  intranet: {screen: IntranetScreen},
  settings: {screen: SettingsScreen},
})

const MenuButton = function (props) {
  return (
    <View>
      <TouchableOpacity onPress={() => {props.navigate('DrawerToggle')}}>
        <Text style={{color: 'blue', padding: 10, fontSize: 14}}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const DrawerHost = StackNavigator({
    Drawer: {screen: Drawer,
    navigationOptions: ({ navigation }) => ({
      title: 'PSC Companion',
      headerLeft: <MenuButton navigate={navigation.navigate} />,
    })
  }
})

const IndexHost = function (props) {
  return (
    <View style={styles.container}>
      <DrawerHost />
      <BannerAd />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

module.exports = IndexHost
