import React, { Component } from 'react';
import { Text, View } from 'react-native';

import { combine } from '../helpers/styles';

export default class LabeledText extends Component {

  render() {

    const stylesContainer = combine(this.props.style, localStyles.container);
    const stylesLabel = combine(this.props.style, localStyles.label);
    const stylesText = combine(this.props.style, localStyles.text);

    return (
      <View
        style={stylesContainer}
        >
        <Text
          style={stylesText}
          >
          {this.props.children}
        </Text>
        <Text
          style={stylesLabel}
          >{this.props.label}</Text>
      </View>
    );
  }
}

const localStyles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0)',
    color: undefined,
    fontSize: undefined,
    fontWeight: undefined,
    padding: undefined,
    paddingHorizontal: undefined,
    paddingVertical  : undefined,
    paddingTop: undefined,
    paddingRight: undefined,
    paddingBottom: undefined,
    paddingLeft: undefined,
    textAlign: undefined
  },

  text: {
    flex: 0,
    paddingTop: (styles) => styles.paddingTop || Math.ceil(styles.padding * 1.25),
    paddingBottom: (styles) => styles.paddingBottom || Math.floor(styles.padding * 0.75),
  },

  label: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    fontSize: (styles, base) => (base && base.fontSize ? Math.floor(base.fontSize * 0.75) : (styles.fontSize ? Math.floor(styles.fontSize * 0.75) : undefined)),
    opacity: 0.6,
    backgroundColor: 'rgba(0,0,0,0)',

    padding: undefined,
    paddingHorizontal: undefined,
    paddingVertical  : undefined,
    paddingTop: undefined,
    paddingRight: undefined,
    paddingBottom: undefined,
    paddingLeft: undefined,
    margin: undefined,
    marginHorizontal: undefined,
    marginVertical  : undefined,
    marginTop: undefined,
    marginRight: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
  }
};
