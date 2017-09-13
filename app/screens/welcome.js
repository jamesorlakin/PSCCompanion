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
      if (Math.floor(Math.random()*10) == 0 || typeof data !== "string") api('user').then(function (userInfo) {
        userInfo.fetchedTime = new Date();
        self.setState({loaded: true, data: userInfo});
        AsyncStorage.setItem('user', JSON.stringify(userInfo));
      })
    })
  }

  render() {
    if (this.state.loaded) {
      var rows = [];
      var data = this.state.data;
      Object.keys(data).forEach(function (key) {
        rows.push(<Text key={key}>{key} - {data[key].toString()}</Text>)
      })

      return (
        <View style={styles.container}>
          <Text style={{fontSize: 18}}>Welcome to PSC Companion, {this.state.data.Name}.</Text>
          {rows}
        </View>
      )
    }

    return (
      <View/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8
  },
});
