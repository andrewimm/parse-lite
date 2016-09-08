import React, { Component } from 'react';
import {
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class ItemList extends Component {
  _renderRow(
    rowData,
    sectionID,
    rowID,
    highlightRow
  ) {
    return (
      <View style={[styles.row, {backgroundColor: (rowData.objectId ? '#FFFFFF' : '#DDDDDD')}]}>
        <Text style={[styles.text, {color: (rowData.objectId ? '#000000' : '#999999')}]}>
          {rowData.text}
        </Text>
      </View>
    );
  }

  _renderSeparator(
    sectionID,
    rowID,
    adjacentRowHighlighted
  ) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{height: 1, backgroundColor: '#cccccc'}}
      />
    );
  }

  render() {
    if (!this.props.dataSource) {
      return (
        <View style={styles.container}>
          <Text style={styles.loading}>Loading...</Text>
        </View>
      );
    }
    return (
      <ListView
        style={styles.list}
        dataSource={this.props.dataSource}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeparator}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.refresh}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loading: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: 20,
  },
});
