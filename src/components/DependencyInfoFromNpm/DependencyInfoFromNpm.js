// @flow
import React, { Component } from 'react';
import { InstantSearch, Configure } from 'react-instantsearch/dom';
import {
  connectHits,
  connectRefinementList,
} from 'react-instantsearch/connectors';

import { ALGOLIA_KEYS } from '../../constants';

export type NpmResult = {
  name: string,
  latestVersion: string,
  lastUpdatedAt: number,
  isLoading: boolean,
};

type Props = {
  packageName: string,
  children: (info: NpmResult) => React$Node,
};

const FilterByIds = connectRefinementList(() => null);

const Result = connectHits(({ hits, packageName, children }: any) => {
  // InstantSearch is meant to deal with multiple results, but in this case,
  // we just want info on the 1 result.
  const [hit] = hits;

  if (!hit || hit.name !== packageName) {
    // TODO: Presumably there's a HOC to figure out loading state, I should
    // use that instead of just assuming if it doesn't exist, it's loading.
    return children({ isLoading: true });
  }

  const info = {
    name: hit.name,
    latestVersion: hit.version,
    lastUpdatedAt: hit.modified,
    isLoading: false,
  };

  return children(info);
});

class DependencyInfoFromNpm extends Component<Props> {
  render() {
    const { packageName, children } = this.props;

    return (
      <InstantSearch {...ALGOLIA_KEYS}>
        <Configure
          attributesToRetrieve={['name', 'version', 'modified']}
          hitsPerPage={1}
        />
        <FilterByIds attribute="objectID" defaultRefinement={[packageName]} />
        <Result packageName={packageName}>{children}</Result>
      </InstantSearch>
    );
  }
}

export default DependencyInfoFromNpm;
