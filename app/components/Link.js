import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';

import { openUrl, shareUrl } from '../helpers/url';

export default class Link extends Component {

  render() {

    const {url, style, ...props} = this.props;

    return (
      <TouchableOpacity
        style={[{flex: 1}, style]}
        {...props}
        onPress={() => openUrl(url, this.props.onError)}
        onLongPress={() => shareUrl(url, this.props.onError, this.props.onShare)}
        />
    );
  }
}
