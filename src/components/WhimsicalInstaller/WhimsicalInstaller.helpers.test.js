/* eslint-disable flowtype/require-valid-file-annotation */
import {
  generateFlightPath,
  getPositionOnQuadraticBezierPath,
  calculateDistanceBetweenPoints,
  getQuadrantForDeltas,
  isPointOutsideWindow,
} from './WhimsicalInstaller.helpers';

describe('WhimsicalInstaller helpers', () => {
  describe('generateFlightPath', () => {
    it('creates a valid path', () => {
      const width = 600;
      const height = 200;
      const startPoint = { x: 100, y: 100 };
      const endPoint = { x: 500, y: 100 };

      const actualOutput = generateFlightPath(
        width,
        height,
        startPoint,
        endPoint
      );

      // We expect a path to be created with predictable start/end points,
      // but the control point has an element of randomness on its `y` coord.
      expect(actualOutput.startPoint).toEqual({ x: 100, y: 100 });
      expect(actualOutput.endPoint).toEqual({ x: 500, y: 100 });
      expect(actualOutput.controlPoint.x).toEqual(300);
      expect(actualOutput.controlPoint.y).toBeGreaterThanOrEqual(height * -0.2);
      expect(actualOutput.controlPoint.y).toBeLessThanOrEqual(height * 0.35);
    });
  });

  describe('getPositionOnQuadraticBezierPath', () => {
    const path = {
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 100, y: 0 },
      controlPoint: { x: 50, y: 100 },
    };

    it('finds the initial position', () => {
      expect(getPositionOnQuadraticBezierPath(path, 0)).toEqual(
        path.startPoint
      );
    });

    it('finds the final position', () => {
      expect(getPositionOnQuadraticBezierPath(path, 1)).toEqual(path.endPoint);
    });

    it('finds the mid position', () => {
      // Note that this isn't equal to the controlPoint, since this is getting
      // the actual Bézier curve, not just linear relationships to the points.
      expect(getPositionOnQuadraticBezierPath(path, 0.5)).toEqual({
        x: 50,
        y: 50,
      });
    });

    it('finds a position somewhere in the middle', () => {
      // Note that this isn't equal to the controlPoint, since this is getting
      // the actual Bézier curve, not just linear relationships to the points.
      expect(getPositionOnQuadraticBezierPath(path, 0.62)).toEqual({
        x: 62,
        y: 47.12,
      });
    });
  });

  describe('calculateDistanceBetweenPoints', () => {
    it('calculates the distance between two points', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 30, y: 40 };

      expect(calculateDistanceBetweenPoints(p1, p2)).toEqual(50);
    });
  });

  describe('getQuadrantForDeltas', () => {
    it('finds all 4 quadrants', () => {
      expect(getQuadrantForDeltas(20, 30)).toEqual(1);
      expect(getQuadrantForDeltas(-5, 30)).toEqual(2);
      expect(getQuadrantForDeltas(20, -9)).toEqual(3);
      expect(getQuadrantForDeltas(-1, -4)).toEqual(4);
    });
  });

  describe('isPointOutsideWindow', () => {
    const mockWindow = { innerWidth: 1024, innerHeight: 768 };

    it('returns false for files well within the window', () => {
      const point = { x: 50, y: 100 };
      const padding = 100;

      expect(
        isPointOutsideWindow(
          point,
          padding,
          mockWindow.innerWidth,
          mockWindow.innerHeight
        )
      ).toBe(false);
    });

    it('returns false for files outside the window, but within the padding', () => {
      const point = { x: -25, y: -60 };
      const padding = 100;

      expect(
        isPointOutsideWindow(
          point,
          padding,
          mockWindow.innerWidth,
          mockWindow.innerHeight
        )
      ).toBe(false);
    });

    it('returns true for files too far to the left', () => {
      const point = { x: -125, y: 120 };
      const padding = 100;

      expect(
        isPointOutsideWindow(
          point,
          padding,
          mockWindow.innerWidth,
          mockWindow.innerHeight
        )
      ).toBe(true);
    });

    it('returns true for files too far to the top', () => {
      const point = { x: 500, y: -101 };
      const padding = 100;

      expect(
        isPointOutsideWindow(
          point,
          padding,
          mockWindow.innerWidth,
          mockWindow.innerHeight
        )
      ).toBe(true);
    });

    it('returns true for files too far to the right', () => {
      const point = { x: 1125, y: 50 };
      const padding = 100;

      expect(
        isPointOutsideWindow(
          point,
          padding,
          mockWindow.innerWidth,
          mockWindow.innerHeight
        )
      ).toBe(true);
    });

    it('returns true for files too far to the bottom', () => {
      const point = { x: 540, y: 900 };
      const padding = 100;

      expect(
        isPointOutsideWindow(
          point,
          padding,
          mockWindow.innerWidth,
          mockWindow.innerHeight
        )
      ).toBe(true);
    });

    it('returns true for files too far on multiple axes', () => {
      const point = { x: 2000, y: 900 };
      const padding = 100;

      expect(
        isPointOutsideWindow(
          point,
          padding,
          mockWindow.innerWidth,
          mockWindow.innerHeight
        )
      ).toBe(true);
    });
  });
});
