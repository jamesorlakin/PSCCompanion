import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Picker,
  Button,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import api from '../api.js';
import moment from 'moment';
import randomColor from 'randomcolor';

export default class FreeRoomScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Free Rooms'
  }

  // I've added 5 minutes to each period to ensure we're not on a boundary.
  periodTimes = [
    moment(),
    moment().hour(8).minute(35),
    moment().hour(9).minute(30),
    moment().hour(10).minute(25),
    moment().hour(10).minute(45),
    moment().hour(11).minute(40),
    moment().hour(12).minute(35),
    moment().hour(13).minute(5),
    moment().hour(13).minute(55),
    moment().hour(14).minute(50),
    moment().hour(15).minute(45)
  ]

  constructor() {
    super();
    this.state = {
      rooms: false,
      period: 0
    }
    this.changePeriod = this.changePeriod.bind(this)
    this.loadRooms = this.loadRooms.bind(this)
  }

  componentDidMount() {
    this.loadRooms()
  }

  loadRooms() {
    var self = this;
    api('find/freeroom', [
      {key: "start", value: this.periodTimes[this.state.period].unix()+1},
      {key: "end", value: this.periodTimes[this.state.period].unix()+300}
    ]).then(function (rooms) {
      for (var i = 0; i < rooms.length; i++) {
        rooms[i].key = rooms[i].Name
      }
      rooms = rooms.filter(function (item) {
        if (item.Site === "ACE" || !item.Timetable) return false;
        return true;
      })
      self.setState({rooms: rooms});
    }).catch(function (error) {
      self.setState({
        rooms: [{Name: "Error - " + error}]
      })
    })
  }

  changePeriod(index, value) {
    var self = this;
    console.log(moment.unix(this.periodTimes[value]).toString());
    this.setState({rooms: false, period: value}, function () {
      self.loadRooms()
    })
  }

  render() {
    if (this.state.rooms === false) return (
      <View style={styles.container, {alignItems: 'center'}}>
        <Text>This may take some time to load.</Text>
        <ActivityIndicator />
      </View>
    );

    return (
      <View style={styles.container}>
        <Picker selectedValue={this.state.period}
          onValueChange={this.changePeriod}
          mode="dropdown">
          <Picker.Item label={"Now - " + this.periodTimes[0].format('HH:mm')} value={0} />
          <Picker.Item label="Lesson 1 - 8:30 - 9:25" value={1} />
          <Picker.Item label="Lesson 2 - 9:25 - 10:20" value={2} />
          <Picker.Item label="Break - 10:20 - 10:40" value={3} />
          <Picker.Item label="Lesson 3 - 10:40 - 11:35" value={4} />
          <Picker.Item label="Lesson 4 - 11:35 - 12:30" value={5} />
          <Picker.Item label="Tutor - 12:30 - 13:00" value={6} />
          <Picker.Item label="Lunch - 13:00 - 13:50" value={7} />
          <Picker.Item label="Lesson 6 - 13:50 - 14:45" value={8} />
          <Picker.Item label="Lesson 7 - 14:45 - 15:40" value={9} />
          <Picker.Item label="Lesson 8 - 15:40 - 16:35" value={10} />
        </Picker>
        <FlatList data={this.state.rooms} renderItem={({item}) => <Room item={item} />} />
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

class Room extends Component {
  constructor() {
    super()
    this.state = {
      expanded: true
    }
    this.toggleExpansion = this.toggleExpansion.bind(this)
  }

  toggleExpansion() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    return (
      <View>
        <View style={{height: 2, backgroundColor: 'gray'}} />
        <View style={{flexDirection: 'row'}}>
          <View style={{
            margin: 2,
            width: 2,
            backgroundColor: randomColor({seed: this.props.item.Building})
          }} />
          <View>
            <Text style={styles.bold}>{this.props.item.Name}</Text>
            <Text>{this.props.item.Building} - {this.props.item.Description}</Text>
            <Text>Type: {this.props.item.Type}</Text>
          </View>
        </View>
      </View>
    )
  }
}
