import React, { Component } from 'react';
import { Text } from 'react-native';

import ContentBlock from '../ContentBlock';
import NamedBlock from '../NamedBlock';
import Drawers from '../Drawers';
import Link from '../Link';

import styles from '../../styles';

export default class PackageLinks extends Component {

  render() {
    const pkg = this.props.package;
    const details = this.props.details || {};

    if (!details.collected || !details.collected.metadata || !details.collected.metadata.links) {
      return null;
    }

    return (
      <NamedBlock
        title="links"
        style={styles.detailsSection}
        >

        <ContentBlock
          style={styles.detailsSectionContent}
          >
          <Drawers
            style={styles.detailsSectionContentDrawers}
            >

            {
              details.collected.metadata.links.npm
              ? <Link
                  url={details.collected.metadata.links.npm}
                  >
                  <Text style={styles.detailsSectionContentLinkedText}>npm</Text>
                </Link>
              : null
            }

            {
              details.collected.metadata.links.repository
              ? <Link
                  url={details.collected.metadata.links.repository}
                  >
                  <Text style={styles.detailsSectionContentLinkedText}>
                    {details.collected.metadata.links.repository.match(/github\.com/)
                      ? 'github'
                      : 'repository'
                    }
                  </Text>
                </Link>
              : null
            }

            {
              details.collected.metadata.links.homepage
              // if homepage is github repo, there is no point
              && details.collected.metadata.links.homepage.indexOf(details.collected.metadata.links.repository) === -1
              ? <Link
                  url={details.collected.metadata.links.homepage}
                  >
                  <Text style={styles.detailsSectionContentLinkedText}>home</Text>
                </Link>
              : (
                details.collected.metadata.links.bugs
                ? <Link
                    url={details.collected.metadata.links.bugs}
                    >
                    <Text style={styles.detailsSectionContentLinkedText}>bugs</Text>
                  </Link>
                : null
              )
            }

            <Link
              url={'https://runkit.com/npm/' + pkg.name}
              >
              <Text style={styles.detailsSectionContentLinkedText}>try it</Text>
            </Link>

          </Drawers>

        </ContentBlock>
      </NamedBlock>
    );
  }
}
