import React, { Component } from 'react'
import { ScrollView } from 'react-native'

import { DrawerNavigator, DrawerItems } from 'react-navigation'
import screens from './drawerItems'

const Drawer = DrawerNavigator(screens, {
  contentComponent: props => (<ScrollView><DrawerItems {...props} /></ScrollView>),
  contentOptions: {
    activeTintColor: '#36648B',
    style: {
      marginVertical: 0
    }
  }
})

export default Drawer
