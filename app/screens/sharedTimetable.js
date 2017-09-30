import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import Timetable from '../timetableComponents/timetableHost.js';
import moment from 'moment';

export default class SharedTimetableScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Shared timetable'
  }

  constructor() {
    super();
    this.state = {
      enrolled: false,
      savedPins: [],
      week: 0,
      day: 0,
      pinAndKey: null
    }
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('sharedPinAndKey').then(function (data) {
      if (data === null) {
        self.setState({enrolled: false})
      } else {
        self.setState({enrolled: true, pinAndKey: JSON.parse(data)})
      }
    })
    AsyncStorage.getItem('sharedSavedPins').then(function (data) {
      if (data !== null) {
        self.setState({savedPins: JSON.parse(data)})
      }
    })
  }

  render() {
    if (this.state.enrolled) return (
      <View style={styles.container}>
        <Text style={{fontSize: 18}}>Your PIN is {this.state.pinAndKey.pin}.</Text>
        <ScrollView horizontal={true}>
        {this.state.savedPins.length === 0 && <Text>No PINs added!</Text>}
        {this.state.savedPins.map(function (pin) {
          return (<ExternalTimetable pin={pin}
            key={pin}
            day={this.state.day}
            week={this.state.week} />)
        })}
        </ScrollView>
      </View>
    );

    return (
      <View style={styles.container}>
        <Text style={{fontSize: 18}}>You can now share your timetable with others!</Text>
        <Text>At present you are not currently enrolled, but may do so in the
          settings menu. This is a one click process that will give you a pin
          to share with anyone you wish. Note that timetable data is stored by me
          for this function to work somewhat efficiently and without compromising
          your college tokens.</Text>
      </View>
    );
  }
}

class ExternalTimetable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: null,
      error: null,
    }
  }

  componentDidMount() {
    var self = this;
    fetch("https://gateway.jameslakin.co.uk/psc/api/fetch?pin=" + this.props.pin +
    "&startOfWeek=" + moment().startOf('day').startOf('week')
    .add(this.props.week, 'weeks').unix()).then(function (data) {
      return data.json();
    }).then(function (results) {
      self.setState({loaded: true, data: results[0]})
    }).catch(function (error) {
      self.setState({error: error})
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>PIN {this.props.pin}</Text>
         {this.state.error && <Text>{this.state.error.toString()}</Text>}
         {this.state.loaded ? <Timetable data={JSON.parse(JSON.parse(this.state.data.data))} />
          : <ActivityIndicator />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8
  },
});
