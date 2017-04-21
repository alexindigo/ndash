import React, { Component } from 'react';
import {
  BackAndroid,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View
} from 'react-native';

import Drawer from 'react-native-drawer';
import StatusBarSizeIOS from 'react-native-status-bar-size';

import Message from './Message';
import Navbar from './Navbar';

import styles from '../styles';

export default class Chrome extends Component {

  state = {
    isMenuOpen: false,
    isLandscape: false,
    backRoute: null,
    title: '',
    statusBarHeight: StatusBarSizeIOS.currentHeight,
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.onHardwareBack.bind(this));
    StatusBarSizeIOS.addEventListener('willChange', this.onStatusBarSizeChange.bind(this));
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.onHardwareBack.bind(this));
    StatusBarSizeIOS.removeEventListener('willChange', this.onStatusBarSizeChange.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    // only when side menu changed it's state
    if (prevState.isMenuOpen !== this.state.isMenuOpen) {
      this.finishTransition();
    }

    // update statusBarHeight
    this.onStatusBarSizeChange(this.state.statusBarHeight);
  }

  onHardwareBack() {
    if (this.state.isMenuOpen) {
      this.setState({ isMenuOpen: false });
      return true;
    }

    if (this.state.backRoute) {
      this.state.backRoute();
      return true;
    }

    return false;
  }

  onStatusBarSizeChange(statusBarHeight) {
    // when landscape it's always `0`, since we hide status bar
    // otherwise it's at least 20 for statusbar
    // and Android isn't as flexible about it's StatusBar
    statusBarHeight = this.state.isLandscape || Platform.OS == 'android'
      ? 0
      : Math.max(20, statusBarHeight)
      ;

    if (statusBarHeight != this.state.statusBarHeight) {
      // on landscape it's always hidden
      this.setState({ statusBarHeight });
    }
  }

  onLayoutChange(e) {
    const { width, height } = e.nativeEvent.layout;

    // close menu on layout change
    if (this.state.isLandscape != (width > height)) {
      this.setState({ isMenuOpen: false });
    }

    this.setState({ isLandscape: width > height });
  }

  updateRoute(route, backRoute) {
    let title = route.title;

    if (typeof title == 'function') {
      title = title(route);
    }

    requestAnimationFrame(() => {
      this.setState({title, backRoute, isMenuOpen: false});
    });
  }

  startTransition() {
    this.props.onTransition(true);
  }

  finishTransition() {
    requestAnimationFrame(() => {
      this.props.onTransition(false);
    });
  }

  renderMenu() {
    return React.cloneElement(this.props.menu, {
      ref   : 'menu',
      style : styles.menu,
      isOpen: this.state.isMenuOpen,
      isLandscape: this.state.isLandscape,
      statusBarHeight: this.state.statusBarHeight
    });
  }

  renderNavbar() {

    return (
      this.props.isSplash
      ? null
      : <Navbar
          statusBarHeight={this.state.statusBarHeight}
          isLandscape={this.state.isLandscape}
          isMenuOpen={this.state.isMenuOpen}
          title={this.state.title}
          onHomeButton={() => { this.startTransition(); this.setState({isMenuOpen: true}) }}
          onBack={this.state.backRoute}
          />
    );
  }

  renderNavigation() {
    const navigation = React.cloneElement(this.props.children, {
      renderHeader: this.renderNavbar.bind(this)
    });

    return navigation;
  }

  render() {

    return (
      <View
        style={styles.base}
        onLayout={this.onLayoutChange.bind(this)}
        >
        <StatusBar
          backgroundColor={styles.statusBar.backgroundColor}
          />
        <Drawer
          disabled={this.props.isSplash}
          open={this.state.isMenuOpen}
          content={this.renderMenu()}
          side="right"
          type="static"
          tapToClose={true}
          captureGestures={true}
          panOpenMask={10}
          openDrawerOffset={100}
          tweenHandler={Drawer.tweenPresets.parallax}
          onOpen={() => this.setState({isMenuOpen: true}) }
          onClose={() => this.setState({isMenuOpen: false}) }
          >
          <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}
            >
            {this.renderNavigation()}
          </KeyboardAvoidingView>
        </Drawer>
        {
          this.props.messageToDisplay
          ? <Message
              inProgress={this.props.inProgress}
              message={this.props.messageToDisplay}
              />
          : null
        }
      </View>
    );
  }
}
