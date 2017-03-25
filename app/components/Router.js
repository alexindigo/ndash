import React, { Component } from 'react';
import {
  NavigationExperimental,
  View
} from 'react-native';
import deepEqual from 'deep-equal';

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

export default class Router extends Component {

  navigate(route) {

    const currentRoute = this.refs.navigator.getCurrentRoutes().pop() || {};

    // still propagate router events even if the route hasn't changed
    if (!deepEqual(route, currentRoute, {strict: true}))
    {
      this.refs.navigator.push(route);
    }
    else
    {
      this.refs.navigator.replace(route);
    }
  }

  resetTo(route) {
    this.refs.navigator.resetTo(route);
  }

  getScene(route) {
    return React.Children.toArray(this.props.children).find(
      (child) => {
        return child.props.id === route.id;
      });
  }

  onNavigationChange(route) {
    const scene = this.getScene(route);
    const title = scene ? (scene.props.title || '') : 'error';

    this.props.onUpdate({route, title, stack: this.refs.navigator.getCurrentRoutes().length});
  }

  componentDidMount() {
    this.onNavigationChange(this.props.initialRoute);
  }

  // there is nothing to update
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  renderScene(route, navigator) {
    return this.getScene(route);
  }

  configureScene(route, routeStack) {
    return Navigator.SceneConfigs.PushFromRight;
  }

  render() {

    const navbarPlug = <NavbarPlug onChange={(route) => this.onNavigationChange(route)} />;

    return (
      <Navigator
        ref="navigator"
        sceneStyle={this.props.sceneStyle}
        initialRoute={this.props.initialRoute}
        navigationBar={navbarPlug}
        renderScene={this.renderScene.bind(this)}
        configureScene={this.configureScene.bind(this)}
      />
    );
  }

}

// "Internal" component to transfer action from within Navigator into custom NavigationBar
class NavbarPlug extends Component {

  componentDidUpdate() {
    this.props.onChange(this.props.navigator.getCurrentRoutes().pop());
  }

  render() {
    return null;
  }
}
