import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import api from '../api.js'
import moment from 'moment';

export default class UserTimetableScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'My timetable'
  }

  constructor() {
    super();
    this.state = {
      loaded: false,
      data: null,
      day: new Date()
    }
  }

  loadTimetable() {
    var self = this;
    api('timetable', [
      {key: "includeBlanks", value: "true"},
      {key: "start", value: moment(this.state.day).startOf('day').unix()},
      {key: "end", value: moment(this.state.day).endOf('day').unix()}
    ]).then(function (data) {
      for (var i = 0; i < data.timetable.length; i++) {
        data.timetable[i].key = data.timetable[i].Start
      }
      self.setState({loaded: true, data: data})
    })
  }

  componentDidMount() {
    this.loadTimetable()
  }

  render() {
    if (this.state.loaded) return (
      <View style={styles.container}>
        <Text style={styles.title}>Today's timetable:</Text>
        <FlatList data={this.state.data.timetable} renderItem={eventElement} />
      </View>
    )

    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  },
  title: {
    fontSize: 15
  }
});

function eventElement(data) {
  if (data.item.Type === "studyperiod") return (
    <View>
      <Text style={styles.italic}>Free</Text>
      <Text>{moment.unix(data.item.Start).format('LT')}</Text>
    </View>
  )

  return (
    <View>
      <Text style={styles.bold}>{data.item.Title}</Text>
      <Text>{moment.unix(data.item.Start).format('LT')} - {data.item.Room}</Text>
    </View>
  )
}
