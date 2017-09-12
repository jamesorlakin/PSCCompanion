import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
} from 'react-native';

import api from '../api.js'

export default class WelcomeScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Welcome'
  }

  constructor() {
    super();
    this.state = {
      loaded: false,
      data: null
    }
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('user').then(function (data) {
      if (typeof data === "string") self.setState({loaded: true, data: JSON.parse(data)})
      if (Math.floor(Math.random()*10) == 0) api('user').then(function (userInfo) {
        userInfo.fetchedTime = new Date();
        self.setState({loaded: true, data: userInfo});
        AsyncStorage.setItem('user', JSON.stringify(userInfo));
      })
    })
  }

  render() {
    if (this.state.loaded) {
      return (
        <View style={styles.container}>
          <Text>{JSON.stringify(this.state.data)}</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Text>Welcome to PSC Companion!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8
  },
});
