/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class DebugScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Debug'
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>I'm the DebugScreen component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
