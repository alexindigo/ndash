import React, { Component } from 'react';
import { Image, View } from 'react-native';

import styles from '../styles';

import Logo from '../components/Logo';

export default class SplashScene extends Component {

  render() {

    return (
      <View
        style={styles.splash}>
        <Logo style={styles.splashImage} />
      </View>
    );
  }
}
