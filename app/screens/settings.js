import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';

import SettingsCredentials from './settings/credentials.js'

export default class SettingsScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Settings'
  }

  render() {
    return (
      <View style={styles.container}>
        <SettingsCredentials/>
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
