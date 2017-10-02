import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  ScrollView,
  Picker,
  Dimensions,
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
      day: 0,
      pinAndKey: null
    }
    this.changeDay = this.changeDay.bind(this)
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

  changeDay(index, value) {
    this.setState({day: value})
  }

  render() {
    var self = this;
    if (this.state.enrolled) return (
      <View style={styles.container}>
        <Text style={{fontSize: 18}}>Your PIN is {this.state.pinAndKey.pin}.</Text>
        <Picker selectedValue={this.state.day} onValueChange={this.changeDay}>
          <Picker.Item label="Monday" value={0} />
          <Picker.Item label="Tuesday" value={1} />
          <Picker.Item label="Wednesday" value={2} />
          <Picker.Item label="Thursday" value={3} />
          <Picker.Item label="Friday" value={4} />
        </Picker>
        <ScrollView horizontal={true}>
          {this.state.savedPins.length === 0 && <Text>No PINs added!</Text>}
          <ExternalTimetable pin={{pin: this.state.pinAndKey.pin, name: "Me"}}
          key={this.state.pinAndKey.pin}
          day={self.state.day}/>
          {this.state.savedPins.map(function (pin) {
            console.log(pin);
            return (<ExternalTimetable pin={pin}
              key={pin.pin}
              day={self.state.day} />)
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
      data: {},
      error: null,
    }
  }

  componentDidMount() {
    var self = this;
    fetch("https://gateway.jameslakin.co.uk/psc/api/fetch?pin=" + this.props.pin.pin +
    "&startOfWeek=" + moment().startOf('day').startOf('week')
    .unix()).then(function (data) {
      return data.json();
    }).then(function (results) {
      self.setState({loaded: true, data: results[0]})
    }).catch(function (error) {
      self.setState({error: error})
    })
  }

  render() {
    if (this.state.loaded && this.state.data === undefined) {
      return (
        <View style={styles.container}>
          <Text style={{fontSize: 17}}>{this.props.pin.name} ({this.props.pin.pin})</Text>
          <Text style={{width: Dimensions.get('window').width*0.8}}>No timetable
            data was returned after executing a network request for this user.</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Text style={{fontSize: 17, marginBottom: 4}}>{this.props.pin.name} ({this.props.pin.pin})</Text>
         {this.state.error && <Text>{this.state.error.toString()}</Text>}
         {this.state.loaded ? <Timetable data={JSON.parse(JSON.parse(this.state.data.data))} day={this.props.day} />
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
