import React, { Component } from 'react';
import {
  View,
  TextInput,
  AsyncStorage,
  StyleSheet,
  Button,
} from 'react-native';

export default class DebugScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Debug'
  }

  constructor() {
    super();
    this.state = {
      tokens: ['Loading...'],
      pinAndKey: null,
      newPinAndKey: null
    };
    this.savePinAndKey = this.savePinAndKey.bind(this)
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('tokens').then(function (value) {
      var state = []
      var tokens = JSON.parse(value);
      for (var thing in tokens) {
        if (tokens.hasOwnProperty(thing)) {
          state.push(thing + " - " + tokens[thing])
        }
      }

      self.setState({tokens: state});
    })

    AsyncStorage.getItem('sharedPinAndKey').then(function (result) {
      self.setState({pinAndKey: result})
    })
  }

  savePinAndKey() {
    AsyncStorage.setItem('sharedPinAndKey', this.state.newPinAndKey)
  }

  render() {
    var tokens = this.state.tokens;
    return (<View style={styles.container}>{tokens.map(function (item) {
      return (<TextInput key={tokens.indexOf(item)}>{item}</TextInput>)
    })}
    <TextInput defaultValue={this.state.pinAndKey}
      onChangeText={(value) => {this.setState({newPinAndKey: value})}} />
    <Button onPress={this.savePinAndKey} title="Save PinAndKey" />
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8
  },
});
