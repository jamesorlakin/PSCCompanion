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
var dayWidth = Dimensions.get('window').width*0.8;

export default class Timetable extends Component {
  constructor(props) {
    super(props);
    this.doneScroll = false;
    this.doScroll = this.doScroll.bind(this)
  }

  eventElement(data) {
    if (data.item.Type === "studyperiod") return (
      <View>
        <Text style={styles.italic}>Free</Text>
        <Text>{moment.unix(data.item.Start).format('LT')}</Text>
      </View>
    )

    return (
      <View>
        <Text style={styles.bold}>{data.item.Title}</Text>
        <Text>{moment.unix(data.item.Start).format('LT')} - {moment.unix(data.item.End).format('LT')} : {data.item.Room}</Text>
        {data.item.Staff !== "" && <Text>{data.item.Staff}</Text>}
      </View>
    )
  }

  doScroll(ref) {
    if (this.props.week != 0) return true
    var self = this;
    if (!this.doneScroll) setTimeout(function () {
      if (moment().format('d') < 5) {
        self.doneScroll = true
        ref.scrollTo({
          x: (moment().format('d')-1)*(dayWidth),
          animated: true
        })
      }
    }, 10)
  }

  render() {
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
      timetableColumns.push(<FlatList
        width={dayWidth}
        key={key}
        data={dayTimetables[key]}
        ListHeaderComponent={<Text style={styles.boldTitleUnderline}>{moment.unix(key).format('dddd - Do')}</Text>}
        renderItem={self.eventElement} />)
    })

    // No point in having a horizontal scroll for one day
    if (timetableColumns.length === 1) return timetableColumns[0];
    return (
      <ScrollView ref={this.doScroll} horizontal={true}>
        {timetableColumns}
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
