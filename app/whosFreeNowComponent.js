import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import moment from 'moment'

export default class WhosFreeNow extends Component {
  constructor() {
    super();
    this.state = {
      enrolled: false,
      savedPins: []
    }
  }

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

  render() {
    if (!this.state.enrolled || this.state.savedPins.length === 0) return (<View />)

    return (
      <View style={styles.container}>
        <Text style={{fontWeight: 'bold'}}>Who's free now?</Text>
        {this.state.savedPins.map(function (pin) {
          return (<Individual key={pin.pin} pin={pin} />)
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
    var free = false;

    if (this.state.data !== null) {
      var timetable = JSON.parse(JSON.parse(this.state.data.data)).timetable

      var now = moment()
      for (var i = 0; i < timetable.length; i++) {
        if (i === 0) {
          if (now.isBefore(moment.unix(timetable[i].Start))) free = true
        }

        if (i+1 !== timetable.length) {
          if (now.isAfter(moment.unix(timetable[i].End))
            && now.isBefore(moment.unix(timetable[i+1].Start))) {
              free = true;
              break;
            }
        }

        if (i+1 === timetable.length) {
          if (now.isAfter(moment.unix(timetable[i].End)))
            free = true;
        }

        //if (now.isAfter(moment.unix(timetable[i]).Start)
        //  && now.isBefore(moment.unix(timetable[i].End))) free = false
      }
    }

    return (
      <View style={{flexDirection: 'row', borderWidth: 1, padding: 2}}>
        <Text style={{flex: 1}}>{this.props.pin.name}</Text>
        {this.state.loaded &&
          ((this.state.data.startOfWeek !== moment().startOf('day').startOf('isoweek').unix())
          && <Text style={{flex: 1}}>Outdated - Doesn't calculate properly yet</Text>)}
        {this.state.loaded ? (free ? <Free /> : <Occupied />)
          : <ActivityIndicator style={{flex: 1}} />}
      </View>
    );
  }

}

function Free() {
  return (
    <Text style={{color: 'green'}}>Free!</Text>
  )
}

function Occupied(props) {
  return (
    <Text style={{color: 'red'}}>Occupied</Text>
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
