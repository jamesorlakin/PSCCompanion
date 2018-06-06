// Sorts data by day, and returns a horizontal ScrollView containing TimetableDay

import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native'

import moment from 'moment'
import TimetableDay from './timetableDay.js'
import { dayWidth } from './constants.js'

export default class Timetable extends Component {
  constructor (props) {
    super(props)
    this.doneScroll = false
    this.doWeekScroll = this.doWeekScroll.bind(this)
  }

  doWeekScroll (ref) {
    // If this isn't showing the current week, don't scroll to the current day.
    if (this.props.week !== 0) return true
    var self = this
    if (!this.doneScroll) {
      setTimeout(function () {
        if (moment().format('d') < 6) {
          self.doneScroll = true
          ref.scrollTo({
            x: (moment().format('d') - 1) * (dayWidth),
            animated: true
          })
        }
      }, 10)
    }
  }

  render () {
    if (this.props.data.timetable.length === 0) { return (<Text>No timetable events returned.</Text>) }

    var startOfWeek = moment.unix(this.props.data.timetable[0].Start).startOf('isoweek')

    // Let's define 5 blank days. Each day is an array of events.
    var dayTimetables = []
    for (var i = 0; i < 5; i++) {
      dayTimetables[i] = []
    }

    // For each of our events, let's find out what day of the week it is and add it
    // to the corresponding dayTimetables array.
    for (var i = 0; i < this.props.data.timetable.length; i++) {
      this.props.data.timetable[i].key = this.props.data.timetable[i].Start
      var day = moment.unix(this.props.data.timetable[i].Start).isoWeekday()
      if (dayTimetables[day] === undefined) dayTimetables[day] = [] // What if there's a Saturday thing?! Poor students.
      dayTimetables[day].push(this.props.data.timetable[i])
    }

    // Let's turn each day array into a TimetableDay component to be rendered.
    var timetableColumns = []
    for (var i = 1; i < dayTimetables.length; i++) {
      timetableColumns.push(<TimetableDay
        key={i}
        data={dayTimetables[i]} />)
    }

    // If it's a shared timetable, it'll request just one day as a prop.
    // This is so the day splitting code above is shared.
    if (typeof this.props.day === 'number') return timetableColumns[this.props.day]

    // The top of each column has a header saying what day it is.
    // We use the array index (day of week) and the calculated start of week to
    // work out what day it is.
    var timetableHeaders = []
    for (var i = 1; i < dayTimetables.length; i++) {
      timetableHeaders.push(<Text
        style={[styles.boldTitleUnderline, {width: dayWidth}]}
        key={i}>
        {startOfWeek.clone().isoWeekday(i).format('dddd - Do')}
      </Text>)
    }

    // A horizontal ScrollView contains each day header next to one another.
    // Under that is a vertical ScrollView containing all of the day components.
    // This ensures day headers remain on the top of the screen, as they are not scrolled vertically.
    return (
      <ScrollView ref={this.doWeekScroll} horizontal>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            {timetableHeaders}
          </View>
          <ScrollView>
            <View style={{flexDirection: 'row'}}>
              {timetableColumns}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  },
  title: {
    fontSize: 17
  },
  boldTitleUnderline: {
    fontSize: 17,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'center'
  }
})
