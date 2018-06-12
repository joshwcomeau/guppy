// @flow
import React, { Component } from 'react';
import { InstantSearch, Configure } from 'react-instantsearch/dom';

type Props = {
  children: React$Node,
};

class AddDependencySearchProvider extends Component<Props> {
  render() {
    return (
      <InstantSearch
        appId="OFCNCOG2CU"
        apiKey="7492903b80561e70bff1359d7052b4ae"
        indexName="npm-search"
      >
        <Configure
          attributesToRetrieve={[
            'name',
            'version',
            'description',
            'modified',
            'humanDownloadsLast30Days',
            'license',
          ]}
          attributesToHighlight={['name', 'description']}
          hitsPerPage={10}
        />
        {this.props.children}
      </InstantSearch>
    );
  }
}

export default AddDependencySearchProvider;
