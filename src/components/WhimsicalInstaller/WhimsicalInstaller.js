// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import File from './File';
import Folder from './Folder';
import Earth from '../Earth';

type Props = {
  width: number,
};

class WhimsicalInstaller extends Component<Props> {
  render() {
    const { width } = this.props;

    // Our height will be 1/3rd of our width.
    // This is so we end up with 3 squares:
    //  _____________________
    // |      |      |      |
    // |      |      |      |
    // |______|______|______|
    //
    const height = width / 3;

    return (
      <Wrapper>
        <PlanetContainer size={height}>
          <Earth size={height / 2} />
        </PlanetContainer>
        <File size={height / 4} x={500} y={60} />
        <FolderContainer size={height}>
          <Folder size={height / 3} />
        </FolderContainer>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const PlanetContainer = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FolderContainer = styled.div`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default WhimsicalInstaller;
