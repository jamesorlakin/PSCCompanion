import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text, Image, Button } from 'react-native'
import LoginScreen from './login'

export default class Intro extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showLogin: false
    }
    this.showLogin = this.showLogin.bind(this)
  }

  showLogin () {
    this.setState({showLogin: true})
  }

  render () {
    if (this.state.showLogin) return <LoginScreen />
    return (
      <ScrollView>
        {slides.map(function (slide) {
          return (
            <View key={slide.key} style={{marginBottom: 20, backgroundColor: slide.backgroundColor}}>
              <Image source={slide.image} style={styles.image} />
              <Text style={{fontSize: 20}}>{slide.title}</Text>
              <Text>{slide.text}</Text>
            </View>
          )
        })}
        <Button title='Okay.' onPress={this.showLogin} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250
  }
})

const slides = [
  {
    key: 'welcome',
    title: 'Welcome!',
    text: 'PSC Companion is a free, cool and awesome app for Peter Symonds students.',
    image: require('../../images/pscCompanionLogo.png'),
    imageStyle: styles.image,
    backgroundColor: '#59b2ab'
  },
  {
    key: 'unofficial',
    title: 'Proudly Unofficial.',
    text: 'Remember that this app is unofficial and is made by a student. IT services will be unable to asisst with this app. Any bugs can be reported to me directly through email or Google Play.',
    image: require('../../images/userIcon.png'),
    imageStyle: styles.image,
    backgroundColor: '#febe29'
  },
  {
    key: 'sharedtimetables',
    title: 'Shared Timetables!',
    text: 'Timetables can be shared with other users of PSC Companion. Fear not, this is completely opt-in and no timetable data will be transmitted without your permission.',
    image: require('../../images/whosFree.jpg'),
    imageStyle: styles.image,
    backgroundColor: '#59b2ab'
  },
  {
    key: 'readyForLogin',
    title: 'Ready?',
    text: 'It\'s time to login. You\'ll temporarily be redirected to data.psc.ac.uk. Don\'t worry, I won\'t have access to your login details.',
    image: require('../../images/key.png'),
    imageStyle: styles.image,
    backgroundColor: '#22bcb5'
  }
]
