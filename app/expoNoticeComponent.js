import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default class ExpoNoticeComponent extends Component {
  render() {
    return (
      <View style={styles.welcomeContainer}>
        <Text style={{fontWeight: 'bold'}}>Woah there!</Text>
        <Text>You are running the Expo version of PSC Companion. Expect more bugs
          and fewer features in this more limiting environment.

          Android users should head to Google Play to download a better version of
          PSC Companion. iOS users should get a better device.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    borderWidth: 5,
    borderRadius: 1,
    padding: 4,
    marginBottom: 20
  }
});
