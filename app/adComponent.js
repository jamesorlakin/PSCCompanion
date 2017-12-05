import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage
} from 'react-native';

import { AdMobBanner } from 'expo'

export default class BannerAd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      adFree: false,
      error: null
    }
    this.bannerError = this.bannerError.bind(this)
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

  bannerError(data) {
    this.setState({error: data})
  }

  render() {
    if (this.state.error) return (<View />)
    //if (this.state.error) return (<Text>{this.state.error}</Text>)

    if (!this.state.loaded) return (<View />)

    if (!this.state.adFree) return (
      <AdMobBanner
        bannerSize="fullBanner"
        adUnitID="ca-app-pub-7238065308394709/7865267604"
        testDeviceID="EMULATOR"
        didFailToReceiveAdWithError={this.bannerError} />
    )

    return (<View/>)
  }
}
