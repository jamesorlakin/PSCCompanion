// The component rendered when logged in. Provides react-navigation for all screens.

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { StackNavigator, DrawerNavigator, NavigationActions, DrawerItems } from 'react-navigation';

import BannerAd from './adComponent.js'

import WelcomeScreen from './screens/welcome.js'
//import DebugScreen from './screens/debug.js'
import FreeRoomScreen from './screens/freeroom.js'
import UserTimetableScreen from './screens/userTimetable.js'
import RoomTimetableScreen from './screens/roomTimetable.js'
import SharedTimetableScreen from './screens/sharedTimetable.js'
import MapScreen from './screens/map.js'
import IntranetScreen from './screens/intranet.js'
import SettingsScreen from './screens/settings.js'

const Drawer = DrawerNavigator({
  welcome: {screen: WelcomeScreen},
//  debug: {screen: DebugScreen},
  freeroom: {screen: FreeRoomScreen},
  userTimetable: {screen: UserTimetableScreen},
  roomTimetable: {screen: RoomTimetableScreen},
  sharedTimetable: {screen: SharedTimetableScreen},
  map: {screen: MapScreen},
  intranet: {screen: IntranetScreen},
  settings: {screen: SettingsScreen},
}, {
  contentComponent: props => (<ScrollView><DrawerItems {...props} /></ScrollView>)
})

const MenuButton = function (props) {
  if (props.navigation.state.index === 1) return (
      <View>
        <TouchableOpacity onPress={() => {props.navigation.navigate('DrawerClose')}}>
          <Text style={{color: 'red', padding: 10, fontSize: 14}}>Close</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View>
      <TouchableOpacity onPress={() => {props.navigation.navigate('DrawerOpen')}}>
        <Text style={{color: 'blue', padding: 10, fontSize: 14}}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

const DrawerHost = StackNavigator({
    Drawer: {screen: Drawer,
    navigationOptions: ({ navigation }) => ({
      title: 'PSC Companion',
      headerLeft: <MenuButton navigation={navigation} />,
    })
  }
})

const IndexHost = function (props) {
  return (
    <View style={styles.container}>
      <DrawerHost />
      {__DEV__ ? <Text>Debug Copy</Text> : <BannerAd />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

module.exports = IndexHost
