import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
} from 'react-native';

import moment from 'moment'
import api from './api.js'
import sharedApi from './sharedApi.js'
import localTimetableCache from './timetableComponents/localTimetableCache.js'

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
    localTimetableCache.getCache().then(function (result) {
      self.setState({loaded: true, data: result})
    })

    api('timetable', [
      {key: "includeBlanks", value: "false"},
      {key: "start", value: moment().startOf('day').startOf('isoweek').unix()},
      {key: "end", value: moment().endOf('day').endOf('isoweek').unix()}
    ]).then(function (result) {
      sharedApi.updateCurrentShared(result)
      localTimetableCache.saveCache(result)
      self.setState({loaded: true, data: result})
    }).catch(function (error) {
      console.log(error)
    })
  }

  render() {
    if (!this.state.loaded) return (<View />)

    var nextEvent = {Type: "unknown"};

    var timetable = this.state.data.timetable
    if (timetable.length === 0) return (<View />)

    var now = moment()

    for (var i = 0; i < timetable.length; i++) {

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

    return (
      <View style={styles.container}>
        <Text style={{fontWeight: 'bold'}}>What's next?</Text>
        {nextEvent.type != "unknown" && <View style={{
          backgroundColor: nextEvent.Color,
          height: 3}}
        />}
        <Text>{nextEvent.Type != "unknown" && nextEvent.Title + " - "
          + moment.unix(nextEvent.Start).fromNow()}</Text>
        <Text>{nextEvent.Type != "unknown" && nextEvent.Staff}</Text>
        <Text>{moment.unix(nextEvent.Start).format('dddd, HH:mm A') + " - "}
          {moment.unix(nextEvent.End).format('HH:mm A')} : {nextEvent.Room}</Text>
        {this.state.data.isCached && <Text>Using cached data</Text>}
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
