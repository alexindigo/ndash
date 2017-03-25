import React, { Component } from 'react';
import { Image, Text, View } from 'react-native';

import { combine } from '../helpers/styles';

import imageStartThere from '../../images/welcome_start.png';

export default class StartHelper extends Component {

  render() {

    const stylesContainer = combine(this.props.style, localStyles.container);
    const stylesImage = combine(this.props.style, localStyles.image);

    return (
      <View
        style={stylesContainer}>
        <Image
          source={imageStartThere}
          style={stylesImage}/>
      </View>
    );
  }
}

const localStyles = {
  container: {
    width : undefined,
    height: undefined,
    color : undefined
  },

  image: {
    color           : undefined,
    flexGrow        : undefined,
    borderColor     : undefined,
    borderRightWidth: undefined
  }
};
