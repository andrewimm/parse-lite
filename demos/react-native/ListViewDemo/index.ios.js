/**
 * Parse Lite + React Native demo
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import RemoteData from './src/RemoteData';

class ListViewDemo extends Component {
  render() {
    return (
      <View style={styles.container}>
        <RemoteData />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('ListViewDemo', () => ListViewDemo);
