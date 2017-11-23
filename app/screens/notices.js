import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
} from 'react-native';

import cheerio from 'react-native-cheerio';
import HTMLView from 'react-native-htmlview';
import moment from 'moment';

export default class StudentNoticesScreen extends Component {
  static navigationOptions = {
    drawerLabel: 'Student Notices'
  }

  constructor(props) {
    super(props);
    this.state = {
      notices: []
    }
    this.fetchNotices = this.fetchNotices.bind(this)
  }

  componentDidMount() {
    this.fetchNotices()
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
      <View style={styles.container}>
        <Text style={{fontSize: 30, textDecorationLine: 'underline'}}>Student notices:</Text>
        <ScrollView>
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
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>{props.notice.title}</Text>
      <Text style={{fontSize: 20}}>{props.notice.date.fromNow()}</Text>
      <HTMLView value={props.notice.body} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
  },
});
