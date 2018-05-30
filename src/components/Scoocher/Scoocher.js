// @flow
import React, { PureComponent } from 'react';
import { Motion, spring } from 'react-motion';
import styled from 'styled-components';

import { COLORS } from '../../constants';

const fastSpring = { stiffness: 120, damping: 11 };
const slowSpring = { stiffness: 120, damping: 14 };

type Props = {
  strokeWidth: number,
  selectedNodeId: string,
  nodeIds: Array<string>,
  boundingBoxes: { [key: string]: ClientRect },
};

type State = {
  direction?: 'left' | 'right',
  containerDimensions?: {
    top: number,
    left: number,
    width: number,
    height: number,
  },
  scoocherCoordinates?: {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  },
};

class Scoocher extends PureComponent<Props, State> {
  static defaultProps = {
    strokeWidth: 4,
  };

  node: HTMLElement;

  state = {};

  componentWillReceiveProps(nextProps: Props) {
    const { strokeWidth, selectedNodeId, nodeIds, boundingBoxes } = nextProps;

    if (
      this.props.selectedNodeId === nextProps.selectedNodeId &&
      this.props.boundingBoxes === nextProps.boundingBoxes
    ) {
      return;
    }

    // Figure out the extremities of the supplied node refs.
    // Create the minimum rectangle that encompasses all of them.
    let top = Infinity;
    let left = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;

    nodeIds.forEach(nodeId => {
      const box = boundingBoxes[nodeId];

      if (!box) {
        return;
      }

      if (box.top < top) {
        top = box.top;
      }
      if (box.left < left) {
        left = box.left;
      }
      if (box.right > right) {
        right = box.right;
      }
      if (box.bottom > bottom) {
        bottom = box.bottom;
      }
    });

    const containerDimensions = {
      top: -Math.floor(strokeWidth / 2),
      left: 0,
      width: right - left,
      height: bottom - top,
    };

    const selectedNodeBox = boundingBoxes[selectedNodeId];

    if (!selectedNodeBox) {
      return null;
    }

    const scoocherCoordinates = {
      x1: selectedNodeBox.left - left,
      y1: containerDimensions.height,
      x2: selectedNodeBox.right - left,
      y2: containerDimensions.height,
    };

    let direction;
    if (this.state.scoocherCoordinates) {
      direction =
        this.state.scoocherCoordinates.x1 > scoocherCoordinates.x1
          ? 'left'
          : 'right';
    } else {
      direction = 'right';
    }

    this.setState({
      containerDimensions,
      scoocherCoordinates,
      direction,
    });
  }

  render() {
    const { strokeWidth, selectedNodeId } = this.props;
    const { containerDimensions, scoocherCoordinates, direction } = this.state;

    if (!selectedNodeId || !containerDimensions || !scoocherCoordinates) {
      return null;
    }

    return (
      <ScoocherContainerSvg style={containerDimensions}>
        <Motion
          defaultStyle={scoocherCoordinates}
          style={{
            x1: spring(
              scoocherCoordinates.x1,
              direction === 'left' ? fastSpring : slowSpring
            ),
            y1: spring(
              scoocherCoordinates.y1,
              direction === 'left' ? fastSpring : slowSpring
            ),
            x2: spring(
              scoocherCoordinates.x2,
              direction === 'left' ? slowSpring : fastSpring
            ),
            y2: spring(
              scoocherCoordinates.y2,
              direction === 'left' ? slowSpring : fastSpring
            ),
          }}
        >
          {adjustedCoords => (
            <ScoochLine {...adjustedCoords} strokeWidth={strokeWidth} />
          )}
        </Motion>
      </ScoocherContainerSvg>
    );
  }
}

const ScoocherContainerSvg = styled.svg`
  position: absolute;
  z-index: 10;
  pointer-events: none;
  overflow: visible;
`;

const ScoochLine = styled.line`
  stroke-width: ${props => props.strokeWidth}px;
  stroke: ${COLORS.blue[700]};
  transition: 500ms;
`;

export default Scoocher;
