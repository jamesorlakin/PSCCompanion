import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';

import moment from 'moment';
import { dayWidth } from './constants.js';

export default class TimetableDay extends Component {
  render() {
    var events = this.props.data;
    var rows = [];

    for (var i = 0; i < events.length; i++) {
      // Does the first event start at 8:30?
      if (i === 0 && moment.unix(events[i].Start)
        .isAfter(moment.unix(events[i].Start).hour(8).minute(30)))
          rows.push(<EventElement key={i+"start"} item={{Type: "free",
            Start: moment.unix(events[i].Start).hour(8).minute(30).unix(),
            End: events[i].Start}} />);

      // Add the event
      rows.push(<EventElement key={events[i].Start+events[i].Type} item={events[i]} />);

      // Is there a gap between the end of now and the next item?
      if (i+1 !== events.length) {
        if (events[i].End !== events[i+1].Start)
          rows.push(<EventElement key={i}
            item={{Type: "free",
              Start: events[i].End,
              End: events[i+1].Start}} />);
      }

      // Is there nothing until 16:35?
      if (i+1 === events.length && moment.unix(events[i].End)
        .isBefore(moment.unix(events[i].Start).hour(16).minute(35)))
          rows.push(<EventElement key={i+"end"} item={{Type: "free",
            Start: events[i].End,
            End: moment.unix(events[i].Start).hour(16).minute(35).unix()}} />);
    }

    return (<View width={dayWidth} style={styles.container}>
      {rows}
    </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic',
    fontSize: 16
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

function EventElement(props) {
  var staff = props.item.Staff;
  if (staff === "Paul Watson") staff = <Text style={{fontWeight: 'bold', fontSize: 25}}>Uncle Paul</Text>
  var height = ((props.item.End - props.item.Start)/28);

  var style = {
    padding: 2,
    borderWidth: 0.5,
    borderColor: '#c5c6c9',
    height: height
  }

  if (props.item.Type === "free") return (
    <View style={style}>
      <Text style={styles.italic}>Free</Text>
      <Text>{moment.unix(props.item.Start).format('LT')} - {moment.unix(props.item.End).format('LT')}</Text>
      <View style={{height: 2}} />
    </View>
  )

  return (
    <View style={[style, {flexDirection: 'row'}]}>
      <View style={{
        backgroundColor: props.item.Color,
        width: 3}}
      />
      <View style={{marginLeft: 5}} >
        <Text style={styles.bold}>
          {props.item.IsCancelled && "(Cancelled) "}
          {props.item.Title}
        </Text>
        <Text>{moment.unix(props.item.Start).format('LT')} - {moment.unix(props.item.End).format('LT')} : {props.item.Room}</Text>
        {staff !== "" && <Text>{staff}</Text>}
      </View>
    </View>
  )
}
