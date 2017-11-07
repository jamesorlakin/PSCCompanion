import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
} from 'react-native';

import moment from 'moment'
import randomColor from 'randomcolor'
var SharedPreferences = require('react-native-shared-preferences')

export default class Summary extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      data: null,
    };
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('sharedPinAndKey').then(function (data) {
      if (data === null) return false;
      fetch("https://gateway.jameslakin.co.uk/psc/api/fetch?pin=" + JSON.parse(data).pin +
      "&startOfWeek=" + moment().startOf('day').startOf('isoweek').unix()).then(function (data) {
        return data.json()
      }).then(function (results) {
        self.setState({loaded: true, data: results[0]})
      }).catch(function (error) {
        console.log(error)
      })
    })
  }

  render() {
    if (!this.state.loaded) return (<View />)

    var nextEvent = {type: "unknown"};

    var timetable = JSON.parse(JSON.parse(this.state.data.data)).timetable
    if (timetable.length === 0) return (<View />)

    var now = moment()
    console.log(now);

    // Add the difference in unix time if we're out by a week:
    var addTime = moment().startOf('day').startOf('isoweek').unix()
      - moment.unix(timetable[0].Start).startOf('day').startOf('isoweek').unix()

    for (var i = 0; i < timetable.length; i++) {
      timetable[i].Start += addTime;
      timetable[i].End += addTime;

      if (now.isBefore(moment.unix(timetable[i].Start)) && !timetable[i].IsCancelled) {
        nextEvent = timetable[i];
        break;
      }

      if (i+1 === timetable.length) {
        // Use the first event and add a week
        timetable[0].Start += 604800;
        timetable[0].End += 604800;
        nextEvent = timetable[0];
      }
    }

    SharedPreferences.setItem("summaryTimetable", JSON.stringify(timetable));

    return (
      <View style={styles.container}>
        <Text style={{fontWeight: 'bold'}}>What's next?</Text>
        {nextEvent.type != "unknown" && <View style={{
          backgroundColor: randomColor({
            seed: nextEvent.Title+"hedgehog",
            luminosity: "bright"
          }),
          height: 3}}
        />}
        <Text>{nextEvent.type != "unknown" && nextEvent.Title + " - "
          + moment.unix(nextEvent.Start).fromNow()}</Text>
        <Text>{nextEvent.type != "unknown" && nextEvent.Staff}</Text>
        <Text>{moment.unix(nextEvent.Start).format('dddd, HH:mm A') + " - "}
          {moment.unix(nextEvent.End).format('HH:mm A')} : {nextEvent.Room}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 5,
    borderRadius: 1,
    padding: 4,
    marginBottom: 20
  },
});
