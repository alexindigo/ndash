import React, { Component } from 'react';
import { } from 'react-native';

import { prettifyNumber } from '../../helpers/text';

import ContentBlock from '../ContentBlock';
import NamedBlock from '../NamedBlock';
import LabeledText from '../LabeledText';
import Drawers from '../Drawers';

import styles from '../../styles';

export default class PackagePopularity extends Component {

  render() {
    const pkg = this.props.package;
    const details = this.props.details || {};

    return (
      <NamedBlock
        title="popularity"
        style={styles.detailsSection}
        >

        <ContentBlock
          style={styles.detailsSectionContent}
          >
          <Drawers
            style={styles.detailsSectionContentDrawers}
            >

            <LabeledText
              label="dependents"
              style={styles.detailsSectionContentLabeledText}
              >
              {details.collected && details.collected.npm
                ? prettifyNumber(details.collected.npm.dependentsCount)
                : '--'
              }
            </LabeledText>

            <LabeledText
              label="npm"
              style={styles.detailsSectionContentLabeledText}
              >
              {details.collected && details.collected.npm
                ? '\u2605' + prettifyNumber(details.collected.npm.starsCount)
                : '--'
              }
            </LabeledText>

            <LabeledText
              label="github"
              style={styles.detailsSectionContentLabeledText}
              >
              {details.collected && details.collected.github
                ? '\u2605' + prettifyNumber(details.collected.github.starsCount)
                : '--'
              }
            </LabeledText>

            <LabeledText
              label="forks"
              style={styles.detailsSectionContentLabeledText}
              >
              {details.collected && details.collected.github
                ? prettifyNumber(details.collected.github.forksCount)
                : '--'
              }
            </LabeledText>

            <LabeledText
              label="subscribers"
              style={styles.detailsSectionContentLabeledText}
              >
              {details.collected && details.collected.github
                ? prettifyNumber(details.collected.github.subscribersCount)
                : '--'
              }
            </LabeledText>

          </Drawers>

        </ContentBlock>
      </NamedBlock>
    );
  }
}
