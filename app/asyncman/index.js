import React, { Component } from 'react'
import { ScrollView, View, Text, Button, AsyncStorage, TextInput } from 'react-native'

import Key from './key'

class AsyncMan extends Component {
  constructor (props) {
    super(props)
    this.state = {
      keys: [],
      addingNew: false,
      newKey: null,
      newValue: null
    }
    this.refreshKeys = this.refreshKeys.bind(this)
    this.addKey = this.addKey.bind(this)
  }

  componentDidMount () {
    this.refreshKeys()
  }

  async refreshKeys () {
    var keys = await AsyncStorage.getAllKeys()
    this.setState({keys})
  }

  async addKey () {
    if (this.state.newKey !== null) { 
      await AsyncStorage.setItem(this.state.newKey, this.state.newValue)
    }
    this.setState({addingNew: false, newKey: null, newValue: null})
    this.refreshKeys()
  }

  render () {
    var refreshKeys = this.refreshKeys
    return (
      <View style={{flex: 1, padding: 4}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
          <View>
            <Text style={{fontSize: 20}}>AsyncMan</Text>
            <Text>{this.state.keys.length} keys</Text>
          </View>
          <View>
            {__DEV__ && <Text>DEV Mode!</Text>}
            <Button title='+' onPress={() => this.setState({addingNew: true})} />
          </View>
        </View>

        <ScrollView>
          {this.state.addingNew && <View style={{padding: 4, borderWidth: 1}}>
            <TextInput placeholder='Key' onChangeText={text => this.setState({newKey: text})} />
            <TextInput placeholder='Value' onChangeText={text => this.setState({newValue: text})} />
            <Button title='Save' onPress={this.addKey} />
          </View>}
          {this.state.keys.map(function (key) {
            return <Key key={key} asyncKey={key} refreshKeys={refreshKeys} />
          })}
        </ScrollView>
      </View>
    )
  }
}

export default AsyncMan
