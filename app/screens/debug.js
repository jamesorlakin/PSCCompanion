/* @flow */

import React, { Component } from 'react';
import {
  View,
  TextInput,
  AsyncStorage,
  StyleSheet,
} from 'react-native';

export default class DebugScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Debug'
  }

  constructor() {
    super();
    this.state = {tokens: ['Loading...']};
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('tokens').then(function (value) {
      var state = []
      var tokens = JSON.parse(value);
      for (var thing in tokens) {
        if (tokens.hasOwnProperty(thing)) {
          state.push(thing + " - " + tokens[thing])
        }
      }

      self.setState({tokens: state});
    })
  }

  render() {
    var tokens = this.state.tokens;
    return (<View style={styles.container}>{tokens.map(function (item) {
      return (<TextInput key={tokens.indexOf(item)}>{item}</TextInput>)
    })}
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8
  },
});
