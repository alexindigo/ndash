import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { combine } from '../helpers/styles';

export default class NamedBlock extends Component {

  render() {

    const stylesContainer = combine(this.props.style, localStyles.container);
    const stylesTitle = combine(this.props.style, localStyles.title);

    return (
      <View
        style={stylesContainer}
        >
        <Text
          style={stylesTitle}
          >{this.props.title}</Text>
        {this.props.children}
      </View>
    );
  }
}

const localStyles = {
  container: {
    color : undefined,
    fontSize: undefined,
    fontWeight: undefined,
    paddingHorizontal: undefined,
    paddingVertical  : undefined,
    paddingTop: undefined,
    paddingRight: undefined,
    paddingBottom: undefined,
    paddingLeft: undefined
  },

  title: {
    marginHorizontal: undefined,
    marginVertical  : undefined,
    marginTop: undefined,
    marginRight: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
  }
};
