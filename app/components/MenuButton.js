import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';

import imageAddProfile from '../../images/add_profile.png';
import imageSettings from '../../images/extra.png';
import imageEditProfiles from '../../images/edit.png';
import imageEditProfilesInProgress from '../../images/edit_in_progress.png';
import imageRemoveProfile from '../../images/remove_profile.png';

export default class MenuButton extends Component {
  render() {
    let image;

    switch(this.props.image)
    {
      case 'add_profile':
        image = imageAddProfile;
        break;

      case 'settings':
        image = imageSettings;
        break;

      case 'edit_profiles':
        image = imageEditProfiles;
        break;

      case 'edit_profiles_in_progress':
        image = imageEditProfilesInProgress;
        break;

      case 'remove_profile':
        image = imageRemoveProfile;
        break;
    }

    return (
      <TouchableOpacity onPress={this.props.action}>
        <Image
          style={this.props.style}
          source={image}
          />
      </TouchableOpacity>
    );
  }
}
