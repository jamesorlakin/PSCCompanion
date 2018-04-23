import React, { Component } from 'react'
import {
  View,
  WebView,
  BackHandler,
  Text,
  AsyncStorage,
  StyleSheet,
  Image
} from 'react-native'

export default class IntranetScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Student Intranet',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../images/menuIcons/intranet.png')}
        style={{width: 20, height: 20, tintColor: tintColor}}
      />
    )
  }

  constructor (props) {
    super(props)
    this.state = {
      shouldRender: false,
      credentials: null
    }
    this.goBack = this.goBack.bind(this)
  }

  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this.goBack)
    var self = this
    AsyncStorage.getItem('credentials').then(function (data) {
      var credentials = null
      if (typeof data === 'string') credentials = JSON.parse(data)
      self.setState({shouldRender: true, credentials: credentials})
    })
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.goBack)
  }

  goBack () {
    this.refs['WEBVIEW'].goBack()
    return true
  }

  render () {
    if (this.state.shouldRender) {
      var injection = ''
      if (this.state.credentials !== null) {
        injection = "if (window.location.toString().indexOf('login.php')>-1) {" +
          "  document.getElementById('username').value = '" + this.state.credentials.username + "';" +
          "  document.getElementById('password').value = '" + this.state.credentials.password + "';" +
          "  document.getElementById('signin').click();" +
          '}'
        if (this.state.credentials.username === null || this.state.credentials.password === null) injection = ''
      }

      return (
        <View style={{flex: 1}}>
          <WebView source={{uri: 'https://intranet.psc.ac.uk'}}
            ref='WEBVIEW'
            injectedJavaScript={injection} />
        </View>
      )
    }

    return null
  }
}
