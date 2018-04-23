import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Button,
  Linking,
  ScrollView,
  Image
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

  openExpo () {
    Linking.openURL('https://expo.io/@jamesorlakin/psc-companion-expo')
  }

  mailMe () {
    Linking.openURL('mailto:jlakin16@students.psc.ac.uk')
  }

  render () {
    return (
      <ScrollView>
        <View style={commonStyles.screenContainer}>
          <Text style={{fontSize: 30, textDecorationLine: 'underline'}}>PSC Companion</Text>
          <Text style={{fontSize: 25}}>PSC Companion is available on iOS!</Text>
          <Text>Well... sort of. I don't have a Mac to develop iOS apps and publish
            to the App Store. Instead you'll have to go through the Expo app, a
            pre-built React Native runtime. It doesn't work as well, but core
            functionality should work there fine, though dropdown boxes look really
            strange in iOS. Updates will lag slightly behind Android releases.
            Click the button below to visit PSC Companion on the Expo website.</Text>
          <Button title='Learn more at Expo' onPress={this.openExpo} />

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
