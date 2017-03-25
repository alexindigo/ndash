import React, { Component } from 'react';
import { Image, TouchableOpacity, Text, View } from 'react-native';

import Userpic from './Userpic';

import { combine } from '../helpers/styles';

import imageBackButton from '../../images/back.png';

export default class BackButton extends Component {

  render() {

    const stylesContainer = combine(this.props.style, localStyles.container);
    const stylesImage = combine(this.props.style, localStyles.image);
    const stylesBack = combine(this.props.style, localStyles.image, localStyles.back);

    return (
      this.props.onAction
      ? <TouchableOpacity
          onPress={this.props.onAction}
          >
          <View
            style={stylesContainer}
            >
            {
              this.props.profile && this.props.profile.handle
              ? <Userpic
                style={stylesImage}
                profile={this.props.profile}
                />
              : <Image
                style={stylesBack}
                source={imageBackButton}
                />
            }
          </View>
        </TouchableOpacity>
      : null
    );
  }
}

const localStyles = {
  container: {
    width : undefined,
    height: undefined,
    color : undefined,
    lineHeight: undefined,
    fontWeight: undefined,
    fontSize: undefined,
    borderRadius: undefined,
    borderWidth: undefined
  },

  image: {
    paddingHorizontal: undefined,
    paddingVertical  : undefined
  },

  back: {
    borderWidth: undefined,
    borderColor: undefined,
    borderRadius: undefined
  }
};
