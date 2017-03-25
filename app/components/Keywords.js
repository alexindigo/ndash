import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { combine } from '../helpers/styles';

export default class Keywords extends Component {

  renderKeywords() {
    if (!this.props.keywords) {
      return null;
    }

    return React.Children.toArray(this.props.keywords).map((word, i) => {
      return (
        <Text
          key={'keyword_' + i}
          style={this.props.wordStyle}
          >{word}</Text>
      );
    });
  }

  render() {
    return (
      <View
        style={this.props.style}
        >
        { this.renderKeywords() }
      </View>
    );
  }
}
