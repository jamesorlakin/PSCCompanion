// Checks if setup or not, and renders the corresponding component.

import React, { Component } from 'react'
import {
  AppRegistry,
  AsyncStorage,
  UIManager,
  Platform
} from 'react-native'

import IndexHost from './indexHost.js'
import Intro from './screens/login/intro.js'

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
    if (this.state.setup === '?') return null
    if (this.state.setup) return (<IndexHost />)
    return (<Intro />)
  }
}

AppRegistry.registerComponent('PSCCompanion', () => PSCCompanion)

if (Platform.OS === 'web') {
  AppRegistry.runApplication('PSCCompanion', { rootTag: document.getElementById('root') })

  // We polyfill fetch to route through a CORS proxy.
  window.fetchOld = window.fetch
  window.fetch = function (url, opts) {
    if (url.includes('bundle')) return window.fetchOld(url, opts)
    return window.fetchOld('https://cryptic-plateau-65772.herokuapp.com/' + url, opts)
  }
} else {
  AppRegistry.registerHeadlessTask('UpdateTimetableService', () => require('./updateTimetableService.js'))
  AppRegistry.registerHeadlessTask('StudentNoticesService', () => require('./studentNoticesService.js'))
}
