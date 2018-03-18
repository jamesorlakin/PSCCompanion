import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import LoginScreen from './login.js'

export default class Intro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLogin: false
    }
    this.showLogin = this.showLogin.bind(this)
  }

  showLogin() {
    this.setState({showLogin: true})
  }

  render() {
    if (this.state.showLogin) return <LoginScreen/>
    return (
      <AppIntroSlider
        slides={slides}
        onDone={this.showLogin}
        onSkip={this.showLogin}
        showSkipButton={true}
        showPrevButton={true}
      />
    )
  }
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 320
  }
})

const slides = [
  {
    key: 'somethun',
    title: 'Welcome',
    text: 'PSC Companion is a free, cool and awesome app for students.',
    image: require('../../images/pscCompanionLogo.png'),
    imageStyle: styles.image,
    backgroundColor: '#59b2ab'
  },
  {
    key: 'somethun-dos',
    title: 'How',
    text: 'Other cool stuff',
    image: require('../../images/userIcon.png'),
    imageStyle: styles.image,
    backgroundColor: '#febe29'
  },
  {
    key: 'somethun1',
    title: 'MAPS',
    text: 'WE HAVE MAPS.',
    image: require('../../images/pscmap.png'),
    imageStyle: styles.image,
    backgroundColor: '#22bcb5'
  }
]
