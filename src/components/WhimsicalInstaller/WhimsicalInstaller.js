// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v1';

import {
  generateFlightPath,
  getPositionOnQuadraticBezierPath,
  calculateDistanceBetweenPoints,
} from './WhimsicalInstaller.helpers';
import File from './File';
import Folder from './Folder';
import Earth from '../Earth';

import type { BezierPath } from './WhimsicalInstaller.helpers';

const FILE_SPEED = 4; // TODO: file-specific, slightly randomized?

type FileData = {
  id: string,
  x: number,
  y: number,
  status: 'autonomous' | 'eaten' | 'caught' | 'released',
  flightPath: BezierPath,
};

type Props = {
  width: number,
};

type State = {
  isFolderOpen: boolean,
  files: {
    [id: string]: FileData,
  },
};

class WhimsicalInstaller extends Component<Props, State> {
  grabbedFileId: ?string;
  tickId: ?number;
  wrapperNode: HTMLElement;
  wrapperBoundingBox: ClientRect;

  state = {
    isFolderOpen: false,
    files: {
      '1': {
        id: '1',
        x: 100,
        y: 100,
        status: 'autonomous',
        flightPath: generateFlightPath(this.props.width, this.props.width / 3),
      },
    },
  };

  componentDidMount() {
    this.wrapperBoundingBox = this.wrapperNode.getBoundingClientRect();

    this.tick();
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.dragFile);
    document.removeEventListener('mouseup', this.releaseFile);
  }

  getHeight = () => this.props.width * (1 / 3);

  handleClickFile = (id: string) => {
    // We want to allow files to be clicked and dragged _unless_ they're in
    // the process of being eaten.
    const { status } = this.state.files[id];
    if (status === 'eaten') {
      return;
    }

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

    this.updateFile(this.grabbedFileId, { x: relativeX, y: relativeY });
  };

  releaseFile = () => {
    document.removeEventListener('mousemove', this.dragFile);
    document.removeEventListener('mouseup', this.releaseFile);

    this.grabbedFileId = null;
  };

  updateFile = (fileId: string, properties: any) => {
    this.setState(state => ({
      files: {
        ...state.files,
        [fileId]: {
          ...state.files[fileId],
          ...properties,
        },
      },
    }));
  };

  autonomouslyIncrementFile = (file: FileData) => {
    const { width } = this.props;

    // We aren't actually storing the percentage through its journey.
    // Instead, we know its current X value, and the amount we want to
    // increment per tick.

    // Our flight path goes from 1/6th-width to 5/6th-width, since that's where
    // the planet and folder are located, respectively.
    // We need to know the progress through this journey, so we need to
    // transpose the points a bit.
    const transposedX = file.x - width * (1 / 6);
    const transposedMax = width * (4 / 6);

    const nextX = transposedX + FILE_SPEED;

    // This number between 0-1 tells us how far through our journey we are
    const ratioCompleted = nextX / transposedMax;

    const { x, y } = getPositionOnQuadraticBezierPath(
      file.flightPath,
      ratioCompleted
    );

    this.updateFile(file.id, { x, y });
  };

  continueEatingDoomedFiles = () => {
    const { width } = this.props;
    const { files } = this.state;

    const height = this.getHeight();
    const fileIds = Object.keys(files);

    const folderPosition = { x: width * (5 / 6), y: height * 0.5 };

    // If any of the files have made it to the very center of the folder,
    // we can remove them from the universe
    const swallowedFileIds = fileIds.filter(
      id => files[id].x === folderPosition.x && files[id].y === folderPosition.y
    );

    if (swallowedFileIds.length) {
      const nextFiles = fileIds.reduce((acc, id) => {
        if (swallowedFileIds.includes(id)) {
          return acc;
        }

        return {
          ...acc,
          [id]: files[id],
        };
      }, {});

      this.setState({ files: nextFiles });
    }

    const fileIdsBeingEaten = fileIds.filter(
      id => files[id].status === 'eaten' && !swallowedFileIds.includes(id)
    );

    fileIdsBeingEaten.forEach(id => {
      const file = files[id];

      const deltaX = folderPosition.x - file.x;
      const deltaY = folderPosition.y - file.y;

      const distanceToFolder = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      // We want to move FILE_SPEEDpx closer to the folder.
      // This is a math problem, because I don't know which ratio to mix
      // X and Y to have the hypothenuse get FILE_SPEEDpx shorter :/
      const slope = deltaY / deltaX;
      const amountToMoveY = slope * FILE_SPEED;
      const amountToMoveX = (1 - slope) * FILE_SPEED;

      this.updateFile(id, {
        x: file.x + amountToMoveX,
        y: file.y + amountToMoveY,
      });
    });
  };

  searchForNewSnacksNearFolder = () => {
    const { width } = this.props;
    const { files } = this.state;

    const height = this.getHeight();
    const fileIds = Object.keys(files);

    // Check if there are any files within range of our folder maw.
    // If so, open the maw and update their status!
    //
    // Folders have a 50px radius around them that sucks files in.
    // NOTE: This isn't dependent on `width` to make the calculations easier.
    // Might change later.
    const FOLDER_EAT_RADIUS = 75;
    const folderPosition = { x: width * (5 / 6), y: height * 0.5 };

    const nonEatenFileIds = fileIds.filter(id => files[id].status !== 'eaten');

    const nonEatenFileIdsWithinPerimeter = nonEatenFileIds.filter(id => {
      const filePosition = files[id];
      const distanceBetweenPoints = calculateDistanceBetweenPoints(
        filePosition,
        folderPosition
      );

      return distanceBetweenPoints < FOLDER_EAT_RADIUS;
    });

    nonEatenFileIdsWithinPerimeter.forEach(fileId => {
      this.updateFile(fileId, { status: 'eaten' });

      if (!this.state.isFolderOpen) {
        this.setState({ isFolderOpen: true });
      }
    });
  };

  tick = () => {
    const { width } = this.props;
    const { files } = this.state;

    const height = this.getHeight();
    const fileIds = Object.keys(files);

    // We may have a file autonomously flying towards the folder. If so, we
    // need to move it!
    const autonomousFileId = fileIds.find(
      fileId => files[fileId].status === 'autonomous'
    );

    if (autonomousFileId) {
      const autonomousFile = files[autonomousFileId];
      this.autonomouslyIncrementFile(autonomousFile);
    }

    // If any files are currently making their way towards the folder's maw,
    // continue moving them
    this.continueEatingDoomedFiles();

    this.searchForNewSnacksNearFolder();

    this.tickId = window.requestAnimationFrame(this.tick);
  };

  render() {
    const { width } = this.props;
    const { files, isFolderOpen } = this.state;

    // Our height will be 1/3rd of our width.
    // This is so we end up with 3 squares:
    //  _____________________
    // |      |      |      |
    // |      |      |      |
    // |______|______|______|
    //
    const height = this.getHeight();

    const filesArray = Object.keys(files).map(fileId => files[fileId]);

    return (
      <Wrapper width={width} innerRef={node => (this.wrapperNode = node)}>
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
          <Folder isOpen={isFolderOpen} size={height / 3} />
        </FolderContainer>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: ${props => props.width}px;
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
