import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { combine } from '../helpers/styles';

export default class Drawers extends Component {

  renderChild(child) {
    return (
      this.props.onAction
      ? <TouchableOpacity
        onPress={this.props.onAction.bind(this, child)}
        style={{flex: 1}}
        >{child}</TouchableOpacity>
      : child
    );
  }

  render() {

    const children = [];

    const stylesContainer = combine(
      this.props.style,
      localStyles.container,
      this.props.attachedTop ? localStyles.containerTop : {},
      this.props.attachedBottom ? localStyles.containerBottom : {}
    );
    const stylesSep = combine(this.props.style, localStyles.separator);

    React.Children.toArray(this.props.children).forEach((el, i) => {
      // add separators before all, but first element
      if (i > 0) {
        children.push(<View key={'sep_' + i} style={stylesSep}></View>);
      }
      children.push(React.cloneElement(this.renderChild(el), {
        key: 'child_' + i
      }));
    });

    return (
      <View
        style={stylesContainer}
        >
        {children}
      </View>
    );
  }
}

const localStyles = {
  container: {
    color : undefined,
    fontSize: undefined,
    fontWeight: undefined,
    borderWidth: undefined,
    borderTopWidth: undefined,
    borderBottomWidth: undefined
  },
    containerBottom: {
      borderTopWidth: (styles) => styles.borderWidth,
    },
    containerTop: {
      borderBottomWidth: (styles) => styles.borderWidth,
    },

  separator: {
    flex: 0,
    flexDirection: undefined,
    justifyContent: undefined,

    borderWidth: undefined,
    borderLeftWidth: (styles) => (styles.borderWidth || styles.borderTopWidth),

    marginHorizontal: undefined,
    marginVertical  : undefined,
    marginTop: undefined,
    marginRight: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    paddingHorizontal: undefined,
    paddingVertical  : undefined,
    paddingTop: undefined,
    paddingRight: undefined,
    paddingBottom: undefined,
    paddingLeft: undefined
  }
};
