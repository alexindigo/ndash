import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';

export default class ScrollViewAndroid extends ScrollView {

  state = {
    enableScrollViewScroll: true
  }

  disableScroll(disable) {
    this.setState({enableScrollViewScroll: !disable});
  }

  render() {
    return (
      <View
        style={{flex: 1}}
        onStartShouldSetResponderCapture={() => this.disableScroll(false)}
        >
        <ScrollView
          {...this.props}
          scrollEnabled={this.state.enableScrollViewScroll}
          />
      </View>
    );
  }
}
