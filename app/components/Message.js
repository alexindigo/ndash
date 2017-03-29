import React, { Component } from 'react';
import { Animated, Easing, Image, Modal, StatusBar, Text, View } from 'react-native';

import styles from '../styles';

import imageProgress from '../../images/progress.png';

export default class Message extends Component {

  runAnimation() {

    if (!this.props.inProgress) {
      return;
    }

    this._animatedValue.setValue(0);
    Animated.timing(this._animatedValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear
    }).start(() => this.runAnimation());
  }

  componentWillMount() {
    this._animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.runAnimation();
  }

  componentDidUpdate() {
    this.runAnimation();
  }

  componentWillUnmount() {
    // don't continue animation
    this.runAnimation = () => {};
  }

  onRequestClose() {
    // can't do much about it
    // it's un-interactive modal here
  }

  render() {

    const spin = this._animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <Modal
        transparent={true}
        animationType="fade"
        visible={true}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={this.onRequestClose.bind(this)}
        >
        <StatusBar barStyle={styles.messageStatusBar.style} />
        <View
          style={styles.messageContainer}
          >
          <View
            style={styles.messageWindow}
            >
            <View
              style={styles.messageProgressContainer}
              >
              {
                this.props.inProgress
                ? <Animated.Image
                  style={{...styles.messageProgressImage, transform: [{rotate: spin}] }}
                  source={imageProgress}
                  />
                : null
              }
            </View>
            <Text
              style={styles.messageText}
              >
              {this.props.message}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }
}
