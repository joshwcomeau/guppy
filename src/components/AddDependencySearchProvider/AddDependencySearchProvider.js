// @flow
import React, { Component } from 'react';
import { InstantSearch, Configure } from 'react-instantsearch/dom';

import { ALGOLIA_KEYS } from '../../constants';

type Props = {
  children: React$Node,
};

class AddDependencySearchProvider extends Component<Props> {
  render() {
    return (
      <InstantSearch {...ALGOLIA_KEYS}>
        <Configure
          attributesToRetrieve={[
            'name',
            'version',
            'description',
            'modified',
            'humanDownloadsLast30Days',
            'license',
          ]}
          hitsPerPage={10}
        />
        {this.props.children}
      </InstantSearch>
    );
  }
}

export default AddDependencySearchProvider;
