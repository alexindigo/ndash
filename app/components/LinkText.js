import React, { Component } from 'react';
import { Text } from 'react-native';

import { openUrl, shareUrl } from '../helpers/url';

export default class LinkText extends Component {

  render() {

    const {url, style, ...props} = this.props;

    return (
      <Text
        style={style}
        {...props}
        onPress={() => openUrl(url, this.props.onError)}
        onLongPress={() => shareUrl(url, this.props.onError, this.props.onShare)}
        />
    );
  }
}
