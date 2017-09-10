import React, { Component } from 'react';
import {
  View,
  WebView,
  Text,
  AsyncStorage,
  StyleSheet,
} from 'react-native';

import IndexHost from './indexHost.js';

export default class LoginScreen extends Component {

  constructor() {
    super();
    this.state = {exchanging: false, done: false};
  }

  handleLoad(e) {
    console.log(e.url)
    if (e.url.indexOf('code=') > -1) {
      var self = this;
      this.setState({exchanging: true})
      var code = e.url.replace('app://localhost?code=', '');
      console.log('Got code ' + code);

      fetch("https://data.psc.ac.uk/oauth/v2/token?" +
        "client_id=59_5np1cw1pak8w4gss080sgkgg8sc8s4kgkgg04go0k448scckog&" +
        "client_secret=17xzzmhevw1wkcgk8000sc0kgkwossw8k8g0soo08wgg40004s&" +
        "grant_type=authorization_code&" +
        "redirect_uri=app://localhost&" +
        "code=" + code).then(function (data) {
          return data.json();
        }).then(function (response) {
          console.log(response);
          response.expireTime = new Date();
          response.expireTime.setSeconds(response.expireTime.getSeconds() + response.expires_in);
          if (response.access_token != undefined) AsyncStorage.setItem('tokens', JSON.stringify(response)).then(function (result) {
            self.setState({done: true});
          }).done()
        })
    }
  }

  render() {
        if (this.state.done) return (<IndexHost />)
    if (this.state.exchanging) return (<Text style={styles.welcome}>Exchanging, hang fire.</Text>)
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Please login using your college credentials:</Text>
        <WebView onNavigationStateChange={this.handleLoad.bind(this)} source={{uri: "https://data.psc.ac.uk/oauth/v2/auth?client_id=59_5np1cw1pak8w4gss080sgkgg8sc8s4kgkgg04go0k448scckog&response_type=code&redirect_uri=app://localhost"}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }
});
