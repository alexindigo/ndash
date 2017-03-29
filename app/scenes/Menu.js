import React, { Component } from 'react';
import { Image, ListView, Text, TouchableOpacity, View } from 'react-native';

import Userpic from '../components/Userpic';
import MenuButton from '../components/MenuButton';

import Alert from '../lib/Alert';
import styles from '../styles';

export default class Menu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      editProfilesInProgress: false
    };

    this.profiles = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isOpen) {
      this.setState({editProfilesInProgress: false});
    }
  }

  addProfile() {
    Alert.prompt(
      'add new profile',
      null,
      [
        {
          text: 'cancel',
          onPress: () => {}
        },
        {
          text: 'ok',
          onPress: (handle) => { handle && this.props.onAddProfile({handle: handle.toLowerCase()}) }
        }
      ]
    );
  }

  removeProfile(profile) {
    Alert.alert(
      'remove profile',
      'press [ok] to remove [' + profile.handle + '] profile',
      [
        {text: 'cancel'},
        {
          text: 'ok',
          onPress: this.props.onRemoveProfile.bind(this, profile)
        },
      ]
    );
  }

  onEditProfiles() {
    this.setState({editProfilesInProgress: true});
  }

  onDoneEditProfiles() {
    this.setState({editProfilesInProgress: false});
  }

  renderRow(profile, sectionId, rowId) {

    // filter out cache buster
    const packages = Object.keys(this.props.packages || {}).filter((id) => id !== '$');

    return profile ? (
      rowId == 'all'
      ? <MenuItem action={this.props.onPackages.bind(this, null)}>
        { this.state.editProfilesInProgress
          ? <View style={styles.menuContainer}>
              <Text style={[styles.menuItem, styles.menuItemText, styles.menuItemIconless]}>
                { /* empty text, to preserve positions */ }
              </Text>
            </View>
          :  <View style={styles.menuContainer}>
              <Text style={[styles.menuItem, styles.menuItemText, styles.menuItemIconless]}>
                all packages
              </Text>
              <View
                style={styles.menuProfileStatSingle}
                >
                <Text
                  style={styles.menuProfileStatSingleText}
                  >{packages.length || 0}</Text>
              </View>
            </View>
        }
        </MenuItem>
      : <ProfileItem
          editProfilesInProgress={this.state.editProfilesInProgress}
          showAuthorPackagesOnly={this.props.showAuthorPackagesOnly}
          action={this.props.onPackages.bind(this, {profile: profile})}
          onRemoveProfile={this.removeProfile.bind(this, profile)}
          profile={profile}
          />
    ) : null;
  }

  renderSeparator(sectionId, keyId) {
    return (
      <View key={keyId} style={styles.menuListSeparator} />
    );
  }

  render() {

    // clean up props
    const {$, ...profiles} = this.props.profiles;
    const menuPadding = this.props.isOpen && !this.props.isLandscape
      ? {paddingTop: this.props.statusBarHeight}
      : {}
      ;
    const menuModifier = this.props.isLandscape
      ? styles.menuLandscape
      : styles.menuPortrait
      ;

    // prepend with `all packages` item if there is more than 2 profiles
    let sourceRows = Object.keys(profiles).length > 1
        ? {'all': 'all packages'}
        : {}
        ;
    sourceRows = {...sourceRows, ...profiles};

    return (
      <View
        style={[styles.menu, menuModifier, menuPadding]}>

        <View style={styles.menuMeta}>
          <View style={[styles.menuContainer, styles.menuContainerSpread]}>
            <View />
            {
              this.state.editProfilesInProgress
              ? <View />
              : <MenuButton
                  style={[styles.menuButton, styles.menuButtonRight]}
                  image="add_profile"
                  action={this.addProfile.bind(this)}
                  />
            }
          </View>
        </View>

        <ListView
          style={styles.menuList}
          ref="menuView"
          dataSource={this.profiles.cloneWithRows(sourceRows)}
          renderRow={this.renderRow.bind(this)}
          renderSeparator={this.renderSeparator.bind(this)}
          enableEmptySections={true}
        />

        <View style={styles.menuMeta}>
          <View style={[styles.menuContainer, styles.menuContainerSpread]}>
            {
              this.state.editProfilesInProgress
              ? <View />
              : <MenuButton
                  style={[styles.menuButton, styles.menuButtonRight]}
                  image="settings"
                  action={this.props.onAbout}
                  />
            }
            {
              this.state.editProfilesInProgress
              ? <MenuButton
                  style={styles.menuButton}
                  image="edit_profiles_in_progress"
                  action={this.onDoneEditProfiles.bind(this)}
                  />
              : <MenuButton
                  style={styles.menuButton}
                  image="edit_profiles"
                  action={this.onEditProfiles.bind(this)}
                  />
            }
          </View>
        </View>

      </View>
    );
  }
}

class ProfileItem extends Component {
  render() {

    let authorOnlyStyles, authorAllStyles;

    if (this.props.showAuthorPackagesOnly) {
      authorOnlyStyles = styles.menuProfileStatActive;
      authorAllStyles = styles.menuProfileStatInactive;
    } else {
      authorOnlyStyles = styles.menuProfileStatInactive;
      authorAllStyles = styles.menuProfileStatActive;
    }

    return (
      <MenuItem action={this.props.action}>
        <View style={styles.menuContainer}>
          <Userpic
            style={styles.menuProfileImage}
            profile={this.props.profile}
            />
          <Text
            style={[styles.menuItem, styles.menuItemText]}
            >
            {this.props.profile.handle}
          </Text>
          {
            this.props.editProfilesInProgress
            ? <MenuButton
                style={[styles.menuButton, styles.menuProfileButton]}
                image="remove_profile"
                action={this.props.onRemoveProfile}
                />
            : <View
                style={styles.menuProfileStats}
                >
                <Text
                  style={[styles.menuProfileStatLeft, authorOnlyStyles]}
                  >{this.props.profile.author || 0}</Text>
                <Text
                  style={[styles.menuProfileStatRight, authorAllStyles]}
                  >{this.props.profile.maintainer || 0}</Text>
              </View>
          }
        </View>
      </MenuItem>
    );
  }
}

class MenuItem extends Component {
  render () {
    return (
      <TouchableOpacity style={{flex: 1}} onPress={this.props.action}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}
