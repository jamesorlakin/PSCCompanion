import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  AsyncStorage,
  ScrollView,
  StyleSheet,
} from 'react-native';

import api from '../api.js'
import WhosFreeNow from '../whosFreeNowComponent.js'
import Summary from '../summaryComponent.js'
import StudentNoticesScreen from './notices.js'
import ExpoNoticeComponent from '../expoNoticeComponent.js'

export default class WelcomeScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Welcome'
  }

  constructor() {
    super();
    this.state = {
      loaded: false,
      data: null
    }
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('user').then(function (data) {
      if (typeof data === "string") self.setState({loaded: true, data: JSON.parse(data)})
      if (Math.floor(Math.random()*20) == 0 || typeof data !== "string") api('user').then(function (userInfo) {
        userInfo.fetchedTime = new Date();
        self.setState({loaded: true, data: userInfo});
        AsyncStorage.setItem('user', JSON.stringify(userInfo));
      })
    })
  }

  render() {
    if (this.state.loaded) {

      return (
        <ScrollView>
          <View style={styles.container}>
            <View style={{flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15
            }}>
              <Image source={require('../images/userIcon.png')} />
              <Text style={{fontSize: 20}}>Welcome, {this.state.data.Name}</Text>
            </View>

            <Summary/>

            <ExpoNoticeComponent/>

            <WhosFreeNow/>

            <StudentNoticesScreen welcome/>

            <Text style={{fontSize: 16}}>Note that this application is very new.
              Bugs are to be expected now and again, and please report any you find
              so that I can fix them. Suggestions are also welcome.</Text>
          </View>
        </ScrollView>
      )
    }

    return (
      <View/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8
  },
});
