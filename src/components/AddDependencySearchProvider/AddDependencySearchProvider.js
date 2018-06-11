// @flow
import React, { Component } from 'react';
import { InstantSearch } from 'react-instantsearch/dom';

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
        {this.props.children}
      </InstantSearch>
    );
  }
}

export default AddDependencySearchProvider;
