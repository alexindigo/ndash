import React, { Component } from 'react';
import { View } from 'react-native';

import Actions from './lib/Actions';
import Error from './lib/Error';

import AppFrame from './components/AppFrame';
import Chrome from './components/Chrome';

import Menu from './scenes/Menu';

import SplashScene from './scenes/Splash';
import WelcomeScene from './scenes/Welcome';
import PackagesScene from './scenes/Packages';
import DetailsScene from './scenes/Details';
import AboutScene from './scenes/About';

const routes = {
  splash: {
    id: 'splash',
    title: ''
  },
  welcome: {
    id: 'welcome',
    title: 'welcome'
  },
  about: {
    id: 'about',
    title: 'ndash'
  },
  packages: {
    id: 'packages',
    handle: '',
    title: (route) => (route.handle || 'all packages')
  },
  details: {
    id: 'details',
    displayedPackage: '',
    title: (route) => (route.displayedPackage || 'details')
  }
}

export default class App extends Component {

  waitForTransition = null

  actionQueue = []

  packageDetailsCache = {}

  constructor(props) {
    super(props);

    this.state = this.getInauguralState();
  }

  componentDidMount() {
    Actions.batch(['loadProfiles', 'loadPackages', 'loadApp'], (error, result) => {

      if (error) {
        Error.display('unable to load profiles and packges from db');
        return;
      }

      this.setState({
        isSplash: false,
        profiles: result['loadProfiles'],
        packages: result['loadPackages'],
        appData : result['loadApp'],
      });

      this.startWithProfile(result);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // if it's changed from inTransition to normal mode, clean up the queue
    if (prevState.inTransition === true && this.state.inTransition === false) {
      this.dequeueActions();
    }

    // update packageDetails cache
    if (this.state.packageDetails && this.state.packageDetails.id) {
      this.packageDetailsCache[this.state.packageDetails.id] = this.state.packageDetails;
    }

    // auto-clean inTransition flag
    if (this.state.inTransition) {
      clearTimeout(this.waitForTransition);
      this.waitForTransition = setTimeout(() => {
        this.setState({inTransition: false});
      }, 100);
    }
  }

  getInauguralState(nextRoute) {

    const route = nextRoute || routes.splash;

    this.packageDetailsCache = {};

    return {
      isSplash: route.id === 'splash',
      isBusy: false,
      inTransition: false,
      message: null,
      profiles: {},
      packages: {},
      packageDetails: null,
      handle: null,
      packageId: null,
      showAuthorPackagesOnly: false,

      routes: [route]
    };
  }

  startWithProfile(result) {
    const profiles = Object.keys(result['loadProfiles']).filter((id) => id !== '$');

    // no profiles – show welcome screen
    if (!profiles.length) {
      this.updateRoutes({...routes.welcome});
      return;
    }

    // load up last profile
    let handle = result['loadApp'].currentProfile;

    // or first one in the list
    if (!handle || profiles.indexOf(handle) == -1) {
      // get first in the list
      handle = profiles[0];
    }

    // if chosen profile is no more
    // show welcome screen
    if (!result['loadProfiles'][handle]) {
      this.updateRoutes({...routes.welcome});
      return;
    }

    let email  = result['loadProfiles'][handle].email;

    // show list of packages for the profile
    this.setState({ handle });
    this.updateRoutes({...routes.packages, handle, email, activated: Date.now()});

    // update to the selected profile
    // not really interested in callback
    this.execute('saveCurrentProfile', { handle });
  }

  dequeueActions() {
    const action = this.actionQueue.shift();

    if (!action) {
      return;
    }

    requestAnimationFrame(() => {
      action();
      this.dequeueActions();
    });
  }

  execute(action) {
    const actionArgs = Array.prototype.slice.call(arguments, 1);

    // if no callback function provided, insert noop
    if (typeof actionArgs[actionArgs.length - 1] !== 'function') {
      actionArgs.push(() => {});
    }

    const callback = actionArgs[actionArgs.length - 1] ;

    if (!(action in Actions)) {
      callback('action [' + action + '] is not defined.');
      return;
    }

    if (this.state.inTransition) {
      this.actionQueue.push(() => {
        Actions[action].apply(Actions, actionArgs);
      });
    } else {
      requestAnimationFrame(() => {
        Actions[action].apply(Actions, actionArgs);
      });
    }
  }

  createCallback(message, next, key = null) {

    if (typeof message == 'function') {
      key     = next || null;
      next    = message;
      message = null;
    }

    this.setState({isBusy: true, message: message});

    return (error, result) => {
      const data = {};

      this.setState({
        isBusy: false,
        message: null
      });

      if (error) {
        Error.display(error);
        return;
      }

      // if key is provided
      // use it to pack the result
      if (key)
      {
        data[key] = result;
        result = data;
      }

      next(result);
    }
  }

  // -- helpers

  onRequestProfile(handle) {
    this.execute('fetchProfile', handle, this.createCallback(({profile, packages}) => {
      this.setState({
        profiles: {...this.state.profiles, [handle]: profile},
        packages
      });
    }));
  }

  onRequestDownloads(packageIds) {
    this.execute('requestDownloads', packageIds, this.createCallback((packages) => {
      this.setState({packages});
    }));
  }

  onRequestPackageDetails(packageId) {
    this.execute('fetchPackageDetails', packageId, this.createCallback(({packageDetails}) => {
      this.setState({packageDetails});
    }));
  }

  updateRoutes(route) {
    this.setState({inTransition: true, routes: [route]});
  }

  addRoute(route) {
    this.setState({inTransition: true, routes: [...this.state.routes, route]});
  }

  // -- navigation

  onAbout() {
    this.updateRoutes(routes.about);
  }

  onPackages(details) {
    const handle  = details ? details.profile.handle : null;
    const email   = details ? details.profile.email : null;
    this.setState({ handle });
    // since user explicitly clicked on the profile
    // need to bust "cache" of phantom updates workaround
    this.updateRoutes({...routes.packages, handle, email, clicked: Date.now()});

    // not really interested in callback
    if (handle) {
      // not really interested in callback
      this.execute('saveCurrentProfile', { handle });
    }
  }

  onDetails(pkgDetails) {
    const packageId  = pkgDetails ? pkgDetails.packageId : null
    this.setState({ packageId, packageDetails: this.packageDetailsCache[packageId] || null });
    // go to package details page
    // and bust "cache"
    this.addRoute({...routes.details, displayedPackage: packageId, clicked: Date.now()});
  }

  onAddProfile({handle}) {
    this.execute('fetchProfile', handle, this.createCallback('loading profile information...', ({profile, packages}) => {

      this.setState({
        handle: handle,
        profiles: {...this.state.profiles, [handle]: profile},
        packages
      });

      this.updateRoutes({...routes.packages, handle, email: profile.email, clicked: Date.now()});

      // not really interested in callback
      this.execute('saveCurrentProfile', profile);
    }));
  }

  onRemoveProfile(profile) {
    this.execute('removeProfile', profile, this.createCallback('remove profile information...', ({handle, removedPackages}) => {

      const removedActiveProfile = (this.state.handle === handle);
      const profiles = {...this.state.profiles};
      const packages = {...this.state.packages};

      // clean up removed profile
      delete profiles[handle];
      delete profiles['$'];

      // clean up removed packages
      removedPackages.forEach((pkg) => {
        delete packages[pkg];
        delete this.packageDetailsCache[pkg];
      });

      this.setState({
        handle: removedActiveProfile ? null : this.state.handle,
        profiles: {...profiles, $: '' + Date.now() + Math.random()},
        packages
      });

      // if current profile is removed, navigate off
      if (removedActiveProfile) {
        // go to all packages scene
        this.updateRoutes({...routes.packages, handle: null, email: null, clicked: Date.now()});
      }

      // if no profiles left, go back to the Welcome scene
      if (!Object.keys(profiles).length) {
        // + clean up orphan packages
        this.packageDetailsCache = {};
        this.setState({routes: [routes.welcome], packages: {}});
      }

    }));
  }

  onResetApp() {
    this.execute('resetApp', this.createCallback('cleaning up the app...', () => {
      this.setState(this.getInauguralState(routes.welcome));
    }));
  }

  onBack() {
    this.refs.appframe.navigateBack();
  }

  onRouteChange(routes) {
    this.setState({routes: routes});
  }

  onTransition(inTransition) {
    this.setState({ inTransition });
  }

  // --

  renderMenu() {
    return (
      <Menu
        showAuthorPackagesOnly={this.state.showAuthorPackagesOnly}
        profiles={this.state.profiles}
        packages={this.state.packages}
        onAbout={this.onAbout.bind(this)}
        onPackages={this.onPackages.bind(this)}
        onAddProfile={this.onAddProfile.bind(this)}
        onRemoveProfile={this.onRemoveProfile.bind(this)}
        onResetApp={this.onResetApp.bind(this)}
        />
    );
  }

  renderChrome() {
    return (
      <Chrome
        onTransition={this.onTransition.bind(this)}
        menu={this.renderMenu()}
        messageToDisplay={this.state.message}
        inProgress={this.state.isBusy}
        isSplash={this.state.isSplash}
        />
    );
  }

  render() {

    return (
      <AppFrame
        ref="appframe"
        chrome={this.renderChrome()}
        routes={this.state.routes}
        onRouteChange={this.onRouteChange.bind(this)}
        >
        <SplashScene id={routes.splash.id} />
        <WelcomeScene id={routes.welcome.id} />
        <PackagesScene
          id={routes.packages.id}
          handle={this.state.handle}
          profiles={this.state.profiles}
          packages={this.state.packages}
          showAuthorPackagesOnly={this.state.showAuthorPackagesOnly}
          onAuthorOnlyChange={null}
          onRequestDownloads={this.onRequestDownloads.bind(this)}
          onRequestProfile={this.onRequestProfile.bind(this)}
          onAuthorOnly={() => this.setState({showAuthorPackagesOnly: true})}
          onAuthorAll={() => this.setState({showAuthorPackagesOnly: false})}
          onDetails={this.onDetails.bind(this)}
          />
        <DetailsScene
          id={routes.details.id}
          packageId={this.state.packageId}
          handle={this.state.handle}
          profiles={this.state.profiles}
          packages={this.state.packages}
          packageDetails={this.state.packageDetails}
          onRequestPackageDetails={this.onRequestPackageDetails.bind(this)}
          onPackages={this.onPackages.bind(this)}
          onAddProfile={this.onAddProfile.bind(this)}
          />
        <AboutScene
          id={routes.about.id}
          profiles={this.state.profiles}
          packages={this.state.packages}
          onResetApp={this.onResetApp.bind(this)}
          />
      </AppFrame>
    );
  }
}
