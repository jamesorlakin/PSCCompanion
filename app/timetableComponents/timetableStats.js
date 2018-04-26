import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

import PieChart from 'react-native-pie'
import randomColor from 'randomcolor'

export default class TimetableStats extends Component {
  render() {
    var timetable = this.props.timetable
    var count = {}
    var total = 0
    for (var i = 0; i < timetable.length; i++) {
      count[timetable[i].Staff] === undefined ? count[timetable[i].Staff] = 0 : null
      var timeDiff = (timetable[i].End - timetable[i].Start)
      count[timetable[i].Staff] += timeDiff
      total += timeDiff
    }

    var series = []
    var breakdown = []
    var colors = []
    for (var Staff in count) {
      if (count.hasOwnProperty(Staff)) {
        var percent = count[Staff]/total*100
        series.push(percent)
        var color = randomColor({seed: Staff})
        colors.push(color)
        breakdown.push({Staff: Staff === "" ? "Lecture / Undefined" : Staff,
          percent: percent,
          color: color})
      }
    }
    //var sliceColors = ['#F44336','#2196F3','#FFEB3B', '#4CAF50', '#FF9800', '#008B8B', '#E0FFFF']
    return (
      <View>
        <Text>Staff breakdown / Desk ownership:</Text>
        <View flexDirection="row">
          <PieChart
            radius={125}
            series={series}
            colors={colors}
          />
          <View>
            {breakdown.map(function (item) {
              return (
                <View key={item.Staff} style={{flexDirection: 'row'}}>
                  <View style={{width: 10, height: 10, backgroundColor: item.color}}/>
                  <Text>{item.Staff} - {Math.round(item.percent) + "%"}</Text>
                </View>
              )
            })}
          </View>
        </View>
      </View>
    )
  }
}
