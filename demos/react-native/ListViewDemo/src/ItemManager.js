import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import ItemList from './ItemList';

const TopBarButton = ({children, ...other}) => (
  <TouchableHighlight {...other}>
    <View style={styles.addItem}>
      <Text style={{lineHeight: 38, fontSize: 30, color: '#FFFFFF'}}>{children}</Text>
    </View>
  </TouchableHighlight>
);

export default class ItemManager extends Component {
  constructor() {
    super();

    this.state = {
      showCreator: false,
      newItemText: '',
    };
    this.addNewItem = this.addNewItem.bind(this);
  }

  addNewItem() {
    this.props.addItem(this.state.newItemText);
    this.setState({
      showCreator: false,
      newItemText: '',
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.topbar}>
          <View style={{width: 50, height: 50}}></View>
          <Text style={styles.title}>List View Demo</Text>
          <TopBarButton
            onPress={() => this.setState({showCreator: true})}>
            {'+'}
          </TopBarButton>
        </View>
        <ItemList {...this.props} />
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={this.state.showCreator}>
          <View style={{marginTop: 20, backgroundColor: '#FFFFFF', flex: 1}}>
            <View style={styles.topbar}>
              <View style={{width: 50, height: 50}}></View>
              <Text style={styles.title}>Add Item</Text>
              <TopBarButton
                onPress={() => this.setState({showCreator: false})}>
                {'x'}
              </TopBarButton>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={{height: 60, padding: 10}}
                value={this.state.newItemText}
                onChangeText={(text) => this.setState({newItemText: text})}
                placeholder='Enter some text for your new item'
              />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableHighlight
                onPress={this.addNewItem}
                style={styles.submitButton}>
                <Text style={{color: '#FFFFFF', fontSize: 20}}>Add Item</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topbar: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#2975CB',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
  },
  addItem: {
    width: 50,
    height: 50,
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'solid',
    alignItems: 'center',
  },
  inputWrapper: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#CCCCCC',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButton: {
    width: 150,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2975CB',
  },
});
