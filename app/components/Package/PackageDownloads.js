import React, { Component } from 'react';
import { Text, View } from 'react-native';

import moment from 'moment';

import { prettifyNumber } from '../../helpers/text';

import ContentBlock from '../ContentBlock';
import NamedBlock from '../NamedBlock';
import LabeledText from '../LabeledText';
import Drawers from '../Drawers';
import DownloadsChart from '../DownloadsChart';

import styles from '../../styles';

export default class PackageDownloads extends Component {

  constructor(props) {
    super(props);

    this.state = {
      range: 'month',
      ticks: [],
      scaled: []
    };
  }

  onDrawerPress(child) {
    this.setState({range: child.props.label});
  }

  onTicks(ticks, scaled) {
    // poor man's shallow equal
    if (ticks.toString() != this.state.ticks.toString()
      || scaled.toString() != this.state.scaled.toString()
    ) {
      this.setState({ticks, scaled});
    }
  }

  getTextStyle(label)
  {
    let style = styles.detailsSectionContentLabeledText;

    if (this.state.range == label) {
      style = [styles.detailsSectionContentLabeledText, styles.detailsSectionContentLabeledTextEmphasis];
    }

    return style;
  }

  renderTicks() {
    return (
      <View
        style={styles.detailsChartTicks}
        >
        {
          this.state.ticks
            .map((tick, index) => (
              <Text
                key={'tick_' + tick}
                style={[styles.detailsChartTicksLabel, {
                  bottom: this.state.scaled[index] + 2
                }]}
                >
                {prettifyNumber(tick)}
              </Text>
            ))
        }
      </View>
    );
  }

  render() {
    const pkg = this.props.package;
    const details = this.props.details || {};

    return (
      <NamedBlock
        title="downloads"
        style={styles.detailsSection}
        >

        <ContentBlock
          style={styles.detailsSectionContent}
          >
          <Drawers
            attachedTop
            onAction={this.onDrawerPress.bind(this)}
            style={styles.detailsSectionContentDrawers}
            >

            <LabeledText
              label="day"
              style={this.getTextStyle('day')}
              >
              {pkg.downloads && pkg.downloads['last-day'] && prettifyNumber(pkg.downloads['last-day'].downloads).toLowerCase() || '--'}
            </LabeledText>

            <LabeledText
              label="week"
              style={this.getTextStyle('week')}
              >
              {prettifyNumber(pkg.downloads && pkg.downloads['last-week'] && pkg.downloads['last-week'].downloads).toLowerCase() || '--'}
            </LabeledText>

            <LabeledText
              label="month"
              style={this.getTextStyle('month')}
              >
              {prettifyNumber(pkg.downloads && pkg.downloads['last-month'] && pkg.downloads['last-month'].downloads).toLowerCase() || '--'}
            </LabeledText>

            <LabeledText
              label="year"
              style={this.getTextStyle('year')}
              >
              {details.downloads && ('last-year' in details.downloads) ? prettifyNumber(details.downloads['last-year']).toLowerCase() : '--'}
            </LabeledText>

            <LabeledText
              label="total"
              style={this.getTextStyle('total')}
              >
              {details.downloads && ('total' in details.downloads) ? prettifyNumber(details.downloads.total).toLowerCase() : '--'}
            </LabeledText>

          </Drawers>

          <DownloadsChart
            range={this.state.range}
            details={details}
            style={styles.detailsChart}
            onTicks={this.onTicks.bind(this)}
            />

          { this.renderTicks() }

        </ContentBlock>

        {
          // there is rendering bug, that break downstream elements
          // if this element is rendered conditionally
          this.state.range == 'total'
          && details.time
          && details.time.created
          && moment(details.time.created).diff(moment('2012-10-22'), true) < 0
          ? <Text
              style={styles.detailsSectionFootnote}
              >
              * npm downloads only available after october 2012.
            </Text>
          : null
        }
      </NamedBlock>
    );
  }
}
