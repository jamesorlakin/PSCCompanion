import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
} from 'react-native'

import PhotoView from 'react-native-photo-view'
import { commonStyles } from '../commonComponents.js'

export default class MapScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Campus Map',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../images/menuIcons/map.png')}
        style={{width: 20, height: 20, tintColor: tintColor}}
      />
    )
  }

  render() {
    return (
      <View style={commonStyles.screenContainer}>
        <Text>Learn to navigate.</Text>
        <PhotoView source={require('../images/pscmap.png')}
          minimumZoomScale={1.1}
          maximumZoomScale={3}
          style={{width: Dimensions.get('window').width-16, height: Dimensions.get('window').width-16}}/>
      </View>
    )
  }
}
