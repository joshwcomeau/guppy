// @flow
import React, { Fragment, Component } from 'react';
import fetch from 'node-fetch'; // Note: This is using net.request from Node. Browser fetch throws CORS error.
import yaml from 'js-yaml';
import Fuse from 'fuse.js';
import validUrl from 'valid-url';

import TextInputWithButton from '../../TextInputWithButton';
import SelectStarterList from './SelectStarterList';

type Props = {
  projectStarter: string,
  isFocused: boolean,
  handleFocus: string => void,
  onSelect: string => void,
};

type State = {
  starterListVisible: boolean,
  starters: Array<any>,
  paginationIndex: number,
  filterString: string,
  loading: boolean,
  error: ?Error,
};

const fuseOptions = {
  shouldSort: true,
  tokenize: true,
  findAllMatches: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 80,
  minMatchCharLength: 1,
  keys: ['repo', 'description'],
};
class ProjectStarter extends Component<Props, State> {
  state = {
    starterListVisible: false,
    filterString: '',
    starters: [],
    paginationIndex: 4,
    loading: true,
    error: null,
  };

  PAGINATION_STEP = 4;
  filteredStarters: Array<any> = [];

  componentDidMount() {
    return fetch(
      'https://raw.githubusercontent.com/gatsbyjs/gatsby/master/docs/starters.yml'
    )
      .then(response => response.text())
      .then(yamlText => {
        const starters = yaml.safeLoad(yamlText);

        this.setState({
          starters,
          loading: false,
          error: null,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error,
        });
      });
  }

  handleShowMore = () => {
    let newIndex = this.state.paginationIndex + this.PAGINATION_STEP;
    newIndex = Math.min(this.state.starters.length, newIndex); // limit
    this.setState({
      paginationIndex: newIndex,
    });
  };

  handleOnSelect = (selectedStarterUrl: string, removeSelection: boolean) => {
    const { onSelect } = this.props;
    onSelect(removeSelection ? '' : selectedStarterUrl);
  };

  toggleStarterSelection = () => {
    const { projectStarter } = this.props;
    this.setState(state => ({
      starterListVisible: !state.starterListVisible || !!projectStarter,
    }));
  };

  isExactMatch = (filterString: string) => {
    const { starters } = this.state;

    return starters.find(
      starter =>
        starter.repo === filterString ||
        (starter.repo
          .split('/')
          .pop()
          .toString() === filterString &&
          !filterString.includes('http'))
    );
  };

  updateSearchString = (filterString: string) => {
    const { projectStarter, onSelect } = this.props;

    this.setState({
      starterListVisible: filterString !== '' || !!projectStarter,
      filterString,
    });

    // Check if filterString matches a url in starters array or a name (last part of url with-out http).
    // Automatically selects starter on match
    const matchedStarter = this.isExactMatch(filterString);
    if (matchedStarter) {
      onSelect(matchedStarter.repo);
    } else if (validUrl.isUri(filterString)) {
      // We're selecting the filterString as starter here as it's not matching a starter from the list but it's a url
      // Before building we're doing an final check if it exists
      onSelect(filterString);
    }
  };

  render() {
    const { handleFocus, projectStarter, isFocused } = this.props;
    const {
      starterListVisible,
      starters,
      paginationIndex,
      filterString,
      loading,
      error,
    } = this.state;
    let fuse;
    let selectedStarter = [];
    let limitedStarters = [];

    if (!loading && starters) {
      // Loaded & starters available
      fuse = new Fuse(starters, fuseOptions);
      this.filteredStarters =
        filterString === '' ? starters : fuse.search(filterString); //projectStarter);
      selectedStarter = starters.find(
        starter => starter.repo === projectStarter
      );

      if (selectedStarter) {
        // Remove the selected from list if available
        this.filteredStarters = this.filteredStarters.filter(
          starter => starter !== selectedStarter
        );
        // Always re-add selectedStarter to top of list otherwise the selected starter could be on a different pagination page
        this.filteredStarters.unshift(selectedStarter); // add selected as first element as we always want the selected to be in the list
      }
      limitedStarters = this.filteredStarters.slice(0, paginationIndex);
    }
    return (
      <Fragment>
        <TextInputWithButton
          placeholder="Pick a starter e.g. type blog ..."
          onChange={this.updateSearchString}
          onFocus={handleFocus}
          handleFocus={handleFocus}
          isFocused={isFocused}
          value={filterString}
          onClick={this.toggleStarterSelection}
        />
        {!loading &&
          !error && (
            <SelectStarterList
              isVisible={starterListVisible}
              selectedStarter={projectStarter}
              starters={limitedStarters}
              handleShowMore={this.handleShowMore}
              updateStarter={this.handleOnSelect}
              paginationIndex={paginationIndex}
              lastIndex={this.filteredStarters.length}
            />
          )}
      </Fragment>
    );
  }
}

export default ProjectStarter;
