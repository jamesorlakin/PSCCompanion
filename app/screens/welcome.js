import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  AsyncStorage,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'

import api from '../api.js'
import WhosFreeNow from '../whosFreeNowComponent.js'
import Summary from '../summaryComponent.js'
import AttendanceScreen from './attendance.js'
import PrintingStatusComponent from '../printingStatusComponent.js'
import { commonStyles } from '../commonComponents.js'

export default class WelcomeScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Welcome',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../images/menuIcons/welcome.png')}
        style={{width: 20, height: 20, tintColor: tintColor}}
      />
    )
  }

  constructor () {
    super()
    this.state = {
      loaded: false,
      data: {}
    }
  }

  componentDidMount () {
    var self = this
    AsyncStorage.getItem('user').then(function (data) {
      if (typeof data === 'string') self.setState({loaded: true, data: JSON.parse(data)})
      if (Math.floor(Math.random() * 100) === 0 || typeof data !== 'string') {
        api('user').then(function (userInfo) {
          userInfo.fetchedTime = new Date()
          self.setState({loaded: true, data: userInfo})
          AsyncStorage.setItem('user', JSON.stringify(userInfo))
        })
      }
    })
  }

  render () {
    return (
      <ScrollView>
        <View style={commonStyles.screenContainer}>
          <View style={{flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 15
          }}>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('grime')}>
              <Image style={{width: 100, height: 100}} source={require('../images/userIcon.png')} />
            </TouchableWithoutFeedback>
            <Text style={{fontSize: 20}}>Welcome, {this.state.data.Name || 'user'}</Text>
          </View>

          <Summary />

          <WhosFreeNow />

          <AttendanceScreen />

          <PrintingStatusComponent />

          <Text style={{fontSize: 24}}>All good things come to an end, I suppose.</Text>
          <Text style={{fontSize: 16}}>I've now left college, but I'm not going to completely abandon this app.
            However, as you might imagine, testing any functionality requires a working account which I will soon
            no longer have access to. I therefore will be hesitant to make large changes.</Text>
          <Text style={{fontSize: 16}}>If you're capable (or at the very least interested) in helping to maintain or further develop this app, I more than welcome you to email me.
            It's been a good run and I'm fairly proud of how it's ended up, spare the buggy intranet and printing bits. Take a look in the About page for source code links.</Text>
        </View>
      </ScrollView>
    )
  }
}
