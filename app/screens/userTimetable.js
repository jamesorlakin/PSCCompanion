import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Picker,
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
      day: moment().startOf('day')
    }
    this.switchDay = this.switchDay.bind(this);
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

  switchDay(day, index) {
    this.setState({loaded: false, day: day});
    this.loadTimetable();
  }

  componentDidMount() {
    this.loadTimetable()
  }

  render() {
    if (this.state.loaded) return (
      <View style={styles.container}>
        <Picker onValueChange={this.switchDay}>
          <Picker.Item label="Today" value={moment().startOf('day')} />
          <Picker.Item label="Tomorrow" value={moment().startOf('day').add(1, "days")} />
          <Picker.Item label="The day after tomorrow" value={moment().startOf('day').add(2, "days")} />
          <Picker.Item label="The day after the day after tomorrow" value={moment().startOf('day').add(3, "days")} />
          <Picker.Item label="The day after the day after the day after tomorrow" value={moment().startOf('day').add(4, "days")} />
        </Picker>

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
    margin: 8
  },
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  },
  title: {
    fontSize: 17
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
      <Text>{moment.unix(data.item.Start).format('LT')} - {moment.unix(data.item.End).format('LT')} : {data.item.Room}</Text>
    </View>
  )
}
