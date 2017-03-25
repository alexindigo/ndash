import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { combine } from '../helpers/styles';

export default class ContentBlock extends Component {

  render() {

    const stylesContainer = combine(this.props.style, localStyles.container);

    return (
      <View
        style={stylesContainer}
        >
        {this.props.children}
      </View>
    );
  }
}

const localStyles = {
  container: {
    color : undefined,
    fontSize: undefined,
    fontWeight: undefined
  }
};
