import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';

export default class SettingsCredentials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: {},
      newUsername: null,
      newPassword: null,
    };
    this.saveCredentials = this.saveCredentials.bind(this)
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('credentials').then(function (data) {
      if (typeof data === "string") self.setState({credentials: JSON.parse(data)})
    })
  }

  saveCredentials() {
    var self = this;
    AsyncStorage.setItem('credentials', JSON.stringify({
      username: self.state.newUsername,
      password: self.state.newPassword
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Enter the username and password for your college account below to enable automatic intranet logon:</Text>
        <View>
          <TextInput defaultValue={this.state.credentials.username}
            onChangeText={(username) => {this.setState({newUsername: username})}} />
          <TextInput defaultValue={this.state.credentials.password}
            onChangeText={(password) => {this.setState({newPassword: password})}}
            secureTextEntry={true} />
          <Button title="Save" onPress={this.saveCredentials} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
