import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';

import moment from 'moment'

export default class TimetableDay extends Component {
  eventElement(data) {
    if (data.item.Type === "studyperiod") return (
      <View>
        <Text style={styles.italic}>Free</Text>
        <Text>{moment.unix(data.item.Start).format('LT')}</Text>
      </View>
    )

    return (
      <View>
        <Text style={styles.bold}>{data.item.Title}</Text>
        <Text>{moment.unix(data.item.Start).format('LT')} - {moment.unix(data.item.End).format('LT')} : {data.item.Room}</Text>
        {data.item.Staff !== "" && <Text>{data.item.Staff}</Text>}
      </View>
    )
  }

  render() {
    return (
      <FlatList
        width={this.props.dayWidth}
        data={this.props.data}
        ListHeaderComponent={<Text style={styles.boldTitleUnderline}>{moment.unix(this.props.day).format('dddd - Do')}</Text>}
        renderItem={this.eventElement} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  },
  title: {
    fontSize: 17
  },
  boldTitleUnderline: {
    fontSize: 17,
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  }
});
