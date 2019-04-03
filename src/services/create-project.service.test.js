/* eslint-disable flowtype/require-valid-file-annotation */
import fs from 'fs';
import childProcess from 'child_process';

import createProjectSvc, {
  possibleProjectColors,
  getColorForProject,
  getBuildInstructions,
  DISABLE,
} from './create-project.service';

import { FAKE_CRA_PROJECT } from './create-project.fixtures';

const eventMap = { stdout: {}, stderr: {}, close: {} };

const mockProcess = {
  on: jest.fn((event, cb) => {
    eventMap[event] = cb;
  }),
  stdout: {
    on: jest.fn((event, cb) => {
      eventMap.stdout[event] = cb;
    }),
  },
  stderr: {
    on: jest.fn((event, cb) => {
      eventMap.stderr[event] = cb;
    }),
  },
};

jest.mock('uuid/v1', () => () => 'mocked-uuid-v1');

jest.mock('fs', () => ({
  existsSync: jest.fn(() => false),
  mkdirSync: jest.fn(() => 'projectHomePath/'),
  readFile: jest
    .fn()
    .mockImplementationOnce((path, encoding, cb) => cb(true))
    .mockImplementationOnce((path, encoding, cb) =>
      cb(
        null,
        JSON.stringify({
          name: 'demo',
          productName: 'Demo',
          version: '0.0.1',
        })
      )
    ),
  writeFile: jest.fn((path, data, cb) => cb(null)),
}));

jest.mock('os', () => ({
  homedir: jest.fn(),
  platform: () => process.platform,
}));

jest.mock('child_process', () => ({
  spawn: jest.fn(() => mockProcess),
  exec: jest.fn(),
}));

jest.mock('path', () => ({
  join: (...args) => args.join(''),
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
    projectType: 'create-react-app',
    projectIcon: 'Icon',
    ProjectStarter: null,
  };
  let mockStatusUpdate;
  let mockErrorHandler;
  let mockCompleteHandler;
  let callParams;

  beforeEach(() => {
    global.console.error = jest.fn();

    mockStatusUpdate = jest.fn();
    mockErrorHandler = jest.fn();
    mockCompleteHandler = jest.fn();

    callParams = [
      newProject,
      'projectHomePath/',
      mockStatusUpdate,
      mockErrorHandler,
      mockCompleteHandler,
    ];
    DISABLE.status = false;
  });

  afterAll(() => {
    jest.unmock(global.console.error);
  });

  it('should create a fake project for debugging', () => {
    DISABLE.status = true;
    createProjectSvc(...callParams);

    expect(mockCompleteHandler).toHaveBeenCalledWith(FAKE_CRA_PROJECT);
  });

  it('should create home directory if it does not exist', () => {
    createProjectSvc(...callParams);

    expect(fs.existsSync).toHaveBeenLastCalledWith('projectHomePath/');
    expect(fs.mkdirSync).toHaveBeenLastCalledWith('projectHomePath/');
    expect(mockStatusUpdate).toHaveBeenLastCalledWith(
      expect.stringMatching(/created parent directory/i)
    );
  });

  it('should listen to process stdout & stderr', () => {
    createProjectSvc(...callParams);

    eventMap.stdout.data('some data');
    expect(mockStatusUpdate).toHaveBeenCalledWith('some data');

    eventMap.stderr.data('an error');
    expect(mockErrorHandler).toHaveBeenCalledWith('an error');
  });

  it('should listen to process close event', () => {
    createProjectSvc(...callParams);

    eventMap.close();

    expect(mockStatusUpdate).toHaveBeenLastCalledWith(
      expect.stringMatching(/dependencies installed/i)
    );
    // read failure
    expect(global.console.error).toHaveBeenCalled();

    // new close event & test onComplete
    eventMap.close();
    expect(mockCompleteHandler).toHaveBeenCalled();
  });

  it('should add a commit for create-react-app', () => {
    createProjectSvc(...callParams);
    eventMap.close();
    expect(childProcess.exec).toHaveBeenCalledWith(
      expect.stringMatching('Add Guppy data to package.json'),
      { cwd: 'projectHomePath/awesome-project' }
    );
  });
});
