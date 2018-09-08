export type Point = { x: number, y: number };

export type BezierPath = {
  startPoint: Point,
  endPoint: Point,
  controlPoint: Point,
};

export type FileStatus =
  | 'autonomous' // Flying autonomously towards the file
  | 'being-inhaled' // Very close to the folder, being sucked in
  | 'swallowed' // At the very center of the folder, no longer active
  | 'caught' // The user is grabbing the file
  | 'released'; // The user has released a previously-grabbed file

export type FileData = {
  id: string,
  x: number,
  y: number,
  status: FileStatus,
  size: number,
  flightPath: BezierPath,
  speed?: {
    horizontalSpeed: number,
    verticalSpeed: number,
  },
};
