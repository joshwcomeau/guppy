// @flow
import React, { PureComponent } from 'react';
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
const FOLDER_OPEN_RADIUS = 75;
const FOLDER_CLOSE_RADIUS = 10;
const FOLDER_GRAVITY_RADIUS = 50;

type FileData = {
  id: string,
  x: number,
  y: number,
  status: 'autonomous' | 'being-inhaled' | 'swallowed' | 'caught' | 'released',
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

class WhimsicalInstaller extends PureComponent<Props, State> {
  grabbedFileId: ?string;
  tickId: ?number;
  generationLoopId: ?number;
  wrapperNode: HTMLElement;
  wrapperBoundingBox: ClientRect;

  state = {
    isFolderOpen: false,
    files: {},
  };

  componentDidMount() {
    this.wrapperBoundingBox = this.wrapperNode.getBoundingClientRect();

    this.generationLoopId = window.setTimeout(this.fileGenerationLoop, 1000);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.dragFile);
    document.removeEventListener('mouseup', this.releaseFile);

    window.clearTimeout(this.generationLoopId);
    window.cancelAnimationFrame(this.tickId);
  }

  getHeight = () => this.props.width * (1 / 3);
  getPlanetPoint = () => ({
    x: this.props.width * (1 / 6),
    y: this.getHeight() * 0.5,
  });
  getFolderPoint = () => ({
    x: this.props.width * (5 / 6),
    y: this.getHeight() * 0.5,
  });

  fileGenerationLoop = () => {
    const { files } = this.state;

    const fileIds = Object.keys(files);

    // Is this our very first file?
    const isFirstFile = fileIds.length === 0;

    const newFile = this.createFile();

    this.setState(
      state => {
        const swallowedFileIds = fileIds.filter(
          id => files[id].status === 'swallowed'
        );

        let persistedFiles = { ...state.files };

        if (swallowedFileIds.length > 1) {
          delete persistedFiles[swallowedFileIds[0]];
        }

        return {
          files: {
            ...persistedFiles,
            [newFile.id]: newFile,
          },
        };
      },
      () => {
        if (isFirstFile) {
          this.tick();
        }
      }
    );

    const DELAY = Math.random() * 2000 + 2000; // 2-4sec delay

    window.setTimeout(this.fileGenerationLoop, DELAY);
  };

  createFile = () => {
    const { width } = this.props;
    const height = this.getHeight();

    const fileId = uuid();

    const startingPoint = this.getPlanetPoint();

    return {
      id: fileId,
      x: startingPoint.x,
      y: startingPoint.y,
      status: 'autonomous',
      flightPath: generateFlightPath(width, height),
    };
  };

  handleClickFile = (id: string) => {
    // We want to allow files to be clicked and dragged _unless_ they're in
    // the process of being eaten.
    const { status } = this.state.files[id];

    if (status === 'being-inhaled') {
      return;
    }

    document.addEventListener('mousemove', this.dragFile);
    document.addEventListener('mouseup', this.releaseFile);

    this.updateFile(id, { status: 'caught' });
  };

  dragFile = ({ clientX, clientY }: any) => {
    const { files } = this.state;

    const relativeX = clientX - this.wrapperBoundingBox.left;
    const relativeY = clientY - this.wrapperBoundingBox.top;

    const grabbedFileId = Object.keys(files).find(
      id => files[id].status === 'caught'
    );

    // This should be impossible
    if (!grabbedFileId) {
      return;
    }

    this.updateFile(grabbedFileId, { x: relativeX, y: relativeY });
  };

  releaseFile = () => {
    const { files } = this.state;

    document.removeEventListener('mousemove', this.dragFile);
    document.removeEventListener('mouseup', this.releaseFile);

    const grabbedFileId = Object.keys(files).find(
      id => files[id].status === 'caught'
    );

    // This should be impossible
    if (!grabbedFileId) {
      return;
    }

    this.updateFile(grabbedFileId, { status: 'released' });
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

  areAnyFilesWithinRange = (fileIds: Array<string>, range: number) => {
    const { files } = this.state;

    const folderPoint = this.getFolderPoint();

    return fileIds.some(id => {
      const distance = calculateDistanceBetweenPoints(files[id], folderPoint);

      return distance < range;
    });
  };

  inhaleFiles = () => {
    const { width } = this.props;
    const { files, isFolderOpen } = this.state;

    const height = this.getHeight();
    const activeFileIds = Object.keys(files).filter(
      id => files[id].status !== 'swallowed'
    );

    const folderPoint = { x: width * (5 / 6), y: height * 0.5 };

    // If any of the files have made it to the very center of the folder,
    // we can remove them from the universe
    const swallowedFileIds = activeFileIds.filter(id => {
      const file = files[id];

      const distanceToFolder = calculateDistanceBetweenPoints(
        file,
        folderPoint
      );

      return distanceToFolder <= FILE_SPEED;
    });

    if (swallowedFileIds.length) {
      swallowedFileIds.forEach(id =>
        this.updateFile(id, {
          status: 'swallowed',
        })
      );
    }

    const fileIdsBeingInhaled = activeFileIds.filter(
      id => files[id].status === 'being-inhaled'
    );

    fileIdsBeingInhaled.forEach(id => {
      const file = files[id];

      const deltaX = folderPoint.x - file.x;
      const deltaY = folderPoint.y - file.y;

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

    const freeFlyingFileIds = activeFileIds.filter(
      id =>
        files[id].status !== 'being-inhaled' && files[id].status !== 'swallowed'
    );

    // When files get near the folder, the folder "mouth" opens up.
    // As they get even closer, the mouth closes again.
    if (
      !isFolderOpen &&
      this.areAnyFilesWithinRange(freeFlyingFileIds, FOLDER_OPEN_RADIUS)
    ) {
      this.setState({ isFolderOpen: true });
    } else if (
      isFolderOpen &&
      this.areAnyFilesWithinRange(fileIdsBeingInhaled, FOLDER_CLOSE_RADIUS)
    ) {
      this.setState({ isFolderOpen: false });
    }
  };

  startInhalingNearbyFiles = () => {
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
    const folderPoint = { x: width * (5 / 6), y: height * 0.5 };

    const nonEatenFileIdsWithinPerimeter = fileIds.filter(id => {
      const file = files[id];

      if (file.status === 'being-inhaled' || file.status === 'swallowed') {
        return false;
      }

      const distanceBetweenPoints = calculateDistanceBetweenPoints(
        file,
        folderPoint
      );

      return distanceBetweenPoints < FOLDER_GRAVITY_RADIUS;
    });

    nonEatenFileIdsWithinPerimeter.forEach(fileId => {
      this.updateFile(fileId, { status: 'being-inhaled' });
    });
  };

  tick = () => {
    const { files } = this.state;

    const fileIds = Object.keys(files);

    if (fileIds.length === 0) {
      return;
    }

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
    this.inhaleFiles();

    this.startInhalingNearbyFiles();

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
