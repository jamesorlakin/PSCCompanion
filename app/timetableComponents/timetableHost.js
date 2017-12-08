// Sorts data by day, and returns a horizontal scrollview containing timetableDay

import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

import moment from 'moment';
import TimetableDay from './timetableDay.js';
import { dayWidth } from './constants.js';

export default class Timetable extends Component {
  constructor(props) {
    super(props);
    this.doneScroll = false;
    this.doScroll = this.doScroll.bind(this)
  }

  doScroll(ref) {
    if (this.props.week != 0) return true
    var self = this;
    if (!this.doneScroll) setTimeout(function () {
      if (moment().format('d') < 6) {
        self.doneScroll = true
        ref.scrollTo({
          x: (moment().format('d')-1)*(dayWidth),
          animated: true
        })
      }
    }, 10)
  }

  render() {
    if (this.props.data.timetable.length === 0)
      return (<Text>No timetable events returned.</Text>)

    var self = this;
    var dayTimetables = {};

    for (var i = 0; i < this.props.data.timetable.length; i++) {
      this.props.data.timetable[i].key = this.props.data.timetable[i].Start
      var day = moment.unix(this.props.data.timetable[i].Start).startOf('day').unix();
      if (dayTimetables[day] === undefined) dayTimetables[day] = [];
      dayTimetables[day].push(this.props.data.timetable[i])
    }

    var timetableColumns = [];
    Object.keys(dayTimetables).forEach(function (key) {
      timetableColumns.push(<TimetableDay
        key={key}
        onScroll={self.props.onScroll}
        scrollTo={self.props.scrollTo}
        selectedDay={self.props.day}
        data={dayTimetables[key]} />)
    })

    if (typeof this.props.day === "number") {
      if (timetableColumns[this.props.day] === undefined) return (
        <View style={{width: dayWidth,
          borderRadius: 4,
          borderWidth: 0.5,
          borderColor: '#c5c6c9'}}>
          <Text>No events found for this day.</Text>
        </View>
      )
      return timetableColumns[this.props.day];
    }

    var timetableHeaders = [];
    Object.keys(dayTimetables).forEach(function (key) {
      timetableHeaders.push(<Text
        style={[styles.boldTitleUnderline, {width: dayWidth}]}
        key={key}>{moment.unix(key).format('dddd - Do')}</Text>)
    })

    return (
      <ScrollView ref={this.doScroll} horizontal={true}>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textDecorationLine: 'underline'
  }
});
