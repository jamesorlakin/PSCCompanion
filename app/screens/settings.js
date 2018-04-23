import React, { Component } from 'react'
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native'

import { commonStyles } from '../commonComponents.js'
import DebugScreen from './debug.js'

import SettingsCredentials from './settings/credentials.js'
import SettingsAdFree from './settings/adFree.js'
import SettingsSharedTimetable from './settings/sharedTimetable.js'
import SettingsResetTokens from './settings/resetTokens.js'

export default class SettingsScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Settings',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../images/menuIcons/settings.png')}
        style={{width: 20, height: 20, tintColor: tintColor}}
      />
    )
  }

  render () {
    return (
      <View style={commonStyles.screenContainer}>
        <ScrollView>
          <SettingsResetTokens />
          <SettingsCredentials />
          <SettingsAdFree />
          <SettingsSharedTimetable />
          <Text>Privacy Policy:</Text>
          <Text>PSC Companion does not transmit personal data to any servers outside of college (unless you have enrolled into timetable sharing).
          Advertising (AdMob) is used in this application, however it may be switched off in the settings menu.
          Credentials for the college account are not stored on the app by default, unless you have activated
          the intranet auto login feature. This application requires the Phone State permission due the framework
          which this app is built on. It does not make use of phone functionality.

          In addition, Flurry analytics is now used to see anonymised app usage statistics.</Text>
          <Text>About:</Text>
          <Text>PSC Companion Alpha, an app by James Lakin.</Text>
          {__DEV__ && <DebugScreen />}
        </ScrollView>
      </View>
    )
  }
}
