import React, { Component } from 'react';
import {
  ListView
} from 'react-native';
import {App, Query, Save} from 'parse-lite';

import ItemManager from './ItemManager';

const app = new App({
  host: '', // The path to your Parse Server
  applicationId: '', // Your Application ID
});

export default class RemoteData extends Component {
  constructor() {
    super();

    this.state = {
      rawData: [],
      dataSource: undefined,
      refreshing: false,
    };
    this.refresh = this.refresh.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  componentWillMount() {
    this.refresh();
  }

  refresh() {
    this.setState({refreshing: true});
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const q = Query.find(app, 'ListItem', Query.emptyQuery()).then((items) => {
      this.setState({
        rawData: items,
        dataSource: ds.cloneWithRows(items),
        refreshing: false,
      });
    });
  }

  addItem(value) {
    const ds = this.state.dataSource ||
      new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const obj = {text: value};
    const rawData = this.state.rawData.concat(obj);
    this.setState({
      rawData: rawData,
      dataSource: ds.cloneWithRows(rawData),
    });
    Save(app, 'ListItem', obj).then((o) => {
      const savedData = rawData.map((d) => d === obj ? o : d);
      this.setState({
        rawData: savedData,
        dataSource: ds.cloneWithRows(savedData),
      });
    });
  }

  render() {
    return (
      <ItemManager
        dataSource={this.state.dataSource}
        refreshing={this.state.refreshing}
        refresh={this.refresh}
        addItem={this.addItem}
      />
    );
  }
}
