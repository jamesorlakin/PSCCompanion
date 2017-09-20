import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Picker,
  StyleSheet,
} from 'react-native';

import api from '../api.js';
import Timetable from '../timetableComponents/timetableHost.js';
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
      week: 0
    }
    this.switchWeek = this.switchWeek.bind(this);
  }

  loadTimetable() {
    var self = this;
    api('timetable', [
      {key: "includeBlanks", value: "false"},
      {key: "start", value: moment(this.state.day).startOf('day').startOf('week').add(this.state.week, 'weeks').unix()},
      {key: "end", value: moment(this.state.day).endOf('day').endOf('week').add(this.state.week, 'weeks').unix()}
    ]).then(function (data) {
      self.setState({loaded: true, data: data})
    })
  }

  switchWeek(week, index) {
    var self = this;
    this.setState({loaded: false, week: week}, function () {
        self.loadTimetable();
    });
  }

  componentDidMount() {
    this.loadTimetable()
  }

  render() {
    return (
      <View style={styles.container}>
        <Picker selectedValue={this.state.week} mode="dropdown" onValueChange={this.switchWeek}>
          <Picker.Item label="This week" value={0} />
          <Picker.Item label="Next week" value={1} />
          <Picker.Item label="Next next week" value={2} />
        </Picker>
        {(this.state.loaded ? <Timetable data={this.state.data} week={this.state.week} /> : <ActivityIndicator />)}
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
