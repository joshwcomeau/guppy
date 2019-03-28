/* eslint-disable flowtype/require-valid-file-annotation */
import fs from 'fs';
import createProjectSvc, {
  possibleProjectColors,
  getColorForProject,
  getBuildInstructions,
  DISABLE,
} from './create-project.service';

import { FAKE_CRA_PROJECT } from './create-project.fixtures';
import { createProject } from './../test-helpers/factories';

jest.mock('fs', () => ({
  existsSync: jest.fn(() => false),
  // jest
  //   .fn()
  //   .mockReturnValueOnce(false)
  //   .mockReturnValueOnce(true),
  mkdirSync: () => 'projectHomePath/',
}));

jest.mock('os', () => ({
  homedir: jest.fn(),
  platform: () => process.platform,
}));

jest.mock('../services/platform.service', () => ({
  formatCommandForPlatform: cmd => cmd,
  getBaseProjectEnvironment: jest.fn(),
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
    const expectedOutput = [
      'npx',
      'gatsby',
      'new',
      path,
      'gatsby-starter-blog',
    ];
    expect(
      getBuildInstructions('gatsby', path, {
        projectStarter: 'gatsby-starter-blog',
      })
    ).toEqual(expectedOutput);
  });

  it('should throw an exception when passed an unknown project type', () => {
    const projectType = 'some-unknown-project-type';

    expect(() => getBuildInstructions(projectType, path)).toThrow(
      `Unrecognized project type: ${projectType}`
    );
  });
});

describe('CreateProject', () => {
  const newProject = {
    projectName: 'Awesome project',
    projectType: 'gatsby',
    projectIcon: 'Icon',
    ProjectStarter: null,
  };
  let mockStatusUpdate;
  let mockErrorHandler;
  let mockCompleteHandler;
  let callParams;

  beforeEach(() => {
    mockStatusUpdate = jest.fn();
    mockErrorHandler = jest.fn();
    mockCompleteHandler = jest.fn();

    callParams = [
      newProject,
      'newProjectHomePath/',
      mockStatusUpdate,
      mockErrorHandler,
      mockCompleteHandler,
    ];
    DISABLE.status = false;
  });

  it('should create a fake project for debugging', () => {
    DISABLE.status = true;
    createProjectSvc.apply(null, callParams);

    expect(mockCompleteHandler).toHaveBeenCalledWith(FAKE_CRA_PROJECT);
  });

  // it('should create home directory if it does not exist', () => {
  //   createProjectSvc.apply(null, callParams);
  //   //console.log(fs.existsSync);
  //   expect(fs.existsSync).toHaveBeenLastCalledWith('projectHomePath');
  // });
});
