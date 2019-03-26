// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { InstantSearch, Configure } from 'react-instantsearch/dom';
import {
  connectHits,
  connectRefinementList,
} from 'react-instantsearch/connectors';

import { getOnlineState } from '../../reducers/app-status.reducer';

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
  isOnline: boolean,
};

type State = {
  refresh: boolean,
};

const FilterByIds = connectRefinementList(() => null);

const Result = connectHits(({ hits, packageName, children }: any) => {
  // InstantSearch is meant to deal with multiple results, but in this case,
  // we just want info on the 1 result.
  const [hit] = hits;

  if (!hit || hit.name !== packageName) {
    // TODO: Presumably there's a HOC to figure out loading state, I should
    // use that instead of just assuming if it doesn't exist, it's loading.
    return children({
      isLoading: true,
    });
  }

  const info = {
    name: hit.name,
    latestVersion: hit.version,
    lastUpdatedAt: hit.modified,
    isLoading: false,
  };

  return children(info);
});

class DependencyInfoFromNpm extends Component<Props, State> {
  /*
   * Requires internal state to handle the refresh of the cache.
   */
  constructor(props) {
    super(props);
    this.state = {
      refresh: false,
    };
  }
  /*
   * When the app is offline and comes back online this will refresh the cache and search again for updates
   * This is particularly important when the app is launched offline and then connects to internet.
   */
  componentDidUpdate(prevProps) {
    if (this.props.isOnline && this.props.isOnline !== prevProps.isOnline) {
      this.refreshCache();
    }
  }
  refreshCache = () => {
    this.setState(
      {
        refresh: true,
      },
      () => {
        this.setState({
          refresh: false,
        });
      }
    );
  };
  render() {
    const { packageName, children, isOnline } = this.props;
    return (
      <InstantSearch {...ALGOLIA_KEYS} refresh={this.state.refresh}>
        <Configure
          attributesToRetrieve={['name', 'version', 'modified']}
          hitsPerPage={1}
          analyticsTags={['guppy', 'guppy-details']}
        />
        <FilterByIds attribute="objectID" defaultRefinement={[packageName]} />
        <Result packageName={packageName} isOnline={isOnline}>
          {children}
        </Result>
      </InstantSearch>
    );
  }
}

const mapStateToProps = state => ({
  isOnline: getOnlineState(state),
});

export default connect(
  mapStateToProps,
  null
)(DependencyInfoFromNpm);
