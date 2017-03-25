import React, { Component } from 'react';

import { Text } from 'react-native';

export default class TimeFromNow extends Component {

  constructor(props) {
    super(props);

    // from http://momentjs.com/docs/#/displaying/tonow/
    this.waitingPeriods = {
      1               : 500,           // wait for 500ms if elapsed time is more than a millisecond
      [3 * 1000]      : 1000,          // wait for 1 second if elapsed time is more than 3 seconds
      [50 * 1000]     : 10 * 1000,     // wait for 10 seconds if elapsed time is more than 50 seconds
      [50 * 60 * 1000]: 5 * 60 * 1000, // wait for 5 minutes if elapsed time is more than 50 minutes
    };

    this.state = {
      time: this.props.time
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({time: nextProps.time});
  }

  componentDidMount() {
    this.updateTime();
  }

  componentDidUpdate() {
    this.updateTime();
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  updateTime() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    const diff = -1 * this.state.time.diff(Date.now());
    let waitFor = 7500;

    // find wait period for the time difference
    Object.keys(this.waitingPeriods).some((step) => {
      if (Math.floor(diff / step) > 0) {
        waitFor = this.waitingPeriods[step];
      } else {
        // out of range, stop here
        return true;
      }
    });

    this.timeoutId = setTimeout(() => {
      this.setState({ time: this.state.time });
    }, waitFor);
  }

  render() {
    return (
      <Text style={this.props.style}>{this.state.time.fromNow()}</Text>
    );
  }
}
