// @flow
/**
 * Draws a totally-rounded rectangle inside the parent node.
 *
 * NOTE: This turned out to be a surprisingly hard problem! I had to use an
 * SVG since I needed a gradient border, and because the SVG is computed
 * dynamically, a few re-renders need to take place.
 *
 * Here's the flow:
 *   - Initial render:  Capture a reference to the SVG, so we can work out the
 *                      width and height of the parent container
 *
 *   - Path length:     Now that we have the length/height, we can add our SVG
 *                      <rect> that fills the space. After that update is
 *                      flushed to the DOM, we can figure out the length of the
 *                      path with `getTotalLength`.
 *                      TODO: I can probably use math to work out that path
 *                      so that I can skip this update cycle?
 *
 *   - Enabling trans:  We don't want the 'self-drawing' transition to happen
 *                      on mount. Because of this, transition starts as
 *                      disabled.
 *                      Once we make it to this stage, though, we can set
 *                      `finishedAllMountingSteps` to indicate that all this
 *                      stuff is done, so that any future changes to `isShown`
 *                      can be animated
 *
 * There's surely a lot of room for improvement with this flow.
 */
import React, { Component } from 'react';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';

import { COLORS } from '../../constants';

type Props = {
  color1: string,
  color2: string,
  strokeWidth: number,
  isShown: boolean,
  animateChanges: boolean,
};

type State = {
  width: ?number,
  height: ?number,
  pathLength: number,
  finishedAllMountingSteps: boolean,
};

const springSettings = { stiffness: 150, damping: 22, precision: 5 };

class RoundedOutline extends Component<Props, State> {
  state = {
    width: null,
    height: null,
    pathLength: 0,
    finishedAllMountingSteps: false,
  };

  wrapperNode: HTMLElement;
  shapeNode: any; // "SVGPathElement" (which cannot be resolved), we need "getTotalLength()"

  static defaultProps = {
    color1: COLORS.purple[500],
    color2: COLORS.violet[500],
    strokeWidth: 2,
    animateChanges: true,
  };

  componentDidMount() {
    // On first mount, we need to figure out how big the available area is.
    // This will affect how large the outline is.
    const { width, height } = this.wrapperNode.getBoundingClientRect();

    this.setState({ width, height });
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (this.state.width !== null && this.state.height !== null) {
      if (prevState.width == null && prevState.height == null) {
        const pathLength = this.shapeNode.getTotalLength();

        this.setState({ pathLength });
      } else {
        const { width, height } = this.wrapperNode.getBoundingClientRect();

        if (this.state.width !== width || this.state.height !== height) {
          this.setState({ width, height });
        }
      }
    }

    if (this.state.pathLength !== null) {
      const newPathLength = this.shapeNode.getTotalLength();

      if (this.state.pathLength !== newPathLength) {
        this.setState({ pathLength: newPathLength });
      }
    }

    if (prevState.pathLength === 0 && this.state.pathLength !== 0) {
      this.setState({ finishedAllMountingSteps: true });
    }
  }

  render() {
    const { color1, color2, strokeWidth, isShown, animateChanges } = this.props;
    const { width, height, pathLength, finishedAllMountingSteps } = this.state;

    const svgId = `${color1.replace('#', '')}-${color2.replace('#', '')}`;

    const dashOffset = isShown ? 0 : pathLength;

    return (
      <Motion
        style={{
          interpolatedDashOffset:
            animateChanges && finishedAllMountingSteps
              ? spring(dashOffset, springSettings)
              : dashOffset,
        }}
      >
        {({ interpolatedDashOffset }) => (
          <Svg
            innerRef={node => (this.wrapperNode = node)}
            width="100%"
            height="100%"
          >
            <defs>
              <linearGradient id={svgId} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style={{
                    stopColor: color1,
                    stopOpacity: 1,
                  }}
                />
                <stop
                  offset="100%"
                  style={{
                    stopColor: color2,
                    stopOpacity: 1,
                  }}
                />
              </linearGradient>
            </defs>
            {typeof width === 'number' &&
              typeof height === 'number' && (
                <Rect
                  innerRef={node => (this.shapeNode = node)}
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  rx={height / 2}
                  ry={height / 2}
                  fill="none"
                  stroke={`url(#${svgId})`}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: `${pathLength}, ${pathLength + 1}`,
                    strokeDashoffset: interpolatedDashOffset,
                  }}
                />
              )}
          </Svg>
        )}
      </Motion>
    );
  }
}

const Svg = styled.svg`
  overflow: visible;
  position: absolute;
  top: 0;
  left: 0;
`;

const Rect = styled.rect``;

export default RoundedOutline;
