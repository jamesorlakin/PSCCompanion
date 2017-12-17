import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  AsyncStorage,
  InteractionManager,
} from 'react-native';

import cheerio from 'react-native-cheerio';
import ProgressCircle from 'react-native-progress-circle'
import { Fetching } from '../commonComponents.js'

export default class AttendanceScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Attendance'
  }

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      attendance: {
        items: [],
        percentage: 0
      }
    }
    this.fetchData = this.fetchData.bind(this)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(this.fetchData)
  }

  async fetchData() {
    try {
      var request = await fetch('https://intranet.psc.ac.uk/records/student/attendance/marks.php', {
        credentials: 'include'
      })
      var response = await request.text()
      var document = cheerio.load(response);
      var attendance = {
        items: []
      };

      document("table[id='MarksGrid'] > tbody > tr > td > a > span").each(function(item) {
        var newItem = {}

        var tableCell = document(this).html()
        cell = tableCell.replace('<strong>', '').replace('</strong>', '').split(/<br>/)
        if (tableCell.indexOf('<strong>')===0) cell.unshift('Unknown')

        newItem.State = cell[0]
        newItem.Title = cell[1]
        newItem.Staff = cell[2]
        newItem.Time = cell[3] + " " + cell[4].split(" to ")[0]
        newItem.raw = tableCell

        attendance.items.push(newItem)
      });
      attendance.percentage = document("table[id='MarksGrid'] > tbody > tr > td[class='bold percentage']").text()

      if (attendance.items.length === 0) return false
      this.setState({attendance: attendance, loaded: true})
    } catch (e) {

    }
  }

  render() {
    if (this.props.welcome) return (
      <View style={styles.welcomeContainer}>
        <Text style={{fontWeight: 'bold'}}>Recent attendance percentage:</Text>
        {this.state.loaded ? <AttendanceProgress attendance={this.state.attendance} />
          : <Fetching />}
      </View>
    )

    if (!this.state.loaded) return (<Fetching style={styles.container} />)

    return (
      <ScrollView>
        <View style={styles.container}>
          <AttendanceProgress attendance={this.state.attendance} />
          {this.state.attendance.items.map(function (item) {
            return <AttendanceItem key={item.Time} item={item}/>
          })}
        </View>
      </ScrollView>
    );
  }
}

function AttendanceProgress(props) {
  return (
    <View style={{alignItems: 'center'}}>
      <ProgressCircle
        percent={parseInt(props.attendance.percentage)}
        radius={50}
        borderWidth={8}
        color="#1CAD4A"
        shadowColor="#E83131"
        bgColor="#fff"
      >
        <Text style={{ fontSize: 18 }}>{props.attendance.percentage}%</Text>
      </ProgressCircle>
      <Text>From {props.attendance.items[0].Time.substr(0, 6) + " to "}
        {props.attendance.items[props.attendance.items.length-1].Time.substr(0, 11)}
      </Text>
    </View>
  )
}

function AttendanceItem(props) {
  var item = props.item
  return (
    <View>
      <Text>{JSON.stringify(item)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
  welcomeContainer: {
    flex: 1,
    borderWidth: 5,
    borderRadius: 1,
    padding: 4,
    marginBottom: 20,
    height: 158
  }
});
