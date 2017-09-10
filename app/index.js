// Checks if setup or not, and renders the corresponding component.

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  AsyncStorage,
  View
} from 'react-native';


import LoginScreen from './login.js';
import IndexHost from './indexHost.js';

export default class PSCCompanion extends Component {
  constructor() {
    super();
    this.state = {setup: '?'}
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('tokens').then(function (data) {
      // If it exists we get a string back.
      self.setState({setup: (typeof data == "string")})
    }).done()
  }

  render() {
    if (this.state.setup === '?') return (<Text>Checking token status...</Text>)
    if (this.state.setup) return (<IndexHost />)
    return (<LoginScreen />)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

});

AppRegistry.registerComponent('PSCCompanion', () => PSCCompanion);
