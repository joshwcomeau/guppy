// @flow
import React, { PureComponent } from 'react';
import fetch from 'node-fetch'; // Note: This is using net.request from Node. Browser fetch throws CORS error.
import styled from 'styled-components';
import yaml from 'js-yaml';
import Scrollbars from 'react-custom-scrollbars';
// import { SearchBox } from 'react-instantsearch/dom';
// import {
//   InstantSearch,
//   InfiniteHits,
//   Configure,
// } from 'react-instantsearch/dom';

import Paragraph from '../../Paragraph';
import Heading from '../../Heading';

// import { ALGOLIA_KEYS } from '../../../constants';

type Props = {
  onSelect: string => string,
  selectedStarter: string,
};

type State = {
  loading: boolean,
  starters: Array<any>,
};

/*
Gatsby starter selection dialog.
A starter object from starter.yml contains the following data:
[
   {
      "url": "https://wonism.github.io/",
      "repo": "https://github.com/wonism/gatsby-advanced-blog",
      "description": "n/a",
      "tags": [
        "Portfolio",
        "Redux"
      ],
      "features": [
        "feature items"
      ]
  }, ... 
]
*/
class SelectStarterDialog extends PureComponent<Props, State> {
  state = {
    loading: true,
    starters: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('new props', nextProps, prevState);
    return prevState;
  }

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

  render() {
    const { onSelect, selectedStarter } = this.props;
    const { starters } = this.state;
    console.log('render dialog', selectedStarter);
    return (
      <Wrapper>
        <Paragraph>
          Please select a starter template for your new project.
        </Paragraph>
        <ScrollContainer>
          <StarterList>
            {selectedStarter}
            {starters.slice(0, 10).map((starter, index) => (
              <StarterItem
                selected={selectedStarter === starter.repo}
                key={index}
                onClick={() => onSelect(starter.repo)}
              >
                <Heading size="small">{starter.repo}</Heading>
                {starter.description !== 'n/a' && (
                  <Paragraph>{starter.description}</Paragraph>
                )}
              </StarterItem>
            ))}
          </StarterList>

          {/* We could add Algolia here --> Setup at Algolia required */}
          {/* <InstantSearch {...ALGOLIA_KEYS}>
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
          <SearchBox onChange={value => console.log(value)} />
          <InfiniteHits
            hitComponent={({ hit }) => (
              <div onClick={() => onSelect(hit.name)}>
                {hit.name}
              </div>
            )}
          />
        </InstantSearch> */}
        </ScrollContainer>
      </Wrapper>
    );
  }
}

const ScrollContainer = styled(Scrollbars)`
  min-height: 60vh;
`;

const StarterList = styled.div``;
const StarterItem = styled.div`
  border: 2px solid ${props => (props.selected ? 'red' : 'transparent')};
`;

const Wrapper = styled.div`
  padding: 10px;
`;

export default SelectStarterDialog;
