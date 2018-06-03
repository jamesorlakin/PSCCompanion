import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

import screens from './drawerItems'

class Drawer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedScreen: screens.about.screen
    }
    this.navigate = this.navigate.bind(this)
  }

  navigate (screen) {
    this.setState({selectedScreen: screen})
  }

  render () {
    var navigate = this.navigate

    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{width: 250}}>
          {Object.keys(screens).map(function (screenName) {
            return <DrawerItem key={screenName} screenName={screenName} screen={screens[screenName]} navigate={navigate} />
          })}
          <this.state.selectedScreen style={{flex: 1}} />
        </View>
      </View>
    )
  }
}

function DrawerItem (props) {
  if (props.screenName === 'welcome') console.log(props)
  function navigate () {
    props.navigate(props.screen.screen)
  }
  var screenName = props.screenName
  try {
    screenName = props.screen.screen.navigationOptions.drawerLabel
  } catch (e) {
    
  }
  return (
    <TouchableOpacity onPress={navigate}>
      <Text>{screenName}</Text>
    </TouchableOpacity>
  )
}

export default Drawer
