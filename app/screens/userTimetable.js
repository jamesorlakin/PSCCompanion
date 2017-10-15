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
      {key: "start", value: moment().startOf('day').startOf('week').add(this.state.week, 'weeks').unix()},
      {key: "end", value: moment().endOf('day').endOf('week').add(this.state.week, 'weeks').unix()}
    ]).then(function (data) {
      self.setState({loaded: true, data: data})
      AsyncStorage.getItem('sharedPinAndKey').then(function (asyncData) {
        if (asyncData !== null) {
          var pinAndKey = JSON.parse(asyncData);
          fetch("https://gateway.jameslakin.co.uk/psc/api/submit", {
            method: "POST",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
              publishKey: pinAndKey.publishKey,
              pin: pinAndKey.pin,
              startOfWeek: moment().startOf('day').startOf('isoweek').add(self.state.week, 'weeks').unix(),
              data: JSON.stringify(data)
            })
          }).then(function (req) {
            req.text()
          }).then(function (req) {
            console.log(req);
          })
        }
      })
    }).catch(function (error) {
      self.setState({error: error})
    })
  }

  switchWeek(week) {
    if (!this.state.loaded) return false
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
          <Text style={{marginTop: 6}}>Week commencing
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
