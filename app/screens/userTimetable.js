import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  AsyncStorage,
  Button,
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
      week: 0,
      error: null
    }
    this.switchWeek = this.switchWeek.bind(this);
  }

  loadTimetable() {
    var self = this;
    api('timetable', [
      {key: "includeBlanks", value: "false"},
      {key: "start", value: moment().startOf('day').startOf('isoweek').add(this.state.week, 'weeks').unix()},
      {key: "end", value: moment().endOf('day').endOf('isoweek').add(this.state.week, 'weeks').unix()}
    ]).then(function (timetableData) {
      self.setState({loaded: true, data: timetableData})
    }).catch(function (error) {
      self.setState({error: error})
    })
  }

  switchWeek(week) {
    if (!this.state.loaded && this.state.error === null) return false
    var self = this;
    this.setState({loaded: false, week: this.state.week+week}, function () {
        self.loadTimetable();
    });
  }

  componentDidMount() {
    this.loadTimetable()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Button onPress={() => {this.switchWeek(-1)}}
            color="gray"
            style={{width: 50}}
            title="<" />
          <Text style={{marginTop: 6}}>Week Commencing
            {" "+ moment().startOf('isoweek').add(this.state.week, 'weeks').format('Do MMMM')}</Text>
          <Button onPress={() => {this.switchWeek(1)}}
            color="gray"
            style={{width: 50, backgroundColor: "black"}}
            title=">" />
        </View>
        {(this.state.loaded ? <Timetable data={this.state.data} week={this.state.week} /> : <ActivityIndicator />)}
        {(this.state.error && <Text>Error: {this.state.error.toString()}</Text>)}
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
