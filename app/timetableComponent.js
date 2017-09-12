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

export default class Timetable extends Component {
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
        width={Dimensions.get('window').width*0.8}
        key={key}
        data={dayTimetables[key]}
        ListHeaderComponent={<Text style={styles.boldTitleUnderline}>{moment.unix(key).format('dddd')}</Text>}
        renderItem={self.eventElement} />)
    })

    // No point in having a horizontal scroll for one day
    if (timetableColumns.length === 1) return timetableColumns[0];

    return (
      <ScrollView horizontal={true}>
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
