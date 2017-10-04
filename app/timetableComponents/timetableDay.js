import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';

import moment from 'moment'

export default class TimetableDay extends Component {
  constructor(props) {
    super(props);
    this.doneScroll = 0;
    this.doScroll = this.doScroll.bind(this);
    this.storeRef = this.storeRef.bind(this)
  }

  doScroll() {
    if (this.scrollView === undefined) return false;
    if (this.props.scrollTo === undefined) return false;
    var self = this;
    if (this.doneScroll !== this.props.scrollTo) setTimeout(function () {
      self.doneScroll = self.props.scrollTo
      self.scrollView.scrollTo({
        y: self.props.scrollTo,
        animated: false
      })
    }, 10)
  }

  storeRef(ref) {
    this.scrollView = ref;
  }

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

    this.doScroll();

    return (<ScrollView
      width={this.props.dayWidth}
      onScroll={this.props.onScroll}
      ref={this.storeRef}>
        <View style={styles.container}>
          {
            typeof this.props.selectedDay !== "number" &&
            <Text style={styles.boldTitleUnderline}>{moment.unix(this.props.day).format('dddd - Do')}</Text>
          }
          {rows}
        </View>
      </ScrollView>)
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
  var height = ((props.item.End - props.item.Start)/60)+40;
  if (height<60) height = 60;

  var style = {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    height: height
  }

  if (props.item.Type === "free") return (
    <View style={style}>
      <Text style={styles.italic}>Free</Text>
      <Text>{moment.unix(props.item.Start).format('LT')} - {moment.unix(props.item.End).format('LT')}</Text>
    </View>
  )

  return (
    <View style={style}>
      <Text style={styles.bold}>{props.item.Title}</Text>
      <Text>{moment.unix(props.item.Start).format('LT')} - {moment.unix(props.item.End).format('LT')} : {props.item.Room}</Text>
      {props.item.Staff !== "" && <Text>{props.item.Staff}</Text>}
    </View>
  )
}
