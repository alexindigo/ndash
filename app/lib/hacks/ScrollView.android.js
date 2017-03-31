import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';

export default class ScrollViewAndroid extends ScrollView {

  state = {
    enableScrollViewScroll: true
  }

  disableScroll(disable) {
    this.setState({enableScrollViewScroll: !disable});
console.log('trying not to scrolll', !disable);
  }
// //this.setState({ enableScrollViewScroll: true})
  render() {
console.log('+++ scrollProperties? +++', this.state.enableScrollViewScroll);
    return (
      <View
        style={{flex: 1}}
        onStartShouldSetResponderCapture={
          () => console.log('-render log-')
        }
        >
        <ScrollView
          {...this.props}
          scrollEnabled={this.state.enableScrollViewScroll}
          />
      </View>
    );
  }
}
