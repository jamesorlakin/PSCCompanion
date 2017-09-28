import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Picker,
} from 'react-native';

export default class SettingsAdFree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      adFree: false
    };
    this.save = this.save.bind(this)
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('adFree').then(function (data) {
      if (typeof data === "string") self.setState({loaded: true, adFree: (data === "true" ? true : false)})
    })
  }

  save(value) {
    this.setState({adFree: value})
    AsyncStorage.setItem('adFree', (value ? "true" : "false"));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Advertising options: (will apply on next boot)</Text>
        <Picker
          selectedValue={this.state.adFree}
          onValueChange={this.save}>
          <Picker.Item label="Keep Ads" value={false} />
          <Picker.Item label="Remove Ads" value={true} />
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
  },
});
