import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  Button,
  ActivityIndicator,
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
          in a database I host. At this moment in time you cannot "un-enroll".</Text>
        {!this.state.enrolled && <Button onPress={this.enroll} title="Enroll" />}
        {this.state.enrolled &&
          <Text style={{fontSize: 18}}>Your PIN is {this.state.pinAndKey.pin}.</Text>}
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
      newPin: null,
      adding: false,
      error: null
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
    var self = this;

    if (this.state.newPin === "") {
      this.setState({error: "Enter a PIN."})
      return false;
    }

    for (var i = 0; i < this.state.savedPins.length; i++) {
      if (self.state.newPin === self.state.savedPins[i].pin) {
        self.setState({error: "Pin " + self.state.newPin + " already exists."})
        return false;
      }
    }

    self.setState({adding: true});
    fetch("https://gateway.jameslakin.co.uk/psc/api/lookup/" + this.state.newPin).then(function (data) {
      return data.json()
    }).then(function (result) {
      var pins = self.state.savedPins;
      pins.push({pin: self.state.newPin, name: result.fullName});
      self.setState({savedPins: pins, newPin: null});
      AsyncStorage.setItem('sharedSavedPins', JSON.stringify(pins));
      self.setState({adding: false});
    }).catch(function (error) {
      self.setState({error: "No person found for pin " + self.state.newPin});
      self.setState({adding: false});
    })
  }

  removePin(pin) {
    var pins = this.state.savedPins;
    pins.splice(pins.indexOf(pin), 1);
    this.setState({savedPins: pins});
    AsyncStorage.setItem('sharedSavedPins', JSON.stringify(pins));
  }

  render() {
    var self = this;
    return (
      <View>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <TextInput
            placeholder="Enter a 6 digit PIN"
            keyboardType="numeric"
            defaultValue={this.state.newPin}
            onChangeText={(pin) => {this.setState({newPin: pin})}}
            style={{flex: 2}} />
          <Button title="Add" onPress={this.addPin} style={{flex: 1}} />
          {this.state.adding && <ActivityIndicator />}
        </View>
        {this.state.error && <Text>{this.state.error.toString()}</Text>}

        {this.state.savedPins.map(function (pin) {
          return (
            <PINView key={pin.pin} pin={pin} remove={() => {self.removePin(pin)}} />
          )
        })}
      </View>
    );
  }
}

function PINView(props) {
  return (
    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
      <Text style={{fontSize: 16}}>{props.pin.pin} - {props.pin.name}</Text>
      <Button title="Remove" onPress={props.remove} />
    </View>
  );
}
