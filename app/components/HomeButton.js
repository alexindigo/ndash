import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { combine } from '../helpers/styles';

import Logo from './Logo';

export default class HomeButton extends Component {

  render() {

    const stylesContainer = combine(this.props.style, localStyles.container);
    const stylesLogo = combine(this.props.style, localStyles.logo);

    return (
      <TouchableOpacity
        onPress={this.props.onAction}
        >
        <View
          style={stylesContainer}
          >
          <Logo style={stylesLogo} />
        </View>
      </TouchableOpacity>
    );
  }
}

const localStyles = {
  container: {
    width : undefined,
    height: undefined,
    color : undefined
  },

  logo: {
    color            : undefined,
    paddingHorizontal: undefined,
    paddingVertical  : undefined
  }
};
