import React, { Component } from 'react';
import { Image, View } from 'react-native';

import gravatarApi from 'gravatar-api';

export default class Userpic extends Component {
  render() {

    const imageUri = gravatarApi.imageUrl({email: this.props.profile.email, secure: true});

    return (
      <Image
        style={[{backgroundColor: '#ffffff'}, this.props.style]}
        source={{uri: imageUri}}
        />
    );
  }
}
