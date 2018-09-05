// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v1';

import {
  generateFlightPath,
  getPositionOnQuadraticBezierPath,
  calculateDistanceBetweenPoints,
  getQuadrantForDeltas,
} from './WhimsicalInstaller.helpers';
import File from './File';
import Folder from './Folder';
import Earth from '../Earth';

import type { Point, BezierPath } from './WhimsicalInstaller.helpers';

const FILE_SPEED = 4;
// At what distance (from the center) will the folder open/close when a file
// approaches?
const FOLDER_OPEN_RADIUS = 75;
const FOLDER_CLOSE_RADIUS = 10;
// At what distance will the folder "inhale" nearby files?
const FOLDER_GRAVITY_RADIUS = 50;

type FileStatus =
  | 'autonomous' // Flying autonomously towards the file
  | 'being-inhaled' // Very close to the folder, being sucked in
  | 'swallowed' // At the very center of the folder, no longer active
  | 'caught' // The user is grabbing the file
  | 'released'; // The user has released a previously-grabbed file

type FileData = {
  id: string,
  x: number,
  y: number,
  status: FileStatus,
  flightPath: BezierPath,
  angle?: number,
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
  tickId: ?number;
  generationLoopId: ?number;
  wrapperNode: HTMLElement;
  wrapperBoundingBox: ClientRect;
  lastKnownCursorPosition: Point;

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

  getHeight = () =>
    // Our height will be 1/3rd of our width.
    // This is so we end up with 3 squares:
    //  _____________________
    // |      |      |      |
    // |      |      |      |
    // |______|______|______|
    //
    this.props.width * (1 / 3);

  getPlanetPoint = () => ({
    x: this.props.width * (1 / 6),
    y: this.getHeight() * 0.5,
  });
  getFolderPoint = () => ({
    x: this.props.width * (5 / 6),
    y: this.getHeight() * 0.5,
  });

  updateFile = (fileId: string, properties: any) => {
    /**
     * Convenience helper to update a single file
     */
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

  areFilesWithinRangeOfFolder = (fileIds: Array<string>, range: number) => {
    /**
     * Helper method which returns a boolean based on whether any of the
     * supplied file IDs are within `range` pixels of the center of the folder.
     */
    const { files } = this.state;

    const folderPoint = this.getFolderPoint();

    return fileIds.some(id => {
      const distance = calculateDistanceBetweenPoints(files[id], folderPoint);

      return distance < range;
    });
  };

  fileGenerationLoop = () => {
    /**
     * Every few seconds, a new file is generated, and long-swallowed files
     * are quietly cleaned.
     */
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

        if (swallowedFileIds.length > 2) {
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
    /**
     * Create a single new file, from the planet's center
     */
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
    /**
     * Mark a file as "caught", unless the folder is in the middle of eating it
     */
    const { status } = this.state.files[id];

    if (status === 'being-inhaled') {
      return;
    }

    document.addEventListener('mousemove', this.dragFile);
    document.addEventListener('mouseup', this.releaseFile);

    this.updateFile(id, { status: 'caught' });
  };

  dragFile = ({ clientX, clientY }: any) => {
    /**
     * Drag a "caught" file around the screen
     */
    const { files } = this.state;

    const relativeX = clientX - this.wrapperBoundingBox.left;
    const relativeY = clientY - this.wrapperBoundingBox.top;

    const grabbedFileId = Object.keys(files).find(
      id => files[id].status === 'caught'
    );

    if (!grabbedFileId) {
      return;
    }

    this.updateFile(grabbedFileId, { x: relativeX, y: relativeY });
  };

  releaseFile = ({ clientX, clientY }: any) => {
    /**
     * Release a "caught" file.
     * NOTE: Currently, released files just sit there. In a future version,
     * they'll have their own trajectory/velocity based on how the mouse was
     * moving when it was released.
     */
    const { files } = this.state;

    document.removeEventListener('mousemove', this.dragFile);
    document.removeEventListener('mouseup', this.releaseFile);

    const grabbedFileId = Object.keys(files).find(
      id => files[id].status === 'caught'
    );

    if (!grabbedFileId) {
      return;
    }

    this.updateFile(grabbedFileId, { status: 'released' });
  };

  handleFolderOpeningAndClosing = (activeFileIds: Array<string>) => {
    /**
     * As files approach the folder, it should open and close at specific
     * distances. This method handles that calculation.
     */
    const { files, isFolderOpen } = this.state;

    const freeFlyingFileIds = activeFileIds.filter(
      id => files[id].status !== 'being-inhaled'
    );

    const fileIdsBeingInhaled = activeFileIds.filter(
      id => files[id].status === 'being-inhaled'
    );

    // When files get near the folder, the folder "mouth" opens up.
    // As they get even closer, the mouth closes again.
    if (
      !isFolderOpen &&
      this.areFilesWithinRangeOfFolder(freeFlyingFileIds, FOLDER_OPEN_RADIUS)
    ) {
      this.setState({ isFolderOpen: true });
    } else if (
      isFolderOpen &&
      this.areFilesWithinRangeOfFolder(fileIdsBeingInhaled, FOLDER_CLOSE_RADIUS)
    ) {
      this.setState({ isFolderOpen: false });
    }
  };

  autonomouslyIncrementFile = (file: FileData) => {
    /**
     * Move autonomous files towards the folder, along their arcing path.
     */
    const { width } = this.props;

    // We aren't actually storing the percentage through its journey.
    // Instead, we know its current X value, and the amount we want to
    // increment per tick.

    const planetPoint = this.getPlanetPoint();
    const folderPoint = this.getFolderPoint();

    // Get the number of pixels between the planet and folder
    const distanceBetweenEntities = folderPoint.x - planetPoint.x;

    // Our start position is the planet's center, and the total available
    // space is the distance between planet and folder.
    const transposedX = file.x - planetPoint.x;
    const transposedMax = width * (distanceBetweenEntities / width);

    const nextX = transposedX + FILE_SPEED;

    // This number between 0-1 tells us how far through our journey we are
    const ratioCompleted = nextX / transposedMax;

    const { x, y } = getPositionOnQuadraticBezierPath(
      file.flightPath,
      ratioCompleted
    );

    this.updateFile(file.id, { x, y });
  };

  startInhalingNearbyFiles = () => {
    /**
     * Look for files that have just entered the Folder's gravity radius.
     * The file could be autonomous, or held by the user, or released in its
     * direction.
     */
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

  moveFilesCloserToTheirDoom = (activeFileIds: Array<string>) => {
    /**
     * Inch all files in the process of being inhaled closer to the center.
     */
    const { files } = this.state;

    const folderPoint = this.getFolderPoint();

    const fileIdsBeingInhaled = activeFileIds.filter(
      id => files[id].status === 'being-inhaled'
    );

    fileIdsBeingInhaled.forEach(id => {
      const file = files[id];

      const deltaX = folderPoint.x - file.x;
      const deltaY = folderPoint.y - file.y;

      // We want to move FILE_SPEEDpx closer to the folder.
      const slope = Math.abs(deltaY / deltaX);
      const quadrant = getQuadrantForDeltas(deltaX, deltaY);

      const onTop = quadrant === 1 || quadrant === 2;
      const onLeftSide = quadrant === 1 || quadrant === 3;

      const xMultiplier = onLeftSide ? 1 : -1;
      const yMultiplier = onTop ? 1 : -1;

      const amountToMoveX = (1 - slope) * FILE_SPEED * xMultiplier;
      const amountToMoveY = slope * FILE_SPEED * yMultiplier;

      this.updateFile(id, {
        x: file.x + amountToMoveX,
        y: file.y + amountToMoveY,
      });
    });
  };

  swallowFilesAtCenter = (activeFileIds: Array<string>) => {
    /**
     * Update the status for files that have made it to the center of the
     * folder, after being inhaled.
     */
    const { files } = this.state;

    const folderPoint = this.getFolderPoint();

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
  };

  tick = () => {
    /**
     * OUR MAIN GAME LOOP.
     * Controls updating the files at every tick (aside from those being dragged
     * about by the user)
     */
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

    // Several methods below need a list of not-swallowed files.
    const activeFileIds = Object.keys(files).filter(
      id => files[id].status !== 'swallowed'
    );

    this.handleFolderOpeningAndClosing(activeFileIds);

    this.startInhalingNearbyFiles();
    this.moveFilesCloserToTheirDoom(activeFileIds);
    this.swallowFilesAtCenter(activeFileIds);

    this.tickId = window.requestAnimationFrame(this.tick);
  };

  render() {
    const { width } = this.props;
    const { files, isFolderOpen } = this.state;

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
