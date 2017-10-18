import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
} from 'react-native';

import moment from 'moment'

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

    var nextEvent = "Nothing. Hell Yeah.";

    var timetable = JSON.parse(JSON.parse(this.state.data.data)).timetable
    var now = moment().day(2).hour(8).minute(28)
    console.log(now);

    // Add the difference in unix time if we're out by a week:
    var addTime = moment().startOf('day').startOf('isoweek').unix()
      - moment.unix(timetable[0].Start).startOf('day').startOf('isoweek').unix()

    for (var i = 0; i < timetable.length; i++) {
      timetable[i].Start += addTime;
      timetable[i].End += addTime;

      if (i+1 !== timetable.length) {
        if (now.isAfter(moment.unix(timetable[i].End))
          && now.isBefore(moment.unix(timetable[i+1].Start))) {
            nextEvent = timetable[i+1].Title + " - " + moment.unix(timetable[i+1].Start).format('HH:mm')
            break;
          }
      }
    }

    return (
      <View style={styles.container}>
        <Text style={{fontWeight: 'bold'}}>What's next?</Text>
        <Text>{nextEvent}</Text>
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
