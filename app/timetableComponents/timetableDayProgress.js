import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import moment from 'moment'

export default class TimetableDayProgress extends Component {
  blank () {
    return <View style={styles.container} />
  }

  render () {
    // To keep the headers aligned, we can make this blank to sit next to them.
    if (this.props.blank) return this.blank()

    var startTime = moment().hour(8).minute(30).unix()
    var endTime = moment().hour(16).minute(35).unix()
    var now = moment().unix()

    if (now > endTime || now < startTime) return this.blank()

    var top = ((now - startTime) / 28) - 3
    var bottom = ((endTime - now) / 28) - 3

    return (
      <View style={[styles.container, {marginTop: this.props.topGap}]}>
        <View style={{height: top}} />
        <View style={{height: 6, backgroundColor: 'black'}} />
        <View style={{height: bottom}} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 6
  }
})
