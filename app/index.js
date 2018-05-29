// Checks if setup or not, and renders the corresponding component.

import React, { Component } from 'react'
import {
  AppRegistry,
  AsyncStorage,
  UIManager,
  Platform,
  View,
  Text
} from 'react-native'

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)

export default class PSCCompanion extends Component {
  constructor () {
    super()
    this.state = {setup: '?'}
  }

  componentDidMount () {
    var self = this
    AsyncStorage.getItem('tokens').then(function (data) {
      // If it exists we get a string back.
      self.setState({setup: (typeof data === 'string')})
    })
  }

  render () {
    return (
      <View>
        <Text>Active.</Text>
      </View>
    )
  }
}

//AppRegistry.registerHeadlessTask('UpdateTimetableService', () => require('./updateTimetableService.js'))
//AppRegistry.registerHeadlessTask('StudentNoticesService', () => require('./studentNoticesService.js'))
AppRegistry.registerComponent('PSCCompanion', () => PSCCompanion)
AppRegistry.runApplication('PSCCompanion', { rootTag: document.getElementById('root') })
