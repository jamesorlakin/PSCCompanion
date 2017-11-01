import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';

var wifi = require('react-native-android-wifi')

var macList = require('./macs.json')

export default class CurrentLocationComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: "Unknown"
    };
    this.scanWifi = this.scanWifi.bind(this)
  }

  componentDidMount() {
    this.timer = setInterval(this.scanWifi, 10000);
    this.scanWifi()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  scanWifi() {
    var self = this
    wifi.loadWifiList(function (networks) {
      networks = JSON.parse(networks)
      networks.sort(function (a, b) {
        if (a.level < b.level) return 1
        if (a.level > b.level) return -1
        return 0
      })
      if (networks.length === 0) return false

      var found = false;

      Object.keys(macList).forEach(function (location) {
        if (macList[location].indexOf(networks[0].BSSID)>-1) {
          self.setState({location: location})
          found = true;
        }
      })

      if (!found) self.setState({location: "Unknown"})

    }, function (err) {
      console.log(err);
    })
  }

  render() {
    var self = this;
    return (
      <View style={styles.container}>
        <Text>WiFi location: {this.state.location}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 2,
    borderWidth: 2,
    marginBottom: 10
  },
});
