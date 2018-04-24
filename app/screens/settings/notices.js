import React, { Component } from 'react'
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Switch
} from 'react-native'

export default class SettingsNotices extends Component {
  constructor (props) {
    super(props)
    this.state = {
      enabled: true
    }
    this.save = this.save.bind(this)
  }

  async componentDidMount () {
    var config = await AsyncStorage.getItem('noticesEnabled')
    if (config === 'no') this.setState({enabled: false})
  }

  save (value) {
    this.setState({enabled: value})
    AsyncStorage.setItem('noticesEnabled', (value ? 'yes' : 'no'))
  }

  render () {
    return (
      <View style={styles.container}>
        <Text>Student notices notifications:</Text>
        <Text>PSC Companion can check for new student notices every few hours and display a notification.</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{marginTop: 4}}>Enabled?</Text>
          <Switch
            value={this.state.enabled}
            onValueChange={this.save}
          />
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
