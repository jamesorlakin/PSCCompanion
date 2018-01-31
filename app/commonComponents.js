import React, { Component } from 'react';
import {
  View,
  StyleSheet,
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

export function WelcomeBox(props) {
  return (
    <View style={styles.welcomeBox}>
      <Text style={{fontWeight: 'bold'}}>{props.title}</Text>
      {props.loading ? <Fetching/> : props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  welcomeBox: {
    flex: 1,
    borderWidth: 5,
    borderRadius: 1,
    padding: 4,
    marginBottom: 20,
    //minHeight: 158
  }
});
