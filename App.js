import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { Constants } from 'expo';

import PSCCompanion from './app/index.js';

export default class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"/>
        <PSCCompanion style={{marginTop: Constants.statusBarHeight}} />
      </View>
    );
  }
}
