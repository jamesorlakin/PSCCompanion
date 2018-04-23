import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image
} from 'react-native'

import api from '../api.js'
import Timetable from '../timetableComponents/timetableHost.js'
import moment from 'moment'
import { Fetching, commonStyles } from '../commonComponents.js'

export default class RoomTimetableScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Room Timetable',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../images/menuIcons/roomTimetable.png')}
        style={{width: 20, height: 20, tintColor: tintColor}}
      />
    )
  }

  constructor () {
    super()
    this.state = {
      loaded: false,
      submitted: false,
      data: null,
      room: null,
      error: null
    }
    this.switchRoom = this.switchRoom.bind(this)
    this.loadTimetable = this.loadTimetable.bind(this)
  }

  loadTimetable () {
    this.setState({submitted: true, loaded: false})
    var self = this
    api('roomtimetable/' + this.state.room, [
      {key: 'includeBlanks', value: 'true'},
      {key: 'start', value: moment(this.state.day).startOf('day').startOf('isoweek').unix()},
      {key: 'end', value: moment(this.state.day).endOf('day').endOf('isoweek').unix()}
    ]).then(function (data) {
      self.setState({loaded: true, data: data})
    }).catch(function (error) {
      self.setState({error: error})
    })
  }

  switchRoom (room) {
    console.log(room)
    this.setState({room: room})
  }

  render () {
    return (
      <View style={commonStyles.screenContainer}>
        <Text>Enter a room identifier: </Text>
        <TextInput onSubmitEditing={this.loadTimetable}
          placeholder='e.g VY101'
          onChangeText={this.switchRoom} />
        {(this.state.loaded
          ? (typeof this.state.data.error === 'string'
            ? <Text>Error: {this.state.data.error}</Text>
            : <Timetable data={this.state.data} />)
          : (this.state.submitted && <Fetching />))}
        {(this.state.error && <Text>Error: {this.state.error.toString()}</Text>)}
      </View>
    )
  }
}
