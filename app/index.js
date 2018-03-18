// Checks if setup or not, and renders the corresponding component.

import React, { Component } from 'react'
import {
  AsyncStorage,
} from 'react-native'


import IndexHost from './indexHost.js'
import Intro from './screens/login/intro.js'

export default class PSCCompanion extends Component {
  constructor() {
    super()
    this.state = {setup: '?'}
  }

  componentDidMount() {
    var self = this
    AsyncStorage.getItem('tokens').then(function (data) {
      // If it exists we get a string back.
      self.setState({setup: (typeof data === "string")})
    }).done()
  }

  render() {
    if (this.state.setup === '?') return null
    if (this.state.setup) return (<IndexHost />)
    return (<Intro />)
  }
}

//AppRegistry.registerHeadlessTask('UpdateTimetableService', () => require('./updateTimetableService.js'))
//AppRegistry.registerComponent('PSCCompanion', () => PSCCompanion)
