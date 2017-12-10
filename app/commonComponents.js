import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

export function Fetching(props) {
  return (
    <View style={[{alignItems: 'center'}, props.style]}>
      <ActivityIndicator/>
      <Text style={{fontStyle: 'italic'}}>Fetching...</Text>
    </View>
  )
}
