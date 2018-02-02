import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  AsyncStorage,
  InteractionManager,
  TouchableHighlight,
  Alert,
} from 'react-native';

import cheerio from 'react-native-cheerio'
import ProgressCircle from 'react-native-progress-circle'
import moment from 'moment'
import { Fetching, WelcomeBox } from '../commonComponents.js'

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
      }

      document("table[id='MarksGrid'] > tbody > tr > td > a > span").each(function(item) {
        try {
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
            case 'Late':
              newItem.Color = 'yellow'
              break;
            default:
              newItem.Color = 'red'
          }
          newItem.Title = cell[1]
          newItem.Staff = cell[2]
          newItem.Time = cell[3] + " " + cell[4].split(" to ")[0]
          newItem.moment = moment(newItem.Time, 'DD MMM YYYY h:mma')

          attendance.items.push(newItem)
        } catch (e) {
          // If the cell has an unexpected markup, catch the error.
          console.log(e)
        }
      });
      attendance.percentage = document("table[id='MarksGrid'] > tbody > tr > td[class='bold percentage']").text()
      console.log(attendance.percentage)

      if (attendance.items.length === 0) return false
      this.setState({attendance: attendance, loaded: true})
    } catch (e) {
      this.setState({error: e})
    }
  }

  render() {
    if (this.props.welcome) return (
      <WelcomeBox title="Recent attendance percentage:">
        {this.state.loaded ? <View>
            <AttendanceProgress attendance={this.state.attendance} />
            <RecentAttendance attendance={this.state.attendance} />
          </View>
          : <Fetching />}
        {this.state.error && <Text>An error occurred, for this feature to work
          you must sign into the Student Intranet within the app.</Text>}
      </WelcomeBox>
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
          <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
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
        <Text style={{fontSize: 18}}>{props.attendance.percentage}%</Text>
      </ProgressCircle>
      <Text>From {props.attendance.items[0].Time.substr(0, 6) + " to "}
        {props.attendance.items[props.attendance.items.length-1].Time.substr(0, 11)}
      </Text>
    </View>
  )
}

function RecentAttendance(props) {
  var today = moment().startOf('week')
  var endToday = moment().endOf('week')
  var todayItems = []
  var items = props.attendance.items
  for (var i = 0; i < items.length; i++) {
    if (items[i].moment.isBetween(today, endToday)) todayItems.push(items[i])
    if (items[i].moment.isAfter(endToday)) break
  }
  if (todayItems.length === 0) return null
  return (
    <View>
      <Text style={{fontWeight: 'bold'}}>This week's events:</Text>
      <View style={{flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {todayItems.map(function (item) {
          return <AttendanceItem item={item} key={item.Time} />
        })}
      </View>
    </View>
  )
}

class AttendanceItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    }
    this.showInfo = this.showInfo.bind(this)
  }

  showInfo() {
    var text = this.props.item.State + "\n" +
      this.props.item.Staff + "\n" +
      this.props.item.moment.format('lll')
    Alert.alert(this.props.item.Title, text)
  }

  render() {
    var item = this.props.item
    return (
      <View>
        <TouchableHighlight onPress={this.showInfo}>
          <View
            style={{width: 30,
              height: 30,
              backgroundColor: item.Color,
              borderWidth: 1
            }}
          />
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  }
});
