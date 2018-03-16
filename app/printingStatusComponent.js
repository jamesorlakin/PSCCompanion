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
      configured: false,
      credit: 0,
      pages: 0
    }
  }

  async componentDidMount() {
    var credentials = await AsyncStorage.getItem('credentials')
    if (typeof credentials === "string") this.setState({configured: true})
    else return
    credentials = JSON.parse(credentials)

    // Reset session status
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
    credit = credit.substr(2).substr(0, credit.length - 5)

    var pages = printStatusPage("div[class='widget stat-pages'] > div").text()

    var trees = printStatusPage("li[class='trees']").text()
    trees = trees.slice(3, -1)

    this.setState({loaded: true, credit: credit, pages: pages, trees: trees})
  }

  render() {
    if (!this.state.configured) return null
    return (
      <WelcomeBox title="Current printing credit:" loading={!this.state.loaded}>
        <Text style={{fontSize: 40, textAlign: 'center'}}>{this.state.credit}</Text>
        <Text style={{fontSize: 30, textAlign: 'center'}}>{this.state.pages} pages</Text>
        <Text style={{fontSize: 20, textAlign: 'center'}}>({this.state.trees})</Text>
      </WelcomeBox>
    )
  }
}
