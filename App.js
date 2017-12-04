import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Constants } from 'expo';

import PSCCompanion from './app/index.js';

export default class App extends React.Component {
  render() {
    return (
      <PSCCompanion style={{marginTop: Constants.statusBarHeight}} />
    );
  }
}
