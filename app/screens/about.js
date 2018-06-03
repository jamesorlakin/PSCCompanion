import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  Linking,
  ScrollView,
  Image,
} from 'react-native'

import { commonStyles } from '../commonComponents.js'

export default class AboutScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'About',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../images/menuIcons/about.png')}
        style={{width: 20, height: 20, tintColor: tintColor}}
      />
    )
  }

  openSource () {
    Linking.openURL('https://gateway.jameslakin.co.uk/git/james.lakin/PSCCompanion.git')
  }

  mailMe () {
    Linking.openURL('mailto:jlakin16@students.psc.ac.uk')
  }

  render () {
    return (
      <ScrollView>
        <View style={commonStyles.screenContainer}>
          <Image source={require('../images/pscCompanionLogo.png')} style={{width: 200, height: 200}} resizeMode='contain' />
          <Text style={{fontSize: 30, textDecorationLine: 'underline'}}>PSC Companion</Text>

          <Breaker />

          <Text>PSC Companion is an app built by James Lakin using the React Native
            framework. Using JavaScript allows cross-platform compatibility and
            a really fast development time. If you're keen to make an app, I highly
            recommend this over pure native (Java, Swift, Objective-C) solutions.</Text>
          <Text>I'm open to feedback, bug reports, and code tweaks. The source code for
          PSC Companion is available to see how it works, should you be interested.</Text>
          <Button title='View source' onPress={this.openSource} />
          <Breaker />
          <Button title='E-mail me' onPress={this.mailMe} />

          <Breaker />

          <Text>Timetable data is sourced from data.psc.ac.uk. Attendance, student
            notices and printing credit is obtained through web scraping.</Text>

          <Breaker />

          <Text>GLYPHICONS used in the navigation bar are licenced under the
            Creative Commons Attribution 3.0 (CC BY 3.0). Learn more at
            Glyphicons.com</Text>

          <Breaker />

          <Text>Icons [the key in the app intro] made by Freepik from www.flaticon.com is licensed by CC 3.0 BY</Text>

        </View>
      </ScrollView>
    )
  }
}

function Breaker () {
  return <View style={{height: 2, backgroundColor: 'gray', marginBottom: 10, marginTop: 10}} />
}
