import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  Modal,
  Button,
  AsyncStorage,
  StyleSheet,
} from 'react-native';

import NewEvent from '../customEvents/newEventComponent.js';

export default class CustomEventsScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Custom Events'
  }

  constructor(props) {
    super(props);
    this.state = {
      events: [],
      adding: false,
    }
    this.loadEvents = this.loadEvents.bind(this);
  }

  componentDidMount() {
    this.loadEvents();
  }

  loadEvents() {
    var self = this;
    AsyncStorage.getItem('customEvents').then(function (storedEvents) {
      if (storedEvents !== null) {
        self.setState({events: JSON.parse(storedEvents), adding: false});
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}} >
          <Text style={{flex: 1}}>You can now add events to show on your
            timetable. How cool is that?</Text>
          <Button title="Add"
            onPress={() => {this.setState({adding: true})}}
            style={{flex: 1}} />
        </View>

        {this.state.adding && <Modal onRequestClose={() => {this.setState({adding: false})}}
          transparent={true}>
          <NewEvent onNewEvent={this.loadEvents} />
        </Modal>}

        <Text>{this.state.events.length}</Text>
        {this.state.events.map(function (event) {
          return <CustomEvent key={event.Start} />
        })}
      </View>
    );
  }
}

class CustomEvent extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{JSON.stringify(this.props)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
});
