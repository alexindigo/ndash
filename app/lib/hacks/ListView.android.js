import React, { Component } from 'react';
import { ListView, View } from 'react-native';

export default class ListViewAndroid extends ListView {
  render() {

console.log('sceneScrollView.disableScroll', this.props.sceneScrollView ? this.props.sceneScrollView.disableScroll : '?-?-?-?-?-?');

    return (
      <View
        style={{flex: 1}}
        onStartShouldSetResponderCapture={
          () => {
            console.log('trying to scrolll');
            this.props.sceneScrollView &&
            this.props.sceneScrollView.disableScroll(true);
          }
        }
        >
        <ListView
          {...this.props}
          />
      </View>
    );
  }
}
