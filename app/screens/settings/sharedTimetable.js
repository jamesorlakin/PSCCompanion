import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';

export default class SettingSharedTimetable extends Component {
  constructor() {
    super();
    this.state = {
      enrolled: false,
      pinAndKey: {}
    }
    this.enroll = this.enroll.bind(this)
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('sharedPinAndKey').then(function (data) {
      if (data === null) {
        self.setState({enrolled: false})
      } else {
        self.setState({enrolled: true, pinAndKey: JSON.parse(data)})
      }
    })
    AsyncStorage.getItem('sharedSavedPins').then(function (data) {
      if (data !== null) {
        self.setState({savedPins: JSON.parse(data)})
      }
    })
  }

  enroll() {
    var self = this;
    AsyncStorage.getItem('user').then(function (userData) {
      console.log(userData);
      fetch("https://gateway.jameslakin.co.uk/psc/api/enroll", {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({fullName: JSON.parse(userData).Name})
      }).then(function (data) {
        return data.json();
      }).then(function (result) {
        AsyncStorage.setItem('sharedPinAndKey', JSON.stringify(result))
        self.setState({enrolled: true, pinAndKey: result})
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Timetable Sharing:</Text>
        <Text>You can choose to share your timetable with other users of PSC
          Companion using a randomly generated unique PIN. This feature is off
          by default, as it requires your timetable data to be stored externally
          in a database I host.</Text>
        {!this.state.enrolled && <Button onPress={this.enroll} title="Enroll" />}
        <Text>{JSON.stringify(this.state.pinAndKey)}</Text>
        {this.state.enrolled &&
          <Text style={{fontSize: 18}}>Your PIN is {this.state.pinAndKey.pin}</Text>}
        {this.state.enrolled && <SharedPinManager />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30
  },
});

class SharedPinManager extends Component {
  constructor() {
    super();
    this.state = {
      savedPins: [],
      newPin: null
    }
    this.removePin = this.removePin.bind(this)
    this.addPin = this.addPin.bind(this)
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('sharedSavedPins').then(function (data) {
      if (data !== null) {
        self.setState({savedPins: JSON.parse(data)})
      }
    })
  }

  addPin() {
    var pins = this.state.savedPins;
    pins.push(this.state.newPin);
    this.setState({savedPins: pins, newPin: null});
    AsyncStorage.setItem('sharedSavedPins', JSON.stringify(pins));
  }

  removePin(pin) {
    var pins = this.state.savedPins;
    pins.splice(pins.indexOf(pin), 1);
    this.setState({savedPins: pins});
    AsyncStorage.setItem('sharedSavedPins', JSON.stringify(pins));
  }

  render() {
    var self = this
    return (
      <View>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <TextInput
            placeholder="Enter a 6 digit pin"
            keyboardType="numeric"
            defaultValue={this.state.newPin}
            onChangeText={(pin) => {this.setState({newPin: pin})}}
            style={{flex: 2}} />
          <Button title="Add" onPress={this.addPin} style={{flex: 1}} />
        </View>

        {this.state.savedPins.map(function (pin) {
          return (
            <View key={pin} style={{flexDirection: "row", justifyContent: "space-between"}}>
              <Text>{pin}</Text>
              <Button title="Delet this" onPress={() => {self.removePin(pin)}} />
            </View>
          )
        })}
      </View>
    );
  }
}
