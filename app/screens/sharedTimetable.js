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
import TimetableDayProgress from '../timetableComponents/timetableDayProgress.js';
import moment from 'moment';
import sharedApi from '../sharedApi.js';

var dayWidth = Dimensions.get('window').width*0.6;

var day = moment().isoWeekday()-1;
if (day > 4) day = 0;

export default class SharedTimetableScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Shared Timetable'
  }

  constructor() {
    super();
    this.state = {
      enrolled: false,
      savedPins: [],
      day: day,
      pinAndKey: null,
      scrollTo: 0
    }
    this.changeDay = this.changeDay.bind(this)
    this.onScroll = this.onScroll.bind(this);
  }

  onScroll(event) {
    this.setState({scrollTo: event.nativeEvent.contentOffset.y});
  }

  componentDidMount() {
    var self = this;
    AsyncStorage.getItem('sharedPinAndKey').then(function (data) {
      if (data === null) {
        self.setState({enrolled: false})
      } else {
        var data = JSON.parse(data);
        AsyncStorage.getItem('sharedSavedPins').then(function (pinData) {
          self.setState({enrolled: true, pinAndKey: data})
          if (pinData !== null) {
            var pins = JSON.parse(pinData);
            pins.unshift({name: "Me", pin: data.pin})
            self.setState({savedPins: pins})
          }
        })
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
        <View style={{flexDirection: 'row'}}>
          <Text style={{marginTop: 15, color: 'black'}}>Day:</Text>
          <Picker style={{flex: 1}}
            selectedValue={this.state.day}
            onValueChange={this.changeDay}
            mode="dropdown">
            <Picker.Item label="Monday" value={0} />
            <Picker.Item label="Tuesday" value={1} />
            <Picker.Item label="Wednesday" value={2} />
            <Picker.Item label="Thursday" value={3} />
            <Picker.Item label="Friday" value={4} />
          </Picker>
        </View>

        {this.state.savedPins.length === 0 && <Text style={{width: 100}}>Feeling lonely?
          You can add PINs in the settings menu to see other timetables.</Text>}

        <ScrollView horizontal={true}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <TimetableDayProgress blank />
              {this.state.savedPins.map(function (pin) {
                return (<Text
                  key={pin.pin}
                  style={{fontSize: 17,
                    marginBottom: 4,
                    textDecorationLine: 'underline',
                    width: dayWidth
                  }}>{pin.name}</Text>)
              })}
            </View>

            <ScrollView>
              <View style={{flexDirection: 'row'}}>
                <TimetableDayProgress topGap={19}/>
                {this.state.savedPins.map(function (pin) {
                  return (<ExternalTimetable pin={pin}
                    key={pin.pin}
                    day={self.state.day}
                    scrollTo={self.state.scrollTo} />)
                })}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );

    return (
      <View style={styles.container}>
        <Text style={{fontSize: 18}}>You can now share your timetable with others!</Text>
        <Text>At present you are not currently enrolled, but may do so in the
          settings menu. This is a one click process that will give you a PIN
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
    sharedApi.fetchCurrentShared(this.props.pin.pin).then(function (result) {
      self.setState({loaded: true, data: result})
    }).catch(function (error) {
      self.setState({error: error})
    })
  }

  render() {
    if (this.state.loaded && this.state.data === undefined) {
      return (
        <View style={styles.container}>
          <Text style={{width: dayWidth}}>No timetable
            data was returned after executing a network request for this user.</Text>
        </View>
      )
    }

    return (
      <View>
        {this.state.loaded && (this.state.data.isCached ?
          <Text>Warning - Using an offline version</Text> : <Text>
          {(this.state.data.startOfWeek !== moment().startOf('day').startOf('isoweek').unix())
          ? "Outdated - Using " + moment.unix(this.state.data.startOfWeek)
            .format('Do MMM') : "Up-to-date - Current week"}
        </Text>)}
        {this.state.loaded ? <Timetable data={JSON.parse(JSON.parse(this.state.data.data))}
          day={this.props.day}
          onScroll={this.props.onScroll}
          scrollTo={this.props.scrollTo} />
          : <ActivityIndicator style={{width: dayWidth}} />}
        {this.state.error && <Text>{this.state.error.toString()}</Text>}
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
