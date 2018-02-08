import React, { Component } from 'react'
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  InteractionManager,
  Image,
} from 'react-native';

import cheerio from 'react-native-cheerio'
import HTMLView from 'react-native-htmlview'
import moment from 'moment'
import { Fetching, commonStyles } from '../commonComponents.js'

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

  constructor(props) {
    super(props);
    this.state = {
      notices: []
    }
    this.fetchNotices = this.fetchNotices.bind(this)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(this.fetchNotices)
  }

  async fetchNotices() {
    var page = await (await fetch("https://intranet.psc.ac.uk/news/browser.php")).text();
    var document = cheerio.load(page);
    var notices = [];

    document("div[id='report-wide'] > ul > li").each(function(item) {
      var newNotice = {}
      newNotice.title = document(this).find("h4").text()
      newNotice.date = moment(document(this).find(".posted").text().substr(8), "DD/MM/YY HH:mm")

      document(document(this).find("h4")).remove()
      document(document(this).find(".posted")).remove()
      newNotice.body = document(this).html()
      newNotice.body = newNotice.body.substr(16, newNotice.body.length)

      notices.push(newNotice)
    });

    this.setState({notices: notices});
  }

  render() {
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
    );
  }
}

function NoticeElement(props) {
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
