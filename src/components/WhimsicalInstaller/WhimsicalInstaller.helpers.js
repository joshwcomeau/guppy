// @flow
import { random } from '../../utils';

import type { Point, BezierPath } from './WhimsicalInstaller.types';

export const generateFlightPath = (
  width: number,
  height: number,
  startPoint: Point,
  endPoint: Point
): BezierPath => {
  // We can imagine this as an SVG created that spans the size of our area.
  //  ____________________________________
  // |                                    |
  // |      P                      F      |
  // |                                    |
  // |____________________________________|
  //
  // We want to draw a quadratic bezier curve between the two, arcing up
  // slightly.
  const minControlY = height * -0.2;
  const maxControlY = height * 0.35;

  const controlPoint = {
    x: width * 0.5,
    y: random(minControlY, maxControlY),
  };

  return { startPoint, endPoint, controlPoint };
};

export const getPositionOnQuadraticBezierPath = (
  path: BezierPath,
  ratio: number // Between 0 and 1
): Point => {
  const { startPoint, endPoint, controlPoint } = path;

  const x =
    Math.pow(1 - ratio, 2) * startPoint.x +
    2 * (1 - ratio) * ratio * controlPoint.x +
    Math.pow(ratio, 2) * endPoint.x;

  const y =
    Math.pow(1 - ratio, 2) * startPoint.y +
    2 * (1 - ratio) * ratio * controlPoint.y +
    Math.pow(ratio, 2) * endPoint.y;

  return { x, y };
};

export const calculateDistanceBetweenPoints = (p1: Point, p2: Point) => {
  const deltaX = Math.abs(p1.x - p2.x);
  const deltaY = Math.abs(p1.y - p2.y);

  // Some good ol' Pythagoras theorem can help here, since we can form a
  // right-angle triangle with these 2 points
  //
  //                 . (p2)
  //               / |
  //             /   |   ^
  //           /     |  Δy
  //         /       |   v
  //  (p1) ._________|
  //         < Δx >

  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
};

export const getQuadrantForDeltas = (deltaX: number, deltaY: number) => {
  // Figures out which quadrant this set of deltas is:
  //   ________________
  //  |   1   |   2   |
  //  |       |       |
  //  |---------------|
  //  |   3   |   4   |
  //  |_______|_______|

  if (deltaX >= 0 && deltaY >= 0) {
    return 1;
  } else if (deltaX < 0 && deltaY >= 0) {
    return 2;
  } else if (deltaX >= 0 && deltaY < 0) {
    return 3;
  } else if (deltaX < 0 && deltaY < 0) {
    return 4;
  } else {
    throw new Error(
      'No such quadrant exists. Please run this function in a quadratic universe.'
    );
  }
};

export const isPointOutsideWindow = (
  point: Point,
  padding: number,
  windowWidth: number = window.innerWidth,
  windowHeight: number = window.innerHeight
) => {
  const topLimit = -padding;
  const leftLimit = -padding;
  const rightLimit = windowWidth + padding;
  const bottomLimit = windowHeight + padding;

  return (
    point.y < topLimit ||
    point.x < leftLimit ||
    point.x > rightLimit ||
    point.y > bottomLimit
  );
};
