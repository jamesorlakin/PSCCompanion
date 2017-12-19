import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import moment from 'moment'
import api from './api.js'
import sharedApi from './sharedApi.js'
import localTimetableCache from './timetableComponents/localTimetableCache.js'
import Timeline from 'react-native-timeline-listview'

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
      self.setState({loaded: true, data: result})
      sharedApi.updateCurrentShared(result)
      localTimetableCache.saveCache(result)
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
      <View>
        <View style={styles.container}>

          <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
            <Text style={{fontWeight: 'bold'}}>What's next?</Text>
            {this.state.data.isCached && <View style={{flexDirection: 'row'}}>
              <Text style={{fontStyle: 'italic'}}>Updating </Text>
              <ActivityIndicator />
            </View>}
          </View>

          <SummaryEvent event={nextEvent} />
        </View>

        <Abnormalities events={this.state.data.timetable}/>

        {this.state.data.clashing.length > 0 &&
          <ClashingLessons events={this.state.data.clashing} />}
        {this.state.data.floating.length > 0 &&
          <FloatingLessons events={this.state.data.floating} />}

        <TodayTimeline events={this.state.data.timetable} />
      </View>
    );
  }
}

function ClashingLessons(props) {
  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold'}}>Clashing lessons:</Text>
      {props.events.map(function (event) {
        return <SummaryEvent event={event} key={event.Title+event.Start}/>
      })}
    </View>
  )
}

function FloatingLessons(props) {
  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold'}}>Floating lessons:</Text>
      <Text>Floating lessons don't have an exact time. However, the time given
        should refer to the week of the lesson.
      </Text>
      {props.events.map(function (event) {
        return <SummaryEvent event={event} key={event.Title+event.Start}/>
      })}
    </View>
  )
}

function SummaryEvent(props) {
  if (props.event.Type === "unknown") return (<Text>Unknown</Text>)
  return (
    <View>
      <View style={{
        backgroundColor: props.event.Color,
        height: 3}}
      />
      <Text>{props.event.IsCancelled && <Text style={{color: 'red'}}>(Cancelled) </Text>}
        {props.event.Title + " - " + moment.unix(props.event.Start).fromNow()}</Text>
      <Text>{props.event.Staff}</Text>
      <Text>{moment.unix(props.event.Start).format('dddd, HH:mm A') + " - "}
        {moment.unix(props.event.End).format('HH:mm A')} : {props.event.Room}</Text>
      {props.event.IsRoomChange && <Text style={{color: 'red'}}>Room change!</Text>}
    </View>
  )
}

function TodayTimeline(props) {
  var today = moment().day();
  var events = props.events.filter(function (event) {
    if (event.IsCancelled) return false;
    if (moment.unix(event.Start).day() === today) return true;
    return false;
  })

  if (events.length === 0) return (<View/>)

  events = events.map(function (event) {
    return {
      time: moment.unix(event.Start).format('HH:mm'),
      title: event.Title,
      description: event.Staff + " - " + event.Room,
      dotColor: event.Color
    }
  })

  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold'}}>What's today?</Text>
      <View style={{height: 3}}/>
      <Timeline data={events} lineColor="#36648B" circleColor="#36648B" innerCircle='dot' />
    </View>
  )
}

function Abnormalities(props) {
  var events = props.events.filter(function (event) {
    if (event.IsCancelled || event.IsRoomChange) return true;
    return false;
  })

  if (events.length === 0) return (<View/>);
  return (
    <View style={styles.container}>
      <Text style={{fontWeight: 'bold'}}>Cancelled or moved lessons:</Text>
      {events.map(function (event) {
        return <SummaryEvent event={event} key={event.Title+event.Start} />
      })}
    </View>
  )
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
