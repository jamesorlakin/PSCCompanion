import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Picker,
  StyleSheet,
} from 'react-native';

import api from '../api.js';
import Timetable from '../timetableComponent.js';
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
      {key: "start", value: moment(this.state.day).startOf('day').startOf('week').unix()},
      {key: "end", value: moment(this.state.day).endOf('day').endOf('week').unix()}
    ]).then(function (data) {
      self.setState({loaded: true, data: data})
    })
  }

  switchDay(day, index) {
    var self = this;
    this.setState({loaded: false, day: day}, function () {
        self.loadTimetable();
    });
  }

  componentDidMount() {
    this.loadTimetable()
  }

  render() {
    return (
      <View style={styles.container}>
        {(this.state.loaded ? <Timetable data={this.state.data} /> : <ActivityIndicator />)}
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8
  },
});
