// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import File from './File';
import Folder from './Folder';
import Earth from '../Earth';

type FileData = {
  id: string,
  x: number,
  y: number,
  status: 'autonomous' | 'arrived' | 'caught' | 'released',
};

type Props = {
  width: number,
};

type State = {
  files: {
    [id: string]: FileData,
  },
};

class WhimsicalInstaller extends Component<Props, State> {
  grabbedFileId: ?string;
  wrapperNode: HTMLElement;
  wrapperBoundingBox: ClientRect;

  state = {
    files: {
      '1': {
        id: '1',
        x: 300,
        y: 100,
        status: 'autonomous',
      },
    },
  };

  componentDidMount() {
    this.wrapperBoundingBox = this.wrapperNode.getBoundingClientRect();
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.dragFile);
    document.removeEventListener('mouseup', this.releaseFile);
  }

  handleClickFile = (id: string) => {
    document.addEventListener('mousemove', this.dragFile);
    document.addEventListener('mouseup', this.releaseFile);

    this.grabbedFileId = id;
  };

  dragFile = ({ clientX, clientY }: any) => {
    const relativeX = clientX - this.wrapperBoundingBox.left;
    const relativeY = clientY - this.wrapperBoundingBox.top;

    // should be impossible.
    if (!this.grabbedFileId) {
      throw new Error('Dragging file without a specified file ID');
    }

    this.setState({
      files: {
        ...this.state.files,
        [this.grabbedFileId]: {
          ...this.state.files[this.grabbedFileId],
          x: relativeX,
          y: relativeY,
        },
      },
    });
  };

  releaseFile = () => {
    document.removeEventListener('mousemove', this.dragFile);
    document.removeEventListener('mouseup', this.releaseFile);

    this.grabbedFileId = null;
  };

  render() {
    const { width } = this.props;
    const { files } = this.state;

    // Our height will be 1/3rd of our width.
    // This is so we end up with 3 squares:
    //  _____________________
    // |      |      |      |
    // |      |      |      |
    // |______|______|______|
    //
    const height = width / 3;

    const filesArray = Object.keys(files).map(fileId => files[fileId]);

    return (
      <Wrapper innerRef={node => (this.wrapperNode = node)}>
        <PlanetContainer size={height}>
          <Earth size={height / 2} />
        </PlanetContainer>
        {filesArray.map(file => (
          <File
            key={file.id}
            size={height / 4}
            x={file.x}
            y={file.y}
            id={file.id}
            handleMouseDown={this.handleClickFile}
          />
        ))}
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
  position: relative;
  z-index: 4;
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
