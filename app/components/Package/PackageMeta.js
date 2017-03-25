import React, { Component } from 'react';
import { Text } from 'react-native';

import moment from 'moment';

import { prettifyNumber } from '../../helpers/text';

import ContentBlock from '../ContentBlock';
import NamedBlock from '../NamedBlock';
import Keywords from '../Keywords';
import LabeledText from '../LabeledText';
import Drawers from '../Drawers';
import TimeFromNow from '../TimeFromNow';

import styles from '../../styles';

export default class PackageMeta extends Component {

  formatNodeVersion(version) {
    return (version && version != '*') ? version.replace(/^(\S+?)\s*([\d.]+)$/, '$1 $2') : 'any';
  }

  renderLicense() {
    const details = this.props.details || {};
    let license;
    let tooLong = false;
    let notTooLong = false;

    if (details.license) {
      if (details.license.indexOf('OR') > -1)
      {
        // adjust fontSize for longer text
        notTooLong = true;

        if (details.license.length > 20) {
          tooLong = true;
        }

        // and remove brakets if present
        // replace `or` with something more visual
        license = details.license
          .replace(/\(|\)/g, '')
          .replace(/ OR /g, ', ')
          ;
      } else {
        license = details.license;
      }
    } else {
      license = '--';
    }

    return (
      <LabeledText
        label="license"
        style={[
          styles.detailsSectionContentLabeledText,
          notTooLong ? styles.detailsSectionContentLabeledTextMedium : {},
          tooLong ? styles.detailsSectionContentLabeledTextLong : {}
        ]}
        >
        {license.toLowerCase()}
      </LabeledText>
    );
  }

  renderNodeVersion() {
    const latestVersion = (this.props.details || {}).latestVersion;

    if (!latestVersion) {
      return '--';
    }

    return this.formatNodeVersion(
      (
        latestVersion.engines
        && latestVersion.engines.node
      )
      ||
      (
        latestVersion.engine
        && latestVersion.engine.node
      )
    );
  }

  render() {
    const pkg = this.props.package;
    const details = this.props.details || {};

    return (
      <NamedBlock
        title="package"
        style={styles.detailsSection}
        >
        <ContentBlock
          style={styles.detailsSectionContent}
          >

          <Drawers
            attachedTop
            style={styles.detailsSectionContentDrawers}
            >

            {this.renderLicense()}

            <LabeledText
              label="version"
              style={styles.detailsSectionContentLabeledText}
              >
              {pkg.version}
            </LabeledText>

            <LabeledText
              label="node version"
              style={styles.detailsSectionContentLabeledText}
              >
              {this.renderNodeVersion()}
            </LabeledText>

          </Drawers>

          <Text
            style={styles.detailsSectionContentText}
            >
            {(pkg.description || '--').toLowerCase()}
          </Text>

          <Keywords
            style={styles.detailsKeywords}
            wordStyle={styles.detailsKeywordsWord}
            keywords={pkg.keywords}
            />

          <Drawers
            attachedBottom
            style={styles.detailsSectionContentDrawers}
            >

            <LabeledText
              label="last published"
              style={styles.detailsSectionContentLabeledText}
              >
              {
                pkg.date
                ? <TimeFromNow time={moment(pkg.date)} />
                : '--'
              }
            </LabeledText>

            <LabeledText
              label="created"
              style={styles.detailsSectionContentLabeledText}
              >
              {
                details.time
                ? <TimeFromNow time={moment(details.time.created)} />
                : '--'
              }
            </LabeledText>

          </Drawers>

        </ContentBlock>
      </NamedBlock>
    );
  }
}
