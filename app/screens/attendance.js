import React, { Component } from 'react'
import {
  View,
  Text,
  InteractionManager,
  TouchableHighlight,
  Alert,
  TouchableOpacity
} from 'react-native'

import cheerio from 'react-native-cheerio'
import ProgressCircle from 'react-native-progress-circle'
import moment from 'moment'
import { Fetching, WelcomeBox } from '../commonComponents.js'

export default class AttendanceScreen extends Component {
  constructor (props) {
    super(props)
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

  componentDidMount () {
    InteractionManager.runAfterInteractions(this.fetchData)
  }

  async fetchData () {
    try {
      var request = await fetch('https://intranet.psc.ac.uk/records/student/attendance/marks.php', {
        credentials: 'include'
      })
      var response = await request.text()
      var document = cheerio.load(response)
      var attendance = {
        weeks: [],
        items: [],
        percentage: 0
      }

      document("table[id='MarksGrid'] > tbody > tr > td > a > span").each(function (item) {
        try {
          var newItem = {}

          var tableCell = document(this).html()
          var cell = tableCell.replace('<strong>', '').replace('</strong>', '').split(/<br>/)
          if (tableCell.indexOf('<strong>') === 0) cell.unshift('Unknown')

          newItem.State = cell[0]
          switch (newItem.State) {
            case 'Present':
              newItem.Color = 'green'
              break
            case 'Unknown':
              newItem.Color = 'gray'
              break
            case 'Not Required':
              newItem.Color = 'cornflowerblue'
              break
            case 'Lesson Cancelled':
              newItem.Color = 'cornflowerblue'
              break
            case 'Late':
              newItem.Color = 'yellow'
              break
            default:
              newItem.Color = 'red'
          }
          newItem.Title = cell[1]
          newItem.Staff = cell[2]
          newItem.Time = cell[3] + ' ' + cell[4].split(' to ')[0]
          newItem.moment = moment(newItem.Time, 'DD MMM YYYY h:mma')

          attendance.items.push(newItem)

          var newItemWeek = newItem.moment.isoWeek()
          if (attendance.weeks[newItemWeek] === undefined) {
            attendance.weeks[newItemWeek] = {
              weekNumber: newItemWeek,
              startOfWeek: newItem.moment.clone().startOf('isoweek').format('Do MMMM YYYY'),
              items: []
            }
          }
          attendance.weeks[newItemWeek].items.push(newItem)
        } catch (e) {
          // If the cell has an unexpected markup, catch the error.
          console.warn(e)
        }
      })

      attendance.percentage = document("table[id='MarksGrid'] > tbody > tr > td[class='bold percentage']").text()

      if (attendance.items.length === 0) throw new Error('No items')
      this.setState({attendance: attendance, loaded: true})
    } catch (e) {
      this.setState({error: e})
    }
  }

  render () {
    return (
      <WelcomeBox title='Recent attendance percentage:'>
        {this.state.loaded ? <View>
          <AttendanceProgress attendance={this.state.attendance} />
          <AttendanceSelector attendance={this.state.attendance} />
        </View>
          : !this.state.error && <Fetching />}
        {this.state.error && <Text>For the attendance feature to work,
        you must sign into the Student Intranet within the app. This relies
        upon scraping the Intranet, and so might not work perfectly. If you
        configure your college username and password in the settings menu,
        you'll be able to see print credit below too.</Text>}
      </WelcomeBox>
    )
  }
}

class AttendanceSelector extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showAllWeeks: false
    }
    this.toggleShow = this.toggleShow.bind(this)
  }

  toggleShow () {
    this.setState({showAllWeeks: true})
  }

  render () {
    return (
      <View>
        <Text style={{fontWeight: 'bold'}}>{this.state.showAllWeeks ? 'Recent attendance:' : 'This week\'s events:'}</Text>
        {this.state.showAllWeeks ? <AllWeeks attendance={this.props.attendance} /> : <RecentAttendance attendance={this.props.attendance} />}
        {!this.state.showAllWeeks && <TouchableOpacity onPress={this.toggleShow} style={{flex: 1}} >
          <Text style={{color: 'blue', textAlign: 'center'}}>Show more</Text>
        </TouchableOpacity>}
      </View>
    )
  }
}

function AttendanceProgress (props) {
  return (
    <View style={{alignItems: 'center'}}>
      <ProgressCircle
        percent={parseInt(props.attendance.percentage)}
        radius={50}
        borderWidth={8}
        color='#1CAD4A'
        shadowColor='#E83131'
        bgColor='#fff'
      >
        <Text style={{fontSize: 18}}>{props.attendance.percentage}%</Text>
      </ProgressCircle>
    </View>
  )
}

function RecentAttendance (props) {
  var today = moment().startOf('isoweek')
  var endToday = moment().endOf('isoweek')
  var todayItems = []
  var items = props.attendance.items
  for (var i = 0; i < items.length; i++) {
    if (items[i].moment.isBetween(today, endToday)) todayItems.push(items[i])
    if (items[i].moment.isAfter(endToday)) break
  }
  if (todayItems.length === 0) return null
  return (
    <View>
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

function AllWeeks (props) {
  return (
    <View>
      {props.attendance.weeks.map(function (week) {
        return <Week key={week.weekNumber} week={week} />
      })}
    </View>
  )
}

function Week (props) {
  return (
    <View>
      <Text>Week beginning {props.week.startOfWeek}</Text>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {props.week.items.map(function (item) {
          return <AttendanceItem key={item.Time} item={item} />
        })}
      </View>
    </View>
  )
}

class AttendanceItem extends React.Component {
  constructor (props) {
    super(props)
    this.showInfo = this.showInfo.bind(this)
  }

  showInfo () {
    var text = this.props.item.State + '\n' +
      this.props.item.Staff + '\n' +
      this.props.item.moment.format('lll')
    Alert.alert(this.props.item.Title, text)
  }

  render () {
    var item = this.props.item
    return (
      <View>
        <TouchableHighlight onPress={this.showInfo}>
          <View style={{width: 45,
            height: 40,
            backgroundColor: item.Color,
            borderWidth: 1,
            justifyContent: 'center'
          }}>
            <Text style={{
              textAlign: 'center',
              fontSize: 8,
              color: 'black'
            }}>{item.Title}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}
