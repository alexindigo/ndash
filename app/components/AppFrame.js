import React, { Component } from 'react';
import { NavigationExperimental, View } from 'react-native';
import deepEqual from 'deep-equal';

const {
  CardStack: NavigationCardStack,
  StateUtils: NavigationStateUtils,
} = NavigationExperimental;

export default class AppFrame extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      navigationState: {
        index: props.routes.length - 1,
        routes: this.normalizeRoutes(props.routes)
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    // if all is the same, do nothing
    if (deepEqual(this.props.routes, nextProps.routes)) {
      return;
    }

    // add new route to the stack
    if (this.props.routes.length + 1 == nextProps.routes.length
      && deepEqual(this.props.routes, nextProps.routes.slice(0, -1))
    )
    {
      this.addNewRoute(nextProps.routes[nextProps.routes.length - 1]);
    }
    // remove last route from the stack
    else if (this.props.routes.length - 1 == nextProps.routes.length
      && deepEqual(this.props.routes.slice(0, -1), nextProps.routes)
    )
    {
      this.removeLastRoute();
    }
    // replace stack with new routes
    else
    {
      this.replaceRoutes(nextProps.routes);
    }
  }

  componentDidMount() {
    this.updateRoute();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!deepEqual(prevProps.routes, this.props.routes)) {
      this.updateRoute();
    }
  }

  normalizeRoutes(routes) {
    const isArray = Array.isArray(routes);

    routes = (isArray ? routes : [routes]).map((route) => ({key: JSON.stringify(route), ...route}));

    return isArray ? routes : routes[0];
  }

  denormalizeRoutes(routes) {
    const isArray = Array.isArray(routes);

    routes = (isArray ? routes : [routes]).map((route) => { const {key, ...publicRoute} = route; return publicRoute; });

    return isArray ? routes : routes[0];
  }

  getRouteParams(route) {
    const {key, id, ...params} = route;
    return params;
  }

  updateRoute() {
    const route = this.state.navigationState.routes[this.state.navigationState.index];
    let goBack = null;

    // enable back button if there are more routes in the stack
    if (this.state.navigationState.index > 0) {
      goBack = this.navigateBack.bind(this);
      goBack.route = this.state.navigationState.routes[this.state.navigationState.index - 1];
    }

    // update downstream
    if (typeof this.refs.chrome.updateRoute == 'function') {
      this.refs.chrome.updateRoute(this.denormalizeRoutes(route), goBack);
    }

    // notify listeners
    if (typeof this.props.onUpdate == 'function') {
      this.props.onUpdate(this.denormalizeRoutes(route), goBack);
    }
  }

  // only triggers `onRouteChange` and leaves state update to props change
  navigateBack() {

    // Extract the navigationState from the current state:
    let { navigationState } = this.state;

    // Pop the current route using the pop reducer.
    navigationState = NavigationStateUtils.pop(navigationState);

    // NavigationStateUtils gives you back the same `navigationState` if nothing
    // has changed. We will only update state if it has changed.
    if (this.state.navigationState !== navigationState) {
      this.props.onRouteChange(this.denormalizeRoutes(navigationState.routes));
    }
  }

  // one way function, doesn't trigger `onRouteChange`
  replaceRoutes(routes) {
    // Extract the navigationState from the current state:
    let { navigationState } = this.state;

    routes = this.normalizeRoutes(routes);
    navigationState = NavigationStateUtils.reset(navigationState, routes);

    // NavigationStateUtils gives you back the same `navigationState` if nothing
    // has changed. We will only update state if it has changed.
    if (this.state.navigationState !== navigationState) {
      this.setState({navigationState});
    }
  }

  // one way function, doesn't trigger `onRouteChange`
  removeLastRoute() {
    // Extract the navigationState from the current state:
    let { navigationState } = this.state;

    // Pop the current route using the pop reducer.
    navigationState = NavigationStateUtils.pop(navigationState);

    // NavigationStateUtils gives you back the same `navigationState` if nothing
    // has changed. We will only update state if it has changed.
    if (this.state.navigationState !== navigationState) {
      this.setState({navigationState});
    }
  }

  // one way function, doesn't trigger `onRouteChange`
  addNewRoute(route) {
    // Extract the navigationState from the current state:
    let { navigationState } = this.state;

    route = this.normalizeRoutes(route);
    navigationState = NavigationStateUtils.push(navigationState, route);

    // NavigationStateUtils gives you back the same `navigationState` if nothing
    // has changed. We will only update state if it has changed.
    if (this.state.navigationState !== navigationState) {
      this.setState({navigationState});
    }
  }

  getScene(route) {
    return React.Children.toArray(this.props.children).find(
      (child) => {
        return child.props.id === route.id;
      });
  }

  renderScene(sceneProps) {
    const route = sceneProps.scene.route;
    const scene = this.getScene(route);
    return React.cloneElement(scene, {routeParams: this.getRouteParams(route)});
  }

  renderChrome() {
    return this.props.chrome || (<View/>);
  }

  render() {
    const Chrome = React.cloneElement(this.renderChrome(), {
      ref: 'chrome',
      inTransition: this.props.inTransition
    }, (
      <NavigationCardStack
        onNavigateBack={this.navigateBack.bind(this)}
        navigationState={this.state.navigationState}
        renderScene={this.renderScene.bind(this)}
      />
    ));

    return Chrome;
  }
}
