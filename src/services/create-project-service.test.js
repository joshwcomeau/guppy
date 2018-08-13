jest.mock('os', () => ({ homedir: jest.fn() }));

jest.mock('../reducers/paths.reducer.js', () => ({
  getDefaultParentPath: jest.fn(),
}));

// eslint-disable-next-line import/first
import {
  possibleProjectColors,
  getColorForProject,
  getBuildInstructions,
} from './create-project.service';

describe('getColorForProject', () => {
  it('should pick a color from the defined project colours', () => {
    const projectColor = getColorForProject('some-project-name');

    const isKnownColor = possibleProjectColors.includes(projectColor);

    expect(isKnownColor).toEqual(true);
  });
});

describe('getBuildInstructions', () => {
  const path = '/some/path';

  it('should return the build instructions for a `create-react-app` project', () => {
    const expectedOutput = ['npx', 'create-react-app', path];
  });

  it('should return the build instructions for a Gatsby project', () => {
    const expectedOutput = ['npx', 'gatsby', path];
  });

  it('should throw an exception when passed an unknown project type', () => {
    const projectType = 'some-unknown-project-type';

    expect(() => getBuildInstructions(projectType, path)).toThrowError(
      `Unrecognized project type: ${projectType}`
    );
  });
});
