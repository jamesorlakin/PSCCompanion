import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  ScrollView,
} from 'react-native';

import SettingsCredentials from './settings/credentials.js'
import SettingsAdFree from './settings/adFree.js'

export default class SettingsScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Settings'
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <SettingsCredentials/>
          <SettingsAdFree/>
          <Text>Privacy Policy:</Text>
          <Text>PSC Companion does not transmit personal data to any servers outside of college.
          Advertising (AdMob) is used in this application, however it may be switched off in the settings menu.
          Credentials for the college account are not stored on the app by default, unless you have activated
          the intranet auto login feature. This application requires the Phone State permission due the framework
          which this app is built on, it does not make use of phone functionality.</Text>
          <Text>About:</Text>
          <Text>Version 0.12 Alpha, by James Lakin.</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
});
