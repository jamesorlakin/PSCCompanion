import React, { Component } from 'react';
import {
  View,
  WebView,
  BackHandler,
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
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
    var self = this;
    AsyncStorage.getItem('credentials').then(function (data) {
      var credentials = null
      if (typeof data === "string") credentials = JSON.parse(data)
      self.setState({shouldRender: true, credentials: credentials})
    })
  }

  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  }

  goBack() {
    this.refs["WEBVIEW"].goBack();
    return true;
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
      }

      return (
        <View style={styles.container}>
          <WebView source={{uri: "https://intranet.psc.ac.uk"}}
            ref="WEBVIEW"
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
