import React, { Component } from 'react';
import { ListView, Text, TouchableOpacity, View } from 'react-native';

import moment from 'moment';

import { prettifyNumber } from '../helpers/text';

import Userpic from '../components/Userpic';
import TimeFromNow from '../components/TimeFromNow';

import styles from '../styles';

export default class PackagesScene extends Component {

  unmounted = false

  constructor(props) {
    super(props);

    this.initialListSize = 10;
    this.pageSize = 15;
    this.scrollRenderAheadDistance = 20;
    this.requestDownloadsChunkSize = 50;

    this.requestDownloadsTimeout = null;

    this.packagesList = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      packagesToShow: this.getPackageIds(),
      totalDownloads: {
        day: null,
        week: null,
        month: null
      }
    };
  }

  componentDidMount() {
    this.updateDownloads();
    this.updateProfile();
  }

  componentDidUpdate(prevProps) {
    const prevPackages = Object.keys(prevProps.packages || {});
    const nextPackages = Object.keys(this.props.packages || {});

    if (prevProps.packages['$'] !== this.props.packages['$'] || prevProps.showAuthorPackagesOnly != this.props.showAuthorPackagesOnly) {
      this.updateDownloads();
    }

    if (prevProps.showAuthorPackagesOnly != this.props.showAuthorPackagesOnly) {
      this.setState({ packagesToShow: this.getPackageIds() });
    }

    if (prevPackages.length != nextPackages.length) {
      this.updateProfile();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    clearTimeout(this.requestDownloadsTimeout);
  }

  updateProfile() {
    const profile = this.props.profiles[this.props.handle];

    // header is for profile realted pages
    if (!profile) {
      return null;
    }

    const missingPackages = this.getPackageIds().filter((id) => {
      return !this.props.packages[id];
    });

    const lastDate = moment(profile.date);
    const today    = moment();

    if (missingPackages.length || !profile.date || today.diff(lastDate, 'hour', true) > 1) {
      this.props.onRequestProfile(profile.handle);
    }
  }

  updateDownloads() {
    const packageIds = this.getPackageIds();
    const totalDownloads = {
      day: 0,
      week: 0,
      month: 0
    };
    const packagesToUpdate = [];

    // fetch downloads in chunks
    packageIds.some((id) => {
      const pkg = this.props.packages[id];

      // skip scoped packages, since API doesn't return anything anyway
      if (id[0] === '@') {
        return false;
      } else if (!pkg) {
        packagesToUpdate.push(id);
        return false;
      } else if (!pkg.downloads || !pkg.downloads['last-day']) {
        packagesToUpdate.push(id);
      } else {
        // check only `last-day` downloads date, since they all get updated at the same time
        const lastDate = moment(pkg.downloads['last-day'].date);
        const today    = moment();

        if (today.diff(lastDate, 'hour', true) > 1) {
          packagesToUpdate.push(id);
        }

        totalDownloads.day += (pkg.downloads['last-day'] ? pkg.downloads['last-day'].downloads : null) || 0;
        totalDownloads.week += (pkg.downloads['last-week'] ? pkg.downloads['last-week'].downloads : null) || 0;
        totalDownloads.month += (pkg.downloads['last-month'] ? pkg.downloads['last-month'].downloads : null) || 0;
      }

      // if we have enough packages to update
      // stop iterator
      if (packagesToUpdate.length < this.requestDownloadsChunkSize) {
        return false;
      }

      return true;
    });

    if (!this.unmounted && packagesToUpdate.length) {
      this.requestDownloadsTimeout = setTimeout(() => {
        this.props.onRequestDownloads(packagesToUpdate);
      }, 500);
    }

    // update total downloads and re-sort the packages
    this.setState({ totalDownloads, packagesToShow: this.getPackageIds() });
  }

  // bring scoped packages down,
  // since they don't have as much support from npmjs api
  sortPackagesByName(a, b) {
    if (a[0] == '@' && b[0] != '@') {
      return 1;
    } else if (a[0] != '@' && b[0] == '@') {
      return -1;
    } else {
      return a == b ? 0 : (a < b ? -1 : 1);
    }
  }

  sortPackagesByDownloads(a, b) {
    const pkgADownloads = this.getDownloads(this.props.packages[a], 'last-day');
    const pkgBDownloads = this.getDownloads(this.props.packages[b], 'last-day');

    // sort by downloads first
    if (pkgADownloads && !pkgBDownloads) {
      return -1;
    } else if (!pkgADownloads && pkgBDownloads) {
      return 1;
    // with downloads being the same (null == 0)
    // sort by name
    } else if (!pkgADownloads && !pkgBDownloads) {
      return this.sortPackagesByName(a, b);
    } else {
      return pkgADownloads > pkgBDownloads ? -1 : 1;
    }
  }

  getDownloads(pkg, period = null) {
    if (!pkg || !pkg.downloads || (period && !pkg.downloads[period])) {
      return period ? null : {};
    }

    if (period) {
      return pkg.downloads[period].downloads;
    }

    const downloads = {};

    Object.keys(pkg.downloads).forEach((type) => {
      downloads[type] = pkg.downloads[type] ? pkg.downloads[type].downloads : null;
    });

    return downloads;
  }

  getPackageIds() {
    const {$, ...packages} = this.props.packages;
    const profile = this.props.profiles[this.props.handle];

    // if no profile provided
    // return all the packages unfiltered
    if (!profile) {
      return Object.keys(packages).sort(this.sortPackagesByName);
    }

    return profile.packages[
      this.props.showAuthorPackagesOnly ? 'author' : 'maintainer'
    ]
    .sort(this.sortPackagesByDownloads.bind(this));
  }

  renderHeader() {

    let authorOnlyStyles, authorAllStyles;

    const profile = this.props.profiles[this.props.handle];

    // header is for profile realted pages
    if (!profile) {
      return null;
    }

    // and replace first space with new line
    const name = (profile.name ? profile.name.toLowerCase() : profile.handle.toLowerCase()).replace(' ', '\n');

    const totalDownloads = ['day', '/', 'week', '/', 'month']
      .map((period, key) => {
        return (
          period == '/'
          ? <Text
              key={'sep' + key}
              style={styles.packagesHeaderDownloadsStatsSep}
              >/</Text>
          : <Text
              key={period}
              style={styles.packagesHeaderDownloadsStatsValue}
              >{
              Number.isFinite(this.state.totalDownloads[period])
              ? prettifyNumber(this.state.totalDownloads[period]).toLowerCase()
              : '--'
              }
            </Text>
        );
      })
      ;

    if (this.props.showAuthorPackagesOnly) {
      authorOnlyStyles = styles.packagesAuthorActive;
      authorAllStyles = styles.packagesAuthorInactive;
    } else {
      authorOnlyStyles = styles.packagesAuthorInactive;
      authorAllStyles = styles.packagesAuthorActive;
    }

    return (
      <View style={styles.packagesHeader}>
        {
          profile.date
          ? <Text
              style={styles.packagesProfileUpdated}
              >
              updated <TimeFromNow time={moment(profile.date)} />
            </Text>
          : null
        }
        <Text
          style={styles.packagesTotal}
          >
          {
            this.props.showAuthorPackagesOnly
              ? (profile.packages.author || []).length
              : (profile.packages.maintainer || []).length
          }
        </Text>
        <View style={styles.packagesHeaderAuthor}>
          <View style={styles.packagesHeaderProfile}>
            <Userpic
              style={styles.packagesProfileImage}
              profile={profile}
              />
            <View style={styles.packageProfileUser}>
              <Text style={styles.packageProfileUserName}>{name}</Text>
            </View>
          </View>
          <View style={styles.packagesHeaderDownloads}>
            <View
              style={styles.packagesHeaderDownloadsColumns}>
              <Text style={styles.packagesHeaderDownloadsColumnsLabel}>day</Text>
              <Text style={styles.packagesHeaderDownloadsColumnsLabel}>week</Text>
              <Text style={styles.packagesHeaderDownloadsColumnsLabel}>month</Text>
            </View>
            <View
              style={styles.packagesHeaderDownloadsStats}
              >
              {totalDownloads}
            </View>
          </View>
        </View>
        <View style={styles.packagesHeaderControl}>
          <View
            style={styles.packagesAuthorToggle}
            >
            <TouchableOpacity
              onPress={this.props.onAuthorOnly}
              ><Text
              style={[styles.packagesAuthorOnly, authorOnlyStyles]}
              >author</Text></TouchableOpacity>
            <TouchableOpacity
              onPress={this.props.onAuthorAll}
              ><Text
              style={[styles.packagesAuthorAll, authorAllStyles]}
              >maintainer</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  renderRow(packageId, sectionId, rowId) {

    const profile = this.props.profiles[this.props.handle];

    return (
      this.props.packages[packageId] && this.props.packages[packageId].name
      ? <TouchableOpacity
          onPress={this.props.onDetails.bind(this, {packageId})}
          >
          <PackageItem
            action={null}
            rowId={rowId}
            isAuthor={profile ? profile.packages.author.indexOf(packageId) > -1 : null}
            package={this.props.packages[packageId]}
            downloads={this.getDownloads(this.props.packages[packageId])}
            />
        </TouchableOpacity>
      : null
    );
  }

  render() {

    const {$, ...packages} = this.props.packages;

    // don't fail on no packages
    if (!Object.keys(packages).length) {
      return null;
    }

    return (
      <View
        style={styles.packages}
        >

        <ListView
          style={styles.packagesList}
          ref="packagesView"
          initialListSize={this.initialListSize}
          pageSize={this.pageSize}
          scrollRenderAheadDistance={this.scrollRenderAheadDistance}
          dataSource={this.packagesList.cloneWithRows(this.state.packagesToShow)}
          renderRow={this.renderRow.bind(this)}
          renderHeader={this.renderHeader.bind(this)}
          enableEmptySections={true}
        />

      </View>
    );
  }
}

class PackageItem extends Component {

  render() {
    const pkg = this.props.package;
    const updated = (pkg.downloads && pkg.downloads['last-day'].date)
      ? <TimeFromNow time={moment(pkg.downloads['last-day'].date)} />
      : 'not available'
      ;

    const published = pkg.date
      ? <Text style={styles.packageDate}>published <TimeFromNow time={moment(pkg.date)} /></Text>
      : null
      ;

    // keep number of downloads in specific order
    const downloads = ['last-day', 'last-week', 'last-month']
      .map((period) => Number.isFinite(this.props.downloads[period])
        ? prettifyNumber(this.props.downloads[period])
        : '--' // for empty results
      )
      .join(' / ')
      ;

    return (
      <View style={styles.packageContainer}>
        <View style={styles.packageItem}>
          <Text style={styles.packageName}>{pkg.name}</Text>
          <Text style={styles.packageVersion}>@{pkg.version}</Text>
        </View>
        <View style={styles.packageDownloads}>
          <Text style={styles.packageDownloadsStats}>{pkg.name[0] == '@' ? null : downloads}</Text>
        </View>
        {published}
      </View>
    );
  }
}
