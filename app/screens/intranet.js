import React, { Component } from 'react';
import {
  View,
  WebView,
  Text,
  AsyncStorage,
  StyleSheet,
} from 'react-native';

export default class IntranetScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Student Intranet'
  }

  constructor(props) {
    super(props);
    this.state = {
      shouldRender: false,
      credentials: null
    };
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('credentials').then(function (data) {
      if (typeof data === "string") var credentials = JSON.parse(data)
      self.setState({shouldRender: true, credentials: credentials})
    })
  }

  render() {
    if (this.state.shouldRender) {
      var injection = "";
      if (this.state.credentials !== null) {
        injection = "if (window.location.toString().indexOf('login.php')>-1) {" +
          "  document.getElementById('username').value = '" + this.state.credentials.username + "';" +
          "  document.getElementById('password').value = '" + this.state.credentials.password + "';" +
          "  document.getElementById('signin').click();" +
          "}";
        console.log(injection);
      }

      return (
        <View style={styles.container}>
          <WebView source={{uri: "https://intranet.psc.ac.uk"}}
            injectedJavaScript={injection}/>
        </View>
      );
    }

    return (<View />)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
