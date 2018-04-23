import React, { Component } from 'react'
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  TextInput,
  Button
} from 'react-native'

export default class SettingsCredentials extends Component {
  constructor (props) {
    super(props)
    this.state = {
      credentials: {},
      saving: false,
      newUsername: null,
      newPassword: null
    }
    this.saveCredentials = this.saveCredentials.bind(this)
  }

  componentDidMount () {
    var self = this
    AsyncStorage.getItem('credentials').then(function (data) {
      if (typeof data === 'string') self.setState({credentials: JSON.parse(data)})
    })
  }

  saveCredentials () {
    this.setState({saving: true})
    var self = this
    AsyncStorage.setItem('credentials', JSON.stringify({
      username: self.state.newUsername,
      password: self.state.newPassword
    })).then(function () {
      self.setState({saving: false})
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <Text>Automatic logon:</Text>
        <Text>Enter the username and password for your college account below to
          enable automatic intranet logon. It will also allow you to view
          attendance data and printing credit.</Text>
        <View>
          <TextInput defaultValue={this.state.credentials.username}
            placeholder='Username'
            onChangeText={(username) => { this.setState({newUsername: username}) }} />
          <TextInput defaultValue={this.state.credentials.password}
            placeholder='Password'
            onChangeText={(password) => { this.setState({newPassword: password}) }}
            secureTextEntry />
          <Button title={this.state.saving ? 'Saving...' : 'Save'} onPress={this.saveCredentials} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30
  }
})
