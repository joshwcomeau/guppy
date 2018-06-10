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
        apiKey="f54e21fa3a2a0160595bb058179bfb1e"
        indexName="npm-search"
      >
        {this.props.children}
      </InstantSearch>
    );
  }
}

export default AddDependencySearchProvider;
