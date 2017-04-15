import React, { Component } from 'react';
import { ListView, View } from 'react-native';

export default class ListViewAndroid extends ListView {
  render() {
    return (
      <View
        style={{flex: 1}}
        onStartShouldSetResponderCapture={() => this.props.sceneScrollView && this.props.sceneScrollView.disableScroll(true)}
        >
        <ListView
          {...this.props}
          />
      </View>
    );
  }
}
