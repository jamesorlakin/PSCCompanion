import React, { Component } from 'react'
import {
  View,
  Text,
  ScrollView,
  InteractionManager,
  Image
} from 'react-native'

import HTMLView from 'react-native-htmlview'
import { Fetching, commonStyles } from '../commonComponents.js'
import fetchNotices from '../studentNoticesApi.js'

export default class StudentNoticesScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Student Notices',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../images/menuIcons/notices.png')}
        style={{width: 20, height: 20, tintColor: tintColor}}
      />
    )
  }

  constructor (props) {
    super(props)
    this.state = {
      notices: []
    }
    this.fetchNotices = this.fetchNotices.bind(this)
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(this.fetchNotices)
  }

  async fetchNotices () {
    var notices = await fetchNotices()
    this.setState({notices: notices})
  }

  render () {
    return (
      <View style={commonStyles.screenContainer}>
        <Text style={{fontSize: 30, textDecorationLine: 'underline'}}>Student notices:</Text>
        <ScrollView>
          {this.state.notices.length === 0 && <Fetching />}
          {this.state.notices.map(function (notice) {
            return <NoticeElement key={notice.title} notice={notice} />
          })}
        </ScrollView>
      </View>
    )
  }
}

function NoticeElement (props) {
  return (
    <View>
      <View style={{backgroundColor: '#36648B', height: 3}} />
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>
        {props.notice.title}
      </Text>
      <Text style={{fontStyle: 'italic'}}>
        (
        {props.notice.date.fromNow()}, {props.notice.date.format('DD/mm/YY HH:mm')}
        )
      </Text>
      <HTMLView value={props.notice.body} />
    </View>
  )
}
