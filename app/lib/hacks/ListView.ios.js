import React, { Component } from 'react';
import { ListView } from 'react-native';

export default class ListViewIos extends ListView {
  render() {
    return (
      <ListView
        {...this.props}
        />
    );
  }
}
