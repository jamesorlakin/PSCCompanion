import React, { Component } from 'react';
import {
  View,
  Text,
  Picker,
  ToastAndroid,
  ScrollView,
  StyleSheet,
} from 'react-native';

import TimePicker from './timePicker.js';
import moment from 'moment';

export default class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: moment().startOf('hour'),
      end: moment().endOf('hour'),
      day: 0,
    }
  }

  changeStart(date) {

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 20, margin: 4}}>New custom event:</Text>
        <ScrollView>

          <View style={{padding: 4}}>
            <Text>Day:</Text>
            <Picker selectedValue={this.state.day}
              onValueChange={(day) => {this.setState({day: day})}}
              mode="dropdown">
              <Picker.Item label="Monday" value={0} />
              <Picker.Item label="Tuesday" value={1} />
              <Picker.Item label="Wednesday" value={2} />
              <Picker.Item label="Thursday" value={3} />
              <Picker.Item label="Friday" value={4} />
            </Picker>
          </View>

          <View style={{padding: 4}}>
            <Text>Start time:</Text>
            <TimePicker
              onTimePicked={(time) => {this.setState({start: time})}}
            />
          </View>

          <View style={{padding: 4}}>
            <Text>End time:</Text>
            <TimePicker
              onTimePicked={(time) => {this.setState({end: time})}}
            />
          </View>

          <Text>{JSON.stringify(this.state)}</Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    margin: 40
  },
});
