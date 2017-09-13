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
