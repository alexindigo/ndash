import React, { Component } from 'react';
import { Text, View } from 'react-native';

import ListView from '../../lib/hacks/ListView';

import ContentBlock from '../ContentBlock';
import NamedBlock from '../NamedBlock';

import styles from '../../styles';

export default class PackageDependencies extends Component {

  constructor(props) {
    super(props);

    this.dependenciesList = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (h1, h2) => h1 !== h2
    });
  }

  renderSectionHeader(sectionData, sectionId) {
    return (
      <View style={styles.detailsDependenciesSectionHeader}>
        <Text
          style={styles.detailsDependenciesSectionHeaderLabel}
          >{sectionId}</Text>
      </View>
    );
  }

  renderRow(dep, sectionId, rowId) {

    const isOdd = (rowId % 2);

    return (
      <View style={[styles.detailsDependenciesRow, isOdd ? styles.detailsDependenciesRowAlt : null]}>
        <View style={[styles.detailsDependenciesCell, styles.detailsDependenciesCellPackage]}>
          <Text
            style={styles.detailsDependenciesCellLabel}
            >{dep[0]}</Text>
        </View>
        <View style={styles.detailsDependenciesCell}>
          <Text
            style={styles.detailsDependenciesCellLabel}
            >{dep[1]}</Text>
        </View>
      </View>
    );
  }

  render() {
    const source = {};

    const pkg = this.props.package;
    const details = this.props.details || {};

    if (!details.latestVersion || (!details.latestVersion.dependencies && !details.latestVersion.devDependencies)) {
      return null;
    }

    const dependencies = Object.entries(details.latestVersion.dependencies || {}) || [];
    const devDependencies = Object.entries(details.latestVersion.devDependencies || {}) || [];

    // another filter for badly formatted data
    // some of the deps lists are empty objects
    if (!dependencies.length && !devDependencies.length) {
      return null;
    }

    if (dependencies.length) {
      source['production'] = dependencies;
    }
    if (devDependencies.length) {
      source['development'] = devDependencies;
    }

    const dataSource = this.dependenciesList.cloneWithRowsAndSections(source);

    return (
      <NamedBlock
        title={'dependencies • ' + dependencies.length + (devDependencies.length ? ' • ' + devDependencies.length : '')}
        style={styles.detailsSection}
        >

        <ContentBlock
          style={styles.detailsSectionContent}
          >

          <View style={[styles.detailsDependenciesRow, styles.detailsDependenciesHeader]}>
            <View style={[styles.detailsDependenciesCell, styles.detailsDependenciesCellPackage]}>
              <Text
                style={[styles.detailsDependenciesCellLabel, styles.detailsDependenciesHeaderCellLabel]}
                >package</Text>
            </View>
            <View style={styles.detailsDependenciesCell}>
              <Text
                style={[styles.detailsDependenciesCellLabel, styles.detailsDependenciesHeaderCellLabel]}
                >required</Text>
            </View>
          </View>

          <ListView
            style={styles.detailsDependenciesList}
            contentContainerStyle={styles.detailsDependenciesListContent}
            initialListSize={10}
            pageSize={10}
            scrollRenderAheadDistance={10}
            dataSource={dataSource}
            renderRow={this.renderRow.bind(this)}
            renderSectionHeader={this.renderSectionHeader.bind(this)}
            enableEmptySections={true}
            sceneScrollView={this.props.sceneScrollView}
          />

        </ContentBlock>
      </NamedBlock>
    );
  }
}
