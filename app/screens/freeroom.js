/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import api from '../api.js';

export default class FreeRoomScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Free rooms'
  }

  constructor() {
    super();
    this.state = {rooms: false}
  }

  componentDidMount() {
    var self = this;
    api('find/freeroom').then(function (rooms) {
      self.setState({rooms: rooms});
    })
  }

  render() {
    if (this.state.rooms === false) return (
      <View style={styles.container}>
        <Text>Awaiting asynchronous fetch. In other words, hang fire as this will take a moment.</Text>
      </View>
    );

    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.rooms.map(function (item) {
            return (<Text key={item.Name}>{item.Name}</Text>)
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
