import React, { Component } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import LinkText from '../components/LinkText';

import styles from '../styles';

export default class AboutScene extends Component {

  resetApp() {
    Alert.alert(
      'reset',
      'press [ok] to reset all the data',
      [
        {text: 'cancel'},
        {
          text: 'ok',
          onPress: this.props.onResetApp
        },
      ]
    );
  }

  render() {

    const profiles = Object.keys(this.props.profiles || {}).filter((id) => id !== '$');
    const packages = Object.keys(this.props.packages || {}).filter((id) => id !== '$');

    return (
      <ScrollView
        style={styles.about}
        contentContainerStyle={styles.aboutContainer}
        >

        <Text style={styles.aboutHeader}>
          about
        </Text>

        <Text style={styles.aboutParagraph}>
          This application allows you to see what your public node modules are up to,
          and take a peek at other developers, you collaborate with.
        </Text>

        <Text style={styles.aboutHeader}>
          thanks
        </Text>

        <Text style={styles.aboutParagraph}>
          Awesome APIs are provided by <LinkText
            style={styles.aboutParagraphLink}
            url="https://www.npmjs.com/"
            >npmjs.com</LinkText> and <LinkText
            style={styles.aboutParagraphLink}
            url="https://www.npms.io/"
            >npms.io</LinkText>,
          without them this project wouldn't exist. Thanks a lot folks.
        </Text>

        <Text style={styles.aboutHeader}>
          disclaimer
        </Text>

        <Text style={styles.aboutParagraph}>
          This is not an official <LinkText
            style={styles.aboutParagraphLink}
            url="https://www.npmjs.com/"
            >npmjs.com</LinkText> or <LinkText
            style={styles.aboutParagraphLink}
            url="https://www.npms.io/"
            >npms.io</LinkText> app,
          it just utilizes their publicly accessible APIs
          for the benefit of the <LinkText
            style={styles.aboutParagraphLink}
            url="https://nodejs.org/"
            >nodejs</LinkText> community.
        </Text>

        <Text style={styles.aboutHeader}>
          nuts & bolts
        </Text>

        <Text style={styles.aboutParagraph}>
          This application is released under the <LinkText
            style={styles.aboutParagraphLink}
            url="https://github.com/alexindigo/ndash/blob/master/LICENSE"
            >MIT</LinkText> license.
          Source code available at <LinkText
            style={styles.aboutParagraphLink}
            url="https://github.com/alexindigo/ndash"
            >github.com/alexindigo/ndash</LinkText>.
        </Text>

        <Text style={styles.aboutHeader}>
          stats
        </Text>

        <Text style={styles.aboutParagraph}>
          You have collected {packages.length} packages from {profiles.length} author{profiles.length === 1 ? '' : 's'}.
        </Text>

        <TouchableOpacity
            style={styles.aboutButton}
            onPress={this.resetApp.bind(this)}
          >
          <Text
            style={styles.aboutButtonText}
            >
            reset all data
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
