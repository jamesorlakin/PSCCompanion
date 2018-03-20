import React, { Component } from 'react'
import {
  View,
  Text,
  ActivityIndicator,
  LayoutAnimation
} from 'react-native'

import moment from 'moment'
import api from './api.js'
import sharedApi from './sharedApi.js'
import localTimetableCache from './timetableComponents/localTimetableCache.js'
import Timeline from 'react-native-timeline-listview'
import { WelcomeBox } from './commonComponents.js'

export default class Summary extends Component {
  constructor() {
    super()
    this.state = {
      loaded: false,
      data: null,
    }
  }

  componentDidMount() {
    var self = this
    localTimetableCache.getCache().then(function (result) {
      self.setState({loaded: true, data: result})
    })

    api('timetable', [
      {key: "includeBlanks", value: "false"},
      {key: "start", value: moment().startOf('day').startOf('isoweek').unix()},
      {key: "end", value: moment().endOf('day').endOf('isoweek').unix()}
    ]).then(function (result) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      self.setState({loaded: true, data: result})
      sharedApi.updateCurrentShared(result)
      localTimetableCache.saveCache(result)
    }).catch(function (error) {
      console.log(error)
    })
  }

  render() {
    if (!this.state.loaded) return null

    var nextEvent = {Type: "unknown"}

    var timetable = this.state.data.timetable
    if (timetable.length === 0) return null

    var now = moment()

    for (var i = 0; i < timetable.length; i++) {
      if (now.isBefore(moment.unix(timetable[i].Start)) && !timetable[i].IsCancelled) {
        nextEvent = timetable[i]
        break
      }

      if (i+1 === timetable.length) {
        // Use the first event and add a week
        timetable[0].Start += 604800
        timetable[0].End += 604800
        nextEvent = timetable[0]
      }
    }

    return (
      <View>
        <TodayTimeline events={this.state.data.timetable} isCached={this.state.data.isCached}/>

        <Abnormalities events={this.state.data.timetable}/>

        {this.state.data.clashing.length > 0 &&
          <ClashingLessons events={this.state.data.clashing} />}
        {this.state.data.floating.length > 0 &&
          <FloatingLessons events={this.state.data.floating} />}
      </View>
    );
  }
}

function ClashingLessons(props) {
  return (
    <WelcomeBox title="Clashing lessons:">
      {props.events.map(function (event) {
        return <SummaryEvent event={event} key={event.Title+event.Start}/>
      })}
    </WelcomeBox>
  )
}

function FloatingLessons(props) {
  return (
    <WelcomeBox title="Floating lessons:">
      <Text>Floating lessons don't have an exact time. However, the time given
        should refer to the week of the lesson.
      </Text>
      {props.events.map(function (event) {
        return <SummaryEvent event={event} key={event.Title+event.Start}/>
      })}
    </WelcomeBox>
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

  if (events.length === 0) return null

  events = events.map(function (event) {
    return {
      time: moment.unix(event.Start).format('HH:mm'),
      title: event.Title,
      description: event.Staff + " - " + event.Room,
      circleColor: event.Color
    }
  })

  return (
    <WelcomeBox title="What's today?">
      {props.isCached && <View style={{flexDirection: 'row'}}>
        <Text style={{fontStyle: 'italic'}}>Updating </Text>
        <ActivityIndicator />
      </View>}
      <View style={{height: 3}}/>
      <Timeline data={events} lineColor="#36648B" innerCircle='dot' />
    </WelcomeBox>
  )
}

function Abnormalities(props) {
  var events = props.events.filter(function (event) {
    if (event.IsCancelled || event.IsRoomChange) return true;
    return false;
  })

  if (events.length === 0) return (<View/>);
  return (
    <WelcomeBox title="Cancelled or moved lessons:">
      {events.map(function (event) {
        return <SummaryEvent event={event} key={event.Title+event.Start} />
      })}
    </WelcomeBox>
  )
}
