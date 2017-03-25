import React, { Component } from 'react';
import { View } from 'react-native';

import NavigationBar from 'react-native-navbar';

import HomeButton from './HomeButton';
import BackButton from './BackButton';

import styles from '../styles';

export default class Navbar extends Component {

  truncateTitle(title) {
    if (title.length > 25) {
      title = title.slice(0, 12) + '\u2026' + title.slice(-12);
    }

    return title;
  }

  render() {
    const isStatusBarHidden = this.props.isLandscape || this.props.isMenuOpen;
    const isStatusSpaceKept = !this.props.isLandscape;

    const titleConfig = {
      title: this.truncateTitle(this.props.title),
      tintColor: styles.header.color
    };

    const homeButton = <HomeButton
      onAction={this.props.onHomeButton}
      style={styles.homeButton}
      />;

    const backButton = this.props.onBack
      ? <BackButton
        profile={this.props.onBack.route}
        onAction={this.props.onBack}
        style={styles.backButtonImage}
        />
      // it couldn't handle `null`, so send empty view
      : <View />
      ;

    const navbarStyle = isStatusBarHidden && isStatusSpaceKept
      ? [ styles.navigationBarNoStatus, {marginTop: this.props.statusBarHeight} ]
      : styles.navigationBar
      ;

    const navbar = <NavigationBar
      tintColor={styles.header.backgroundColor}
      statusBar={{hidden: isStatusBarHidden, style: styles.statusBar.style}}
      style={navbarStyle}
      title={titleConfig}
      leftButton={backButton}
      rightButton={homeButton}
      hideAnimation="slide"
      showAnimation="slide"
      />;

    return navbar;
  }
}
