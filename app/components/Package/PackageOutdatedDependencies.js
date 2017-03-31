import React, { Component } from 'react';
import { Text, View } from 'react-native';

import ListView from '../../lib/hacks/ListView';

import ContentBlock from '../ContentBlock';
import NamedBlock from '../NamedBlock';

import styles from '../../styles';

export default class PackageOutdatedDependencies extends Component {

  constructor(props) {
    super(props);

    this.dependenciesList = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
            >{dep[1].required}</Text>
        </View>
        <View style={styles.detailsDependenciesCell}>
          <Text
            style={styles.detailsDependenciesCellLabel}
            >{dep[1].latest}</Text>
        </View>
      </View>
    );
  }

  render() {
    const pkg = this.props.package;
    const details = this.props.details || {};

    if (!details.collected || !details.collected.source || !details.collected.source.outdatedDependencies) {
      return null;
    }

    const dependencies = Object.entries(details.collected.source.outdatedDependencies);

    return (
      <NamedBlock
        title={'outdated dependencies • ' + dependencies.length}
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
            <View style={styles.detailsDependenciesCell}>
              <Text
                style={[styles.detailsDependenciesCellLabel, styles.detailsDependenciesHeaderCellLabel]}
                >latest</Text>
            </View>
          </View>

          <ListView
            style={styles.detailsDependenciesList}
            initialListSize={10}
            pageSize={10}
            scrollRenderAheadDistance={10}
            dataSource={this.dependenciesList.cloneWithRows(dependencies)}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
            sceneScrollView={this.props.sceneScrollView}
          />

        </ContentBlock>
      </NamedBlock>
    );
  }
}
