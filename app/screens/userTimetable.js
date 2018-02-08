import React, { Component } from 'react'
import {
  View,
  Text,
  AsyncStorage,
  Button,
  StyleSheet,
  Image,
} from 'react-native'

import api from '../api.js'
import Timetable from '../timetableComponents/timetableHost.js'
import moment from 'moment'
import { Fetching, commonStyles } from '../commonComponents.js'
import localTimetableCache from '../timetableComponents/localTimetableCache.js'

export default class UserTimetableScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'My Timetable',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../images/menuIcons/userTimetable.png')}
        style={{width: 20, height: 20, tintColor: tintColor}}
      />
    )
  }

  constructor() {
    super();
    this.state = {
      loaded: false,
      data: null,
      week: 0,
      error: null
    }
    this.switchWeek = this.switchWeek.bind(this)
  }

  async loadTimetable() {
    try {
      var timetable = await api('timetable', [
        {key: "includeBlanks", value: "false"},
        {key: "start", value: moment().startOf('day').startOf('isoweek').add(this.state.week, 'weeks').unix()},
        {key: "end", value: moment().endOf('day').endOf('isoweek').add(this.state.week, 'weeks').unix()}
      ])
      this.setState({loaded: true, data: timetable})
    } catch (e) {
      var timetable = await localTimetableCache.getCache()
      this.setState({loaded: true, data: timetable, error: e})
    }
  }

  switchWeek(week) {
    if (!this.state.loaded && this.state.error === null) return false
    var self = this;
    this.setState({loaded: false, week: this.state.week+week}, function () {
        self.loadTimetable();
    })
  }

  componentDidMount() {
    this.loadTimetable()
  }

  render() {
    return (
      <View style={commonStyles.screenContainer}>
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
        {(this.state.error && <Text>Error fetching timetable:
          {' ' + this.state.error.toString()}. Using this week's cached copy!</Text>)}
        {(this.state.loaded ? <Timetable data={this.state.data} week={this.state.week} /> : <Fetching />)}
      </View>
    )

  }
}
