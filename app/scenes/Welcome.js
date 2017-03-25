import React, { Component } from 'react';
import { Text, View } from 'react-native';

import StartHelper from '../components/StartHelper';

import styles from '../styles';

export default class WelcomeScene extends Component {

  render() {

    return (
      <View
        style={styles.welcome}>
        <StartHelper
          style={styles.welcomeImage}
          />
        <Text
          style={styles.welcomeText}
          >start by adding new profile</Text>
      </View>
    );
  }
}
