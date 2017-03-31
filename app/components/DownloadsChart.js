import React from 'react';
import {
  View,
  ART,
} from 'react-native';

import moment from 'moment';

import AnimShape from './AnimShape';
import { combine } from '../helpers/styles';

import { modeMedian } from '../vendor/d3fc-sample';

import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';
import {
  scaleLinear,
  scaleTime
} from 'd3-scale';

const {
  Surface,
  Group,
  Shape,
  Text
} = ART;

const d3 = {
  shape,
  scaleLinear,
  scaleTime
};

export default class DownloadsChart extends React.Component {

  constructor(props) {
    super(props);

    // https://github.com/d3fc/d3fc-sample
    this.sampler = modeMedian();
    this.sampler.value((d) => d[1]);

    this.state = {
      containerWidth: props.style.width
    };
  }

  componentWillMount() {
    this.computeNextState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.computeNextState(nextProps);
  }

  componentDidMount() {
    this.animationFrameWaiter = requestAnimationFrame(() => {
      this.measureView();
    });

    // report back ticks
    this.reportTicks();
  }

  componentDidUpdate() {
    this.animationFrameWaiter = requestAnimationFrame(() => {
      this.measureView();
    });

    // report back ticks
    this.reportTicks();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrameWaiter);
  }

  computeNextState(props) {

    this.height = props.style.height - 20;

    if (!props.details || !props.details.downloads || !props.details.downloads.counts) {
      return;
    }

    const today = moment();
    let downloads = Object.entries(props.details.downloads.counts);

    if (this.range != props.range || !this.data || this.data.length != downloads.length) {

      this.range = props.range;
      this.data = [];

      // pre-optimize for reducer and downsampler
      switch (this.range) {
        case 'year':
          downloads = downloads.slice(-366);
          break;

        case 'month':
          downloads = downloads.slice(-32);
          break;

        case 'week':
          downloads = downloads.slice(-8);
          break;

        case 'day':
          downloads = downloads.slice(-2);
          break;

        // keep it all for `total`
      }

      // don't do downsampling for ranges less than a year
      if (this.range == 'year' || this.range == 'total') {
        if (downloads.length > this.state.containerWidth / 2) {
          this.sampler.bucketSize(Math.floor(downloads.length / this.state.containerWidth * 2));
          downloads = this.sampler(downloads);
        }
      }

      // split values
      const extent = downloads.reduce((all, entry) => {
        // only if it matches the range
        if (
          ['day', 'total'].indexOf(this.range) == -1
          // make week equal 8 days
        && today.diff(moment(entry[0]), this.range == 'week'
          ? 'day'
          : this.range
          , true) > (this.range == 'week' ? 8 : 1)
        ) {
          return all;
        }

        all['dates'].push(entry[0]);
        all['downloads'].push(entry[1]);
        // only save matching entries
        this.data.push(entry);

        return all;
      }, {dates: [], downloads: []});

      this.extentX = d3Array.extent(extent['dates']);
      this.extentY = d3Array.extent(extent['downloads']);

      this.scaleX = this.getScaleX(this.extentX[0], this.extentX[1], this.state.containerWidth);
      // leave extra space at the top
      this.scaleY = this.getScaleY(this.extentY[0], this.extentY[1], this.height);

      this.ticksY = this.scaleY.ticks(4);
      this.ticksYScaled = this.ticksY.map((tick) => this.scaleY(tick));
    }
  }

  reportTicks() {
    if (!this.props.onTicks || !this.ticksY) {
      return;
    }

    this.props.onTicks(this.ticksY, this.ticksYScaled);
  }

  getScaleX(min, max, range) {
    const scaleX = d3.scaleTime()
      .domain([moment(min).toDate(), moment(max).toDate()])
      .range([0, range])
      ;
    return scaleX;
  }

  getScaleY(min, max, range) {
    const scaleY = d3.scaleLinear()
      .domain([0, max])
      .nice()
      .range([0, range])
      ;

    return scaleY;
  }

  // method that transforms data into a svg path (should be exposed as part of the AreaSpline interface)
  _createArea() {
    const area = d3.shape.area()
      .x((d) => this.scaleX(moment(d[0]).toDate()) )
      .y1((d) => -this.scaleY(d[1]) )
      .curve(d3.shape.curveBasis)
      (this.data)

    return { path : area };
  }

  _createGuides() {
    if (!this.ticksY) {
      return null;
    }

    const lines = this.ticksY
      // don't draw guide line for 0s
      .filter(t => t)
      .map((tick) => {
          return d3.shape.line()
            .x((d) => this.scaleX(moment(d[0]).toDate()))
            .y((d) => -this.scaleY(d[1]))
            ([
              [this.extentX[0], tick],
              [this.extentX[1], tick]
            ])
        })
      ;

    return lines;
  }

  measureView() {
    if (!this.refs.container) {
      return;
    }

    this.refs.container.measure((ox, oy, width, height) => {
      if (width !== this.state.containerWidth) {
        this.setState({containerWidth: width});
      }
    });
  }

  renderShape() {
    return (
      (this.data && this.data.length)
      ? <AnimShape
          color={this.props.style.color}
          d={() => this._createArea()}
          />
      : null
    );
  }

  renderGuides() {
    const lines = this._createGuides();
    const style = this.props.style;

    if (!lines) {
      return null;
    }

    return lines.map((path, key) => (
      <Group key={'guide_line_' + key}>
        <Shape
          d={path}
          stroke={style.borderTopColor || style.borderColor}
          strokeWidth={this.props.style.borderWidth}
          strokeDash={[1,5]}
          />
        <Shape
          y={this.props.style.borderWidth}
          d={path}
          stroke={style.borderBottomColor}
          strokeWidth={this.props.style.borderWidth}
          strokeDash={[1,5]}
          />
      </Group>
      )
    );
  }

  render() {

    const stylesContainer = combine(this.props.style, localStyles.container);

    return (
      <View
        ref="container"
        style={stylesContainer}
        >
        <Surface
          width={this.state.containerWidth}
          height={200}
          >
          <Group x={0} y={200}>
            { this.renderShape() }
            { this.renderGuides() }
          </Group>
        </Surface>
      </View>
    );
  }
}

const localStyles = {
  container: {
    width: undefined,
    height: undefined,
    color: undefined,
    borderColor: undefined,
    borderTopColor: undefined,
    borderRightColor: undefined,
    borderBottomColor: undefined,
    borderLeftColor: undefined,
    borderWidth: undefined
  }
};
