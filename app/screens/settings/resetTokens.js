import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  AsyncStorage,
  ToastAndroid,
  StyleSheet
} from 'react-native'

export default class SettingsResetTokens extends Component {
  constructor (props) {
    super(props)
    this.resetTokens = this.resetTokens.bind(this)
  }

  resetTokens () {
    AsyncStorage.removeItem('tokens').then(function () {
      ToastAndroid.show('Tokens reset - Please restart PSC Companion.', ToastAndroid.LONG)
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={{marginBottom: 5}}>If you're having issues fetching data from the
          college API, you can reset the tokens that PSC Companion uses.
          Tokens can expire if a request isn't performed within two weeks or
          if there are network issues while PSC Companion is refreshing its
          tokens. Pressing the button below will force you to login again.</Text>
        <Button title='Reset Tokens'
          onPress={this.resetTokens}
          color='#E80909' />
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
