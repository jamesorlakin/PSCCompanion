import React, { Component } from 'react'
import { View, Text, Button, AsyncStorage, TextInput } from 'react-native'

class Key extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: null,
      newValue: null,
      editing: false
    }
    this.deleteKey = this.deleteKey.bind(this)
    this.updateKey = this.updateKey.bind(this)
  }

  async componentDidMount () {
    var value = await AsyncStorage.getItem(this.props.asyncKey)
    this.setState({value, newValue: value})
  }

  async deleteKey () {
    await AsyncStorage.removeItem(this.props.asyncKey)
    this.props.refreshKeys()
  }

  async updateKey () {
    await AsyncStorage.setItem(this.props.asyncKey, this.state.newValue)
    this.setState({editing: false, value: this.state.newValue})
  }

  render () {
    return (
      <View style={{flexDirection: this.state.editing ? 'column' : 'row', justifyContent: 'space-between', padding: 4, borderWidth: 1}}>
        <Text>{this.props.asyncKey}</Text>
        {this.state.editing ? <View>
          <TextInput defaultValue={this.state.value} onChangeText={text => this.setState({newValue: text})} multiline />
          <Button title='Save' onPress={this.updateKey} />
        </View>

        : <View style={{flexDirection: 'row'}}>
          <Button title='Edit' onPress={() => this.setState({editing: true})} />
          <View style={{width: 4}} />
          <Button title='Delete' onPress={this.deleteKey} />
        </View>}
      </View>
    )
  }
}

export default Key