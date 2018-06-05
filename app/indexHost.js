// The component rendered when logged in. Provides react-navigation for all screens.

import React, { Component } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native'

import { StackNavigator } from 'react-navigation'
import BannerAd from './adComponent'
import Drawer from './drawer'

const MenuButton = function (props) {
  return (
    <View>
      <TouchableOpacity onPress={() => {
        props.navigation.state.index === 1
          ? props.navigation.navigate('DrawerClose')
          : props.navigation.navigate('DrawerOpen')
      }}
      >
        <Image source={require('./images/hamburgerIcon.png')}
          style={{
            width: 64,
            height: 64,
            marginLeft: 0,
            marginTop: 3
          }} />
      </TouchableOpacity>
    </View>
  )
}

const DrawerHost = StackNavigator({
  Drawer: {screen: Drawer,
    navigationOptions: ({ navigation }) => ({
      title: 'PSC Companion',
      headerLeft: <MenuButton navigation={navigation} />,
      headerStyle: {
        backgroundColor: '#36648B'
      },
      headerTitleStyle: {
        color: '#FFFAFA',
        padding: 8
      }
    })
  }
})

export default function IndexHost (props) {
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? <Drawer /> : <DrawerHost />}
      {__DEV__ ? <Text style={{textAlign: 'center'}}>Development Build</Text> : <BannerAd />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? '90vh' : undefined
  }
})
