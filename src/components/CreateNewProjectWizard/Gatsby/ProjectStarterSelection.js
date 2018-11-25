// @flow
import React, { Fragment, Component } from 'react';
import fetch from 'node-fetch'; // Note: This is using net.request from Node. Browser fetch throws CORS error.
import yaml from 'js-yaml';
import Fuse from 'fuse.js';

import TextInputWithButton from '../../TextInputWithButton';
import SelectStarterList from './SelectStarterList';

type Props = {
  projectStarter: string,
  isFocused: boolean,
  handleFocus: string => void,
  onSelect: string => void,
  onFocus: () => void,
};

type State = {
  starterListVisible: boolean,
  starters: Array<any>,
  paginationIndex: number,
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
  };

  PAGINATION_STEP = 4;

  componentDidMount() {
    fetch(
      'https://raw.githubusercontent.com/gatsbyjs/gatsby/master/docs/starters.yml'
    )
      .then(response => response.text())
      .then(yamlText => {
        const starters = yaml.safeLoad(yamlText);

        this.setState({
          starters,
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

  toggleStarterSelection = () => {
    this.setState(state => ({
      starterListVisible: !state.starterListVisible,
    }));
  };

  updateSearchString = filterString => {
    this.setState({
      starterListVisible: filterString !== '',
    });
    // Note: We're directly using the projectStarter to filter the list.
    this.props.onSelect(filterString);
  };

  render() {
    const { handleFocus, projectStarter, isFocused, onSelect } = this.props;
    const { starterListVisible, starters, paginationIndex } = this.state;

    const fuse = new Fuse(starters, fuseOptions);
    const filteredStarters =
      projectStarter === '' ? starters : fuse.search(projectStarter);
    const limitedStarters = filteredStarters.slice(0, paginationIndex);

    return (
      <Fragment>
        <TextInputWithButton
          placeholder="Pick a starter e.g. type blog ..."
          onChange={this.updateSearchString}
          onFocus={handleFocus}
          handleFocus={handleFocus}
          isFocused={isFocused}
          value={projectStarter}
          onClick={this.toggleStarterSelection}
        />
        <SelectStarterList
          isVisible={starterListVisible}
          selectedStarter={projectStarter}
          starters={limitedStarters}
          handleShowMore={this.handleShowMore}
          updateStarter={onSelect}
          paginationIndex={paginationIndex}
          lastIndex={filteredStarters.length}
        />
      </Fragment>
    );
  }
}

export default ProjectStarter;
