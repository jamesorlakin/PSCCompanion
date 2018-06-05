import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

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
    this.setState({selectedScreen: screen, navigateTime: Date.toString()})
  }

  render () {
    var selectedScreen = this.state.selectedScreen
    var navigate = this.navigate

    return (
      <View style={{flex: 1}}>
        <View style={{height: 50, backgroundColor: '#36648B', flexDirection: 'row', padding: 6}}>
          <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 2}}>PSC Companion</Text>
          <Text style={{fontStyle: 'italic', color: 'white', marginTop: 11, marginLeft: 10}}>Web</Text>
        </View>

        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{width: 250}}>
            {Object.keys(screens).map(function (screenName) {
              var isSelected = screens[screenName].screen === selectedScreen
              return <DrawerItem key={screenName} isSelected={isSelected} screenName={screenName} screen={screens[screenName]} navigate={navigate} />
            })}
          </View>

          <this.state.selectedScreen key={this.state.navigateTime} style={{flex: 1}} />
        </View>
      </View>
    )
  }
}

function DrawerItem (props) {
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
      <View style={{padding: 4, borderWidth: 1, backgroundColor: props.isSelected ? '#36648B' : 'white'}}>
        <Text style={{color: props.isSelected ? 'white' : 'black'}}>{screenName}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default Drawer
