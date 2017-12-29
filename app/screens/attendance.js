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
  Modal,
  TouchableHighlight,
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
      error: false,
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
        switch (newItem.State) {
          case 'Present':
            newItem.Color = 'green'
            break;
          case 'Unknown':
            newItem.Color = 'gray'
            break;
          case 'Not Required':
            newItem.Color = 'blue'
            break;
          case 'Lesson Cancelled':
            newItem.Color = 'blue'
            break;
          default:
            newItem.Color = 'red'
        }
        newItem.Title = cell[1]
        newItem.Staff = cell[2]
        newItem.Time = cell[3] + " " + cell[4].split(" to ")[0]
        //newItem.raw = tableCell

        attendance.items.push(newItem)
      });
      attendance.percentage = document("table[id='MarksGrid'] > tbody > tr > td[class='bold percentage']").text()

      if (attendance.items.length === 0) return false
      this.setState({attendance: attendance, loaded: true})
    } catch (e) {
      this.setState({error: e})
    }
  }

  render() {
    if (this.props.welcome) return (
      <View style={styles.welcomeContainer}>
        <Text style={{fontWeight: 'bold'}}>Recent attendance percentage:</Text>
        {this.state.loaded ? <AttendanceProgress attendance={this.state.attendance} />
          : <Fetching />}
        {this.state.error && <Text>An error occurred, for this feature to work
          you must sign into the Student Intranet within the app.</Text>}
      </View>
    )

    if (!this.state.loaded) return (<Fetching style={styles.container} />)

    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>Heads up! This feature is largely undeveloped and won't really be
            improved further. It uses hacky web scraping from the intranet and is
            a pain to build. Feel free to improve on attendance.js and
            send me a pull request if you're keen for this to work better.
          </Text>
          <AttendanceProgress attendance={this.state.attendance} />
          <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap', alignContent: 'space-between'}}>
            {this.state.attendance.items.map(function (item) {
              return <AttendanceItem key={item.Time} item={item}/>
            })}
          </View>
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

class AttendanceItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({expanded: true})
  }

  closeModal() {
    this.setState({expanded: false})
  }

  render() {
    var item = this.props.item
    return (
      <TouchableHighlight onPress={this.openModal}>
        <View
          style={{width: 30,
            height: 30,
            backgroundColor: item.Color,
            borderWidth: 1
          }}
        >
          <AttendanceExpanded
            item={item}
            expanded={this.state.expanded}
            close={this.closeModal}
          />
        </View>
      </TouchableHighlight>
    )
  }
}

function AttendanceExpanded(props) {
  var rows = []

  return (
    <Modal visible={props.expanded} onRequestClose={props.close}>
      <Text>{JSON.stringify(props.item)}</Text>
    </Modal>
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
