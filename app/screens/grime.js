// A completely useless easter egg!
import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
  LayoutAnimation,
  TouchableOpacity
} from 'react-native'
import ProgressCircle from 'react-native-progress-circle'

export default class GrimeScreen extends Component {
  constructor () {
    super()
    this.state = {
      percent: 0,
      running: false
    }
    this.scan = this.scan.bind(this)
    this.increase = this.increase.bind(this)
  }

  scan () {
    this.setState({running: true, percent: 0})
    this.timer = setInterval(this.increase, 15)
  }

  increase () {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    if (this.state.percent >= 100) {
      clearInterval(this.timer)
      this.setState({running: false})
    } else {
      this.setState({percent: this.state.percent + 1})
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => {this.props.navigation.navigate('mcDonalds')}}>
          <Text style={{ fontSize: 20, textDecorationLine: 'underline' }}>Is this grime?</Text>
        </TouchableOpacity>
        <ProgressCircle
          percent={this.state.percent}
          radius={80}
          borderWidth={8}
          color='#1CAD4A'
          shadowColor='#E83131'
          bgColor='#fff'
        >
          <Text style={{ fontSize: 25 }}>{this.state.percent}%</Text>
        </ProgressCircle>
        <View style={{height: 5}} />
        <Button title={this.state.running ? 'Scanning' : 'Scan'}
          onPress={this.scan}
          disabled={this.state.running}
        />
        <View style={{height: 10}} />
        {this.state.percent === 100 && !this.state.running && <GrimeResult />}
      </View>
    )
  }
}

function GrimeResult () {
  var isGrime = Math.floor(Math.random() * 2) === 0
  if (isGrime) {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 30, color: 'red'}}>Warning! Grime detected!</Text>
        <Text>You know grime means filth, right?</Text>
      </View>
    )
  }
  return (
    <View style={{alignItems: 'center'}}>
      <Text style={{fontSize: 35}}>All clear.</Text>
      <Text>No grime music was detected.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    alignItems: 'center'
  }
})
