import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
} from 'react-native'

import cheerio from 'react-native-cheerio'
import { Fetching, WelcomeBox } from './commonComponents.js'

export default class PrintingStatusComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      configured: true,
      credit: 0,
    }
  }

  async componentDidMount() {
    var credentials = await AsyncStorage.getItem('credentials')
    if (typeof credentials !== "string") {
      this.setState({configured: false})
      return
    }
    credentials = JSON.parse(credentials)

    await (await fetch('https://iprint.psc.ac.uk/app?service=restart')).text()

    var requestBody = 'service=direct%2F1%2FHome%2F%24Form%240&sp=S0&Form0=%24Hidden%240%2C%24Hidden%241%2CinputUsername%2CinputPassword%2C%24PropertySelection%240%2C%24Submit%240&%24Hidden%240=true&%24Hidden%241=X&%24PropertySelection%240=en&%24Submit%240=Log+in' +
      '&inputUsername=' + credentials.username +
      '&inputPassword=' + credentials.password
    var printRequest = await fetch('https://iprint.psc.ac.uk/app', {
      method: 'POST',
      headers: {
        Origin: 'https://iprint.psc.ac.uk',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: requestBody
    })
    var result = await printRequest.text()
    var printStatusPage = cheerio.load(result)

    var credit = printStatusPage("div[class='widget stat-bal'] > div").text()
    credit = credit.substr(2).substr(0, credit.length - 4)

    console.log(credit);

    this.setState({loaded: true, credit: credit})
    //fetch()
  }

  render() {
    if (!this.state.configured) return null
    return (
      <WelcomeBox title="Current printing credit:">
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 40}}>{this.state.credit}</Text>
        </View>
      </WelcomeBox>
    )
  }
}
