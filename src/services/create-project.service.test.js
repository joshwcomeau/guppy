/* eslint-disable flowtype/require-valid-file-annotation */
import {
  possibleProjectColors,
  getColorForProject,
  getBuildInstructions,
} from './create-project.service';

jest.mock('os', () => ({
  homedir: jest.fn(),
  platform: () => process.platform,
}));

jest.mock('../services/platform.service', () => ({
  formatCommandForPlatform: cmd => cmd,
}));

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
    expect(getBuildInstructions('create-react-app', path)).toEqual(
      expectedOutput
    );
  });

  it('should return the build instructions for a Gatsby project', () => {
    const expectedOutput = ['npx', 'gatsby', 'new', path];
    expect(getBuildInstructions('gatsby', path)).toEqual(expectedOutput);
  });

  it('should throw an exception when passed an unknown project type', () => {
    const projectType = 'some-unknown-project-type';

    expect(() => getBuildInstructions(projectType, path)).toThrowError(
      `Unrecognized project type: ${projectType}`
    );
  });
});
