import React, { Component } from 'react';
import { } from 'react-native';

import { prettifyNumber } from '../../helpers/text';

import ContentBlock from '../ContentBlock';
import NamedBlock from '../NamedBlock';
import LabeledText from '../LabeledText';
import Drawers from '../Drawers';

import styles from '../../styles';

export default class PackageActivity extends Component {

  renderCommits() {
    const details = this.props.details || {};

    const commits = details.collected && details.collected.github && details.collected.github.commits;
    let rangeCount = 0;
    let rangePeriod;

    if (!commits) {
      return '--';
    }

// <https://api.github.com/repositories/1755793/commits?per_page=1&page=2>; rel="next", <https://api.github.com/repositories/1755793/commits?per_page=1&page=203>; rel="last"

    commits.some(({from, to, count}) => {
      rangeCount = count;
      rangePeriod = {from, to};
      return count > 0;
    });

    return rangeCount;
  }

  render() {
    const pkg = this.props.package;
    const details = this.props.details || {};

    return (
      <NamedBlock
        title="activity"
        style={styles.detailsSection}
        >

        <ContentBlock
          style={styles.detailsSectionContent}
          >
          <Drawers
            style={styles.detailsSectionContentDrawers}
            >

            <LabeledText
              label="open issues"
              style={styles.detailsSectionContentLabeledText}
              >
              {details.collected && details.collected.github && details.collected.github.issues
                ? prettifyNumber(details.collected.github.issues.openCount)
                : '--'
              }
            </LabeledText>

            <LabeledText
              label="total issues"
              style={styles.detailsSectionContentLabeledText}
              >
              {details.collected && details.collected.github && details.collected.github.issues
                ? prettifyNumber(details.collected.github.issues.count)
                : '--'
              }
            </LabeledText>

            <LabeledText
              label="releases"
              style={styles.detailsSectionContentLabeledText}
              >
              {details.versions
                ? prettifyNumber(Object.keys(details.versions).length)
                : (details.releasesCount
                    ? details.releasesCount
                    : '--'
                  )
              }
            </LabeledText>

            <LabeledText
              label="contributors"
              style={styles.detailsSectionContentLabeledText}
              >
              {details.collected && details.collected.github && details.collected.github.contributors
                ? (details.collected.github.contributors.length > 99
                  ? '99+'
                  : details.collected.github.contributors.length
                  )
                : '--'
              }
            </LabeledText>

          </Drawers>

        </ContentBlock>
      </NamedBlock>
    );
  }
}
