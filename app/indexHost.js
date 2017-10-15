// The component rendered when logged in. Provides react-navigation for all screens.

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { StackNavigator, DrawerNavigator, NavigationActions, DrawerItems } from 'react-navigation';

import BannerAd from './adComponent.js'

import WelcomeScreen from './screens/welcome.js'
import FreeRoomScreen from './screens/freeroom.js'
import UserTimetableScreen from './screens/userTimetable.js'
import RoomTimetableScreen from './screens/roomTimetable.js'
import SharedTimetableScreen from './screens/sharedTimetable.js'
import MapScreen from './screens/map.js'
import IntranetScreen from './screens/intranet.js'
import SettingsScreen from './screens/settings.js'

const Drawer = DrawerNavigator({
  welcome: {screen: WelcomeScreen},
  freeroom: {screen: FreeRoomScreen},
  userTimetable: {screen: UserTimetableScreen},
  roomTimetable: {screen: RoomTimetableScreen},
  sharedTimetable: {screen: SharedTimetableScreen},
  map: {screen: MapScreen},
  intranet: {screen: IntranetScreen},
  settings: {screen: SettingsScreen},
}, {
  contentComponent: props => (<ScrollView><DrawerItems {...props} /></ScrollView>),
  contentOptions: {
    activeTintColor: '#36648B',
    style: {
      marginVertical: 0,
    }
  }
})

const MenuButton = function (props) {
  return (
    <View>
      <TouchableOpacity onPress={() => {
        props.navigation.state.index === 1 ?
          props.navigation.navigate('DrawerClose')
          : props.navigation.navigate('DrawerOpen')}}
      >
      <Image source={require('./images/hamburgerIcon.png')}
        style={{
          width: 64,
          height: 64,
          marginLeft: 0,
          marginTop: 3
        }}/>
      </TouchableOpacity>
    </View>
  );
}

const DrawerHost = StackNavigator({
    Drawer: {screen: Drawer,
    navigationOptions: ({ navigation }) => ({
      title: 'PSC Companion',
      headerLeft: <MenuButton navigation={navigation} />,
      headerStyle: {
        backgroundColor: '#36648B'
      },
      headerTitleStyle: {
        color: '#FFFAFA',
        padding: 8
      }
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
