import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  AsyncStorage,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import api from '../api.js'
import WhosFreeNow from '../whosFreeNowComponent.js'
import Summary from '../summaryComponent.js'
import AttendanceScreen from './attendance.js'
import PrintingStatusComponent from '../printingStatusComponent.js'
import { commonStyles } from '../commonComponents.js'

export default class WelcomeScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Welcome'
  }

  constructor() {
    super();
    this.state = {
      loaded: false,
      data: {}
    }
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('user').then(function (data) {
      if (typeof data === "string") self.setState({loaded: true, data: JSON.parse(data)})
      if (Math.floor(Math.random()*100) == 0 || typeof data !== "string") api('user').then(function (userInfo) {
        userInfo.fetchedTime = new Date();
        self.setState({loaded: true, data: userInfo});
        AsyncStorage.setItem('user', JSON.stringify(userInfo));
      })
    })
  }

  render() {
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
              <Image source={require('../images/userIcon.png')} />
            </TouchableWithoutFeedback>
            <Text style={{fontSize: 20}}>Welcome, {this.state.data.Name || "user"}</Text>
          </View>

          <Summary/>

          <WhosFreeNow/>

          <AttendanceScreen welcome/>

          <PrintingStatusComponent/>

          <Text style={{fontSize: 16}}>Note that this application is very new.
            Bugs are to be expected now and again, and please report any you find
            so that I can fix them. Suggestions are also welcome.</Text>
        </View>
      </ScrollView>
    )
  }
}
