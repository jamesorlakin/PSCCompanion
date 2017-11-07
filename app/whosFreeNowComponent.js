import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  ActivityIndicator,
  Picker,
  StyleSheet,
} from 'react-native';

import moment from 'moment'

export default class WhosFreeNow extends Component {
  constructor() {
    super();
    this.state = {
      enrolled: false,
      savedPins: [],
      period: 0
    }
    this.changePeriod = this.changePeriod.bind(this)
  }

  // I've added 5 minutes to each period to ensure we're not on a boundary.
  periodTimes = [
    moment(),
    moment().hour(8).minute(35),
    moment().hour(9).minute(30),
    moment().hour(10).minute(25),
    moment().hour(10).minute(45),
    moment().hour(11).minute(40),
    moment().hour(12).minute(35),
    moment().hour(13).minute(5),
    moment().hour(13).minute(55),
    moment().hour(14).minute(50),
    moment().hour(15).minute(45)
  ]

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('sharedPinAndKey').then(function (data) {
      if (data === null) {
        self.setState({enrolled: false})
      } else {
        var data = JSON.parse(data);
        self.setState({enrolled: true, pinAndKey: data})
        AsyncStorage.getItem('sharedSavedPins').then(function (pinData) {
          if (pinData !== null) {
            var pins = JSON.parse(pinData);
            pins.unshift({name: "Me", pin: data.pin})
            self.setState({savedPins: pins})
          }
        })
      }
    })
  }

  changePeriod(index, value) {
    this.setState({period: value})
  }

  render() {
    var self = this;
    if (!this.state.enrolled || this.state.savedPins.length === 0) return (<View />)

    return (
      <View style={[styles.container, {marginBottom: 20}]}>
        <Text style={{fontWeight: 'bold'}}>Who's free?</Text>
        <Picker selectedValue={this.state.period}
          onValueChange={this.changePeriod}
          mode="dropdown">
          <Picker.Item label={"Now - " + this.periodTimes[0].format('HH:mm')} value={0} />
          <Picker.Item label="Lesson 1 - 8:30 - 9:25" value={1} />
          <Picker.Item label="Lesson 2 - 9:25 - 10:20" value={2} />
          <Picker.Item label="Break - 10:20 - 10:40" value={3} />
          <Picker.Item label="Lesson 3 - 10:40 - 11:35" value={4} />
          <Picker.Item label="Lesson 4 - 11:35 - 12:30" value={5} />
          <Picker.Item label="Tutor - 12:30 - 13:00" value={6} />
          <Picker.Item label="Lunch - 13:00 - 13:50" value={7} />
          <Picker.Item label="Lesson 6 - 13:50 - 14:45" value={8} />
          <Picker.Item label="Lesson 7 - 14:45 - 15:40" value={9} />
          <Picker.Item label="Lesson 8 - 15:40 - 16:35" value={10} />
        </Picker>
        {this.state.savedPins.map(function (pin) {
          return (<Individual key={pin.pin} now={self.periodTimes[self.state.period]} pin={pin} />)
        })}
      </View>
    );
  }
}

class Individual extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      data: null
    }
  }

  componentDidMount() {
    var self = this;
    fetch("https://gateway.jameslakin.co.uk/psc/api/fetch?pin=" + this.props.pin.pin +
    "&startOfWeek=" + moment().startOf('day').startOf('isoweek').unix()).then(function (data) {
      return data.json()
    }).then(function (results) {
      self.setState({loaded: true, data: results[0]})
    }).catch(function (error) {
      console.log(error)
    })
  }

  render() {
    var currentEvent = false;

    if (this.state.data !== null) {
      var timetable = JSON.parse(JSON.parse(this.state.data.data)).timetable
      var now = this.props.now

      // Add the difference in unix time if we're out by a week:
      var addTime = moment().startOf('day').startOf('isoweek').unix()
        - moment.unix(timetable[0].Start).startOf('day').startOf('isoweek').unix()

      for (var i = 0; i < timetable.length; i++) {
        timetable[i].Start += addTime;
        timetable[i].End += addTime;

        if (now.isAfter(moment.unix(timetable[i].Start))
          && now.isBefore(moment.unix(timetable[i].End))) {
            currentEvent = timetable[i];
            break;
          }
      }
    }

    return (
      <View style={{flexDirection: 'row', borderWidth: 1, padding: 2}}>
        <Text style={{flex: 1}}>{this.props.pin.name}</Text>
        {this.state.loaded &&
          ((this.state.data.startOfWeek !== moment().startOf('day').startOf('isoweek').unix())
          && <Text style={{flex: 1}}>Outdated</Text>)}
        {this.state.loaded ? (currentEvent === false ? <Free />
          : <Occupied event={currentEvent}/>)
          : <ActivityIndicator style={{flex: 1}} />}
      </View>
    );
  }

}

function Free() {
  return (
    <Text style={{color: 'green', fontWeight: 'bold'}}>Free</Text>
  )
}

function Occupied(props) {
  if (props.event.IsCancelled) {
    return (
      <View>
        <Free />
        <Text style={{color: 'red', fontStyle: 'italic'}}>(Lesson cancelled)</Text>
      </View>
    )
  }
  return (
    <Text style={{color: 'red'}}>Busy</Text>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 5,
    borderRadius: 1,
    padding: 4
  },
});
