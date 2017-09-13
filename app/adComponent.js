/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage
} from 'react-native';

import { AdMobBanner } from 'react-native-admob'

export default class BannerAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      adFree: false
    };
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('adFree').then(function (data) {
      var adFree = false;
      (data === "true" ? adFree = true : adFree = false)
      self.setState({
        loaded: true,
        adFree: adFree
      })
    })
  }

  render() {
    if (!this.state.loaded) return (
        <Text>Advertising</Text>
    );

    if (!this.state.adFree) return (
      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-7238065308394709/8039373135"
        testDeviceID="EMULATOR" />
    );

    return (<View/>)
  }
}
