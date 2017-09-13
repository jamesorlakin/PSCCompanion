import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import PhotoView from 'react-native-photo-view';

export default class MapScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Campus map'
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Learn to navigate.</Text>
        <PhotoView source={require('../images/pscmap.png')}
          minimumZoomScale={1.1}
          maximumZoomScale={3}
          style={{width: 400, height: 400}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
});
