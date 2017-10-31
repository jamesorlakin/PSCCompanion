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

export default class WifiListScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      networks: [],
      storedNetworks: [],
      learning: false
    };
    this.scanWifi = this.scanWifi.bind(this)
    this.changeLocation = this.changeLocation.bind(this)
    this.addNetworks = this.addNetworks.bind(this)
  }

  componentDidMount() {
    this.timer = setInterval(this.scanWifi, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  scanWifi() {
    var self = this
    wifi.loadWifiList(function (networks) {
      networks = JSON.parse(networks)
      self.setState({networks: networks})
      self.addNetworks(networks);
    }, function (err) {
      console.log(err);
    })
  }

  addNetworks(networks) {
    if (!this.state.learning) return false
    var stored = this.state.storedNetworks;
    for (var i = 0; i < networks.length; i++) {
      if (stored.indexOf(networks[i].BSSID)===-1) {
        stored.push(networks[i].BSSID)
      }
    }
    this.setState({storedNetworks: stored});
  }

  changeLocation(index, value) {
    this.setState({location: value});
  }

  render() {
    var self = this;
    return (
      <View style={styles.container}>
        <Button title={"Learning? " + this.state.learning}
          onPress={() => {self.setState({learning: !self.state.learning})}} />
        <TextInput placeholder="Location" />
        <TextInput value={JSON.stringify(this.state.storedNetworks)} />
        <ScrollView>
          {this.state.networks.map(function (item) {
            return <Text key={item.BSSID}>{JSON.stringify(item)}</Text>
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16
  },
});
