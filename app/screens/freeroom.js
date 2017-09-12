import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
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
      for (var i = 0; i < rooms.length; i++) {
        rooms[i].key = rooms[i].Name
      }
      rooms = rooms.filter(function (item) {
        if (item.Site === "AHED") return false;
        return true;
      })
      self.setState({rooms: rooms});
    }).catch(function (error) {
      self.setState({
        rooms: [{Name: "Error - " + error}]
      })
    })
  }

  render() {
    if (this.state.rooms === false) return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Rooms currently timetabled to be free:</Text>
        <FlatList data={this.state.rooms} renderItem={roomComponent} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8
  },
  bold: {
    fontWeight: 'bold'
  },
  title: {
    fontSize: 17
  }
});

function roomComponent(data) {
  return (
    <View>
      <Text style={styles.bold}>{data.item.Name}</Text>
      <Text>{data.item.Building} - {data.item.Description}</Text>
    </View>
  )
}
