import React, { Component } from 'react';
import { ScrollView } from 'react-native';

export default class ScrollViewIos extends ScrollView {
  render() {
    return (
      <ScrollView
        {...this.props}
        />
    );
  }
}
