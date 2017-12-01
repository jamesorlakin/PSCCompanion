import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
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
    if (this.props.welcome) return (
      <View style={styles.welcomeContainer}>
        <Text style={{fontWeight: 'bold'}}>Latest student notice:</Text>
        {this.state.notices.length > 0 ? <NoticeElement notice={this.state.notices[0]} />
          : <ActivityIndicator />}
      </View>
    )

    return (
      <View style={styles.container}>
        <Text style={{fontSize: 30, textDecorationLine: 'underline'}}>Student notices:</Text>
        <ScrollView>
          {this.state.notices.length === 0 && <ActivityIndicator />}
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
        <Text style={{fontWeight: 'normal'}}> ({props.notice.date.fromNow()})</Text>
      </Text>
      <HTMLView value={props.notice.body} />
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
    marginBottom: 20
  }
});
