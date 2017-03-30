import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

import { prettifyNumber } from '../../helpers/text';

import ContentBlock from '../ContentBlock';
import NamedBlock from '../NamedBlock';
import Userpic from '..//Userpic';

import styles from '../../styles';

export default class PackageMaintainers extends Component {

  constructor(props) {
    super(props);

    this.state = {
      highlightedProfile: null
    };
  }

  renderMaintainers() {
    if (!this.props.package || !this.props.package.maintainers) {
      return (
        <Text style={styles.detailsSectionContentMessage}>no maintainers found for this package</Text>
      );
    }

    const userpics = this.props.package.maintainers.map((profile) => {
      let profileStyle;

      if (this.state.highlightedProfile == profile.username) {
        profileStyle = [styles.detailsMaintainersProfileImage, styles.detailsMaintainersProfileHighlightedImage];
      } else {
        profileStyle = styles.detailsMaintainersProfileImage;
      }

      return (
        <TouchableOpacity
          style={styles.detailsMaintainersProfile}
          key={profile.username}
          onPress={() => this.setState({highlightedProfile: profile.username})}
          onLongPress={this.props.onActivateProfile.bind(this, profile)}
          >
          <Userpic
            style={profileStyle}
            profile={profile}
            />
          {
            this.state.highlightedProfile == profile.username
            ? <Text style={styles.detailsMaintainersProfileName}>
                {profile.username}
              </Text>
            : null
          }

        </TouchableOpacity>
      );
    });

    return (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.detailsMaintainersListContainer}
        contentContainerStyle={styles.detailsMaintainersList}
        >
        {userpics}
      </ScrollView>
    );
  }

  render() {
    return (
      <NamedBlock
        title={'maintainers' + (this.props.package && this.props.package.maintainers ? ' • ' + this.props.package.maintainers.length : '')}
        style={styles.detailsSection}
        >

        <ContentBlock
          style={styles.detailsSectionContent}
          >
          {this.renderMaintainers()}
        </ContentBlock>
      </NamedBlock>
    );
  }
}
