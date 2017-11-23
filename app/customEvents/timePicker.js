import React, { Component } from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
} from 'react-native';

import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default class TimePicker extends Component {
  constructor() {
    super();
    this.state = {
      time: new Date(),
      open: false
    }
    this.changeTime = this.changeTime.bind(this);
  }

  changeTime(time) {
    var newState = {time: time};
    this.setState(newState);
    this.props.onTimePicked(time);
  }

  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={{flex: 1, fontSize: 25}}>
          {moment(this.state.time).format('HH:mm')}
        </Text>
        <Button title="Set" onPress={() => this.setState({open: !this.state.open})} />
        <DateTimePicker
          isVisible={this.state.open}
          onConfirm={this.changeTime}
          onCancel={() => this.setState({open: !this.state.open})}
          mode="time"
        />
      </View>
    );
  }
}
