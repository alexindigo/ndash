import React, { Component } from 'react';
import { Text, View } from 'react-native';

import moment from 'moment';

import Alert from '../lib/Alert';
import ScrollView from '../lib/hacks/ScrollView';

import TimeFromNow from '../components/TimeFromNow';

import PackageMeta from '../components/Package/PackageMeta';
import PackageActivity from '../components/Package/PackageActivity';
import PackagePopularity from '../components/Package/PackagePopularity';
import PackageDownloads from '../components/Package/PackageDownloads';
import PackageMaintainers from '../components/Package/PackageMaintainers';
import PackageLinks from '../components/Package/PackageLinks';
import PackageOutdatedDependencies from '../components/Package/PackageOutdatedDependencies';
import PackageDependencies from '../components/Package/PackageDependencies';

import styles from '../styles';

export default class DetailsScene extends Component {

  componentDidMount() {
    this.updateDetails();
  }

  updateDetails() {
    if (this.props.packageDetails && this.props.packageDetails.date) {
      const lastDate = moment(this.props.packageDetails.date);
      const today    = moment();

      if (today.diff(lastDate, 'hour', true) < 1) {
        // no need to update
        return;
      }
    }

    this.props.onRequestPackageDetails(this.props.packageId);
  }

  // TODO: Probably this logic should be on App level
  onActivateProfile(profile) {
    const handle = profile.username;

    if (handle in this.props.profiles) {
      this.props.onPackages({profile: {handle, email: profile.email}});
    } else {
      Alert.alert(
        'add profile',
        'do you want to add [' + handle + '] profile to the list',
        [
          {text: 'cancel'},
          {
            text: 'ok',
            onPress: () => this.props.onAddProfile({handle})
          },
        ]
      );
    }
  }

  render() {

    const pkg = this.props.packages[this.props.packageId];
    const details = this.props.packageDetails || {};

    if (!pkg) {
      return null;
    }

    return (
      <ScrollView
        ref="sceneScrollView"
        style={styles.details}
        contentContainerStyle={styles.detailsContainer}
        showsVerticalScrollIndicator={false}
        >

        <PackageMeta package={pkg} details={details} />

        <PackageActivity package={pkg} details={details} />

        <PackagePopularity package={pkg} details={details} />

        {
          // there is no downloads information for scoped packages yet
          pkg.name[0] !== '@'
          ? <PackageDownloads package={pkg} details={details} />
          : null
        }

        <PackageMaintainers
          package={pkg}
          details={details}
          onActivateProfile={this.onActivateProfile.bind(this)}
          />

        <PackageOutdatedDependencies
          package={pkg}
          details={details}
          sceneScrollView={this.refs.sceneScrollView}
          />

        <PackageDependencies
          package={pkg}
          details={details}
          sceneScrollView={this.refs.sceneScrollView}
          />

        <PackageLinks package={pkg} details={details} />

        {
          details.analyzedAt
          ? <Text
              style={styles.detailsUpdated}
              >
              analyzed <TimeFromNow time={moment(details.analyzedAt)} />
            </Text>
          : null
        }

      </ScrollView>
    );
  }
}
