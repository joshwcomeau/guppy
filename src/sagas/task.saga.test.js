import { call, put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as childProcess from 'child_process';
import * as path from 'path';
import chalkRaw from 'chalk';

import rootSaga, {
  launchDevServer,
  taskRun,
  taskAbort,
  displayTaskComplete,
  taskComplete,
  getBaseProjectEnvironment,
  getDevServerCommand,
} from './task.saga';
import {
  attachTaskMetadata,
  receiveDataFromTaskExecution,
  completeTask,
  loadDependencyInfoFromDisk,
} from '../actions';
import killProcessId from '../services/kill-process-id.service';
import { getProjectById } from '../reducers/projects.reducer';
import { getPathForProjectId } from '../reducers/paths.reducer';
import findAvailablePort from '../services/find-available-port.service';
import { PACKAGE_MANAGER_CMD } from '../services/platform.service';
import { ipcRenderer } from 'electron';

const chalk = new chalkRaw.constructor({ level: 3 });

// we want to watch and ensure that caught errors
// are logged to the error log
global.console = { error: jest.fn() };

jest.mock('electron', () => ({
  ipcRenderer: {
    send: jest.fn(),
  },
  remote: {
    app: { getAppPath: () => '' },
  },
}));

jest.mock('uuid/v1', () => () => 'mocked-uuid-v1');

// we don't actually need to run these commands through
// the terminal, so an object with similar shape to that
// returned by `child_process.spawn` should be sufficient.
// Mock the relevant methods so they can be spied on.
const mockSpawn = processId => ({
  pid: processId,
  write: jest.fn(),
  on: jest.fn(),
  stdin: {
    write: jest.fn(),
    on: jest.fn(),
  },
  stdout: {
    write: jest.fn(),
    on: jest.fn(),
  },
  stderr: {
    write: jest.fn(),
    on: jest.fn(),
  },
});

describe('task saga', () => {
  beforeEach(() => {
    window.process = { env: {} };
  });

  describe('launchDevServer saga', () => {
    it('should throw if no task is provided', () => {
      expect(() => launchDevServer()).toThrow();
    });

    const task = { projectId: 'pickled-tulip' };
    const saga = cloneableGenerator(launchDevServer)({ task });
    const project = { type: 'create-react-app' };
    const projectPath = '/path/to/project';
    const port = 3000;
    const { args, env } = getDevServerCommand(task, project.type, port);
    const processId = 12345;
    const mockProcess = mockSpawn(processId);

    it('should find project and projectPath', () => {
      expect(saga.next().value).toEqual(select(getProjectById, task.projectId));
      expect(saga.next(project).value).toEqual(
        select(getPathForProjectId, task.projectId)
      );
    });

    it('should find a port', () => {
      expect(saga.next(projectPath).value).toEqual(call(findAvailablePort));
    });

    it('should log to console.error on error', () => {
      const clone = saga.clone();
      clone.next(port);
      // destructuring undefined should throw
      clone.next(undefined);
      expect(console.error).toBeCalled();
    });

    it('should spawn a child process', () => {
      expect(saga.next(port).value).toEqual(
        call(getDevServerCommand, task, project.type, port)
      );
      expect(saga.next({ args, env }).value).toEqual(
        call([childProcess, childProcess.spawn], PACKAGE_MANAGER_CMD, args, {
          cwd: projectPath,
          env: { ...getBaseProjectEnvironment(projectPath), ...env },
        })
      );
    });

    it('should attach task metadata and notify renderer', () => {
      expect(saga.next(mockProcess).value).toEqual(
        put(attachTaskMetadata(task, processId, port))
      );
      expect(saga.next().value).toEqual(
        call([ipcRenderer, ipcRenderer.send], 'addProcessId', processId)
      );
    });

    it('should display an error on compile failure', () => {
      const clone = saga.clone();
      const text = 'Uh-oh! Failed to compile!';

      // `take` a log message
      clone.next();

      expect(
        clone.next({ channel: 'stdout', text, isError: true }).value
      ).toEqual(put(receiveDataFromTaskExecution(task, text, true)));
    });

    it('should display logs from stderr', () => {
      const clone = saga.clone();
      const text = "Oops, something went wrong but it's probably not fatal";

      // `take` a log message
      clone.next();

      expect(clone.next({ channel: 'stdout', text }).value).toEqual(
        put(receiveDataFromTaskExecution(task, text))
      );
    });

    it('should complete on exit', () => {
      const clone = saga.clone();
      const timestamp = new Date();

      // `take` a log message
      clone.next();

      expect(
        clone.next({ channel: 'exit', timestamp, wasSuccessful: true }).value
      ).toEqual(call(displayTaskComplete, task));

      expect(clone.next().value).toEqual(
        put(completeTask(task, timestamp, true))
      );
    });
  });

  describe('taskRun saga', () => {
    const task = { name: 'eject', projectId: 'pickled-tulip' };
    const saga = cloneableGenerator(taskRun)({ task });
    const projectReact = { type: 'create-react-app' };
    const projectGatsby = { type: 'gatsby' };
    const projectPath = '/path/to/project';
    const processId = 12345;
    const mockProcess = mockSpawn(processId);

    // select project
    saga.next();

    it('should add --coverage arg to create-react-app tests', () => {
      const name = 'test';
      const saga = taskRun({ task: { name, projectId: '' } });
      saga.next();
      saga.next(projectReact);

      expect(saga.next(projectPath).value).toEqual(
        call(
          [childProcess, childProcess.spawn],
          PACKAGE_MANAGER_CMD,
          ['run', name, '--coverage'],
          {
            cwd: projectPath,
            env: getBaseProjectEnvironment(projectPath),
          }
        )
      );
    });

    it('should run without additionalArgs for gatsby', () => {
      const name = 'test';
      const saga = taskRun({ task: { name, projectId: '' } });
      saga.next();
      saga.next(projectGatsby);

      expect(saga.next(projectPath).value).toEqual(
        call(
          [childProcess, childProcess.spawn],
          PACKAGE_MANAGER_CMD,
          ['run', name],
          {
            cwd: projectPath,
            env: getBaseProjectEnvironment(projectPath),
          }
        )
      );
    });

    it('should run without additional args for create-react-app non-test tasks', () => {
      const name = 'not-test';
      const saga = taskRun({ task: { name, projectId: '' } });
      saga.next();
      saga.next(projectReact);

      expect(saga.next(projectPath).value).toEqual(
        call(
          [childProcess, childProcess.spawn],
          PACKAGE_MANAGER_CMD,
          ['run', name],
          {
            cwd: projectPath,
            env: getBaseProjectEnvironment(projectPath),
          }
        )
      );
    });

    it('should attach task metadata and notify renderer', () => {
      saga.next(projectReact);
      saga.next(projectPath);

      expect(saga.next(mockProcess).value).toEqual(
        put(attachTaskMetadata(task, processId))
      );
      expect(saga.next().value).toEqual(
        call([ipcRenderer, ipcRenderer.send], 'addProcessId', processId)
      );
    });

    it('should display logs from stderr', () => {
      const clone = saga.clone();
      const text = "Oops, something went wrong but it's probably not fatal";

      // `take` a log message
      clone.next();

      expect(clone.next({ channel: 'stdout', text }).value).toEqual(
        put(receiveDataFromTaskExecution(task, text))
      );
    });

    it('should complete on exit', () => {
      const timestamp = new Date();

      // `take` a log message
      saga.next();

      expect(
        saga.next({ channel: 'exit', timestamp, wasSuccessful: true }).value
      ).toEqual(call(displayTaskComplete, task));

      expect(saga.next().value).toEqual(
        put(completeTask(task, timestamp, true))
      );
    });

    it('should reload dependencies after eject', () => {
      // `loadDependencyInfoFromDisk` is a thunk, thus two copies
      // constructed with identical arguments will return unique
      // copies of the same anonymous function. As such, their JSON
      // stringified representations are used for testing equality.
      expect(JSON.stringify(saga.next().value)).toEqual(
        JSON.stringify(
          put(loadDependencyInfoFromDisk(task.projectId, projectPath))
        )
      );
    });
  });

  describe('taskAbort saga', () => {
    it('should kill process and notify renderer', () => {
      const processId = 12345;
      const saga = taskAbort({ task: { name: 'start', processId } });

      expect(saga.next().value).toEqual(call(killProcessId, processId));
      expect(saga.next().value).toEqual(
        call([ipcRenderer, ipcRenderer.send], 'removeProcessId', processId)
      );
    });

    it('should display correct message for dev server task', () => {
      const task = { name: 'start', processId: 12345 }; // react
      let saga = taskAbort({ task });
      saga.next();
      saga.next();

      expect(saga.next().value).toEqual(
        put(
          receiveDataFromTaskExecution(task, chalk.bold.red('Server stopped'))
        )
      );

      task.name = 'develop'; // gatsby
      saga = taskAbort({ task });
      saga.next();
      saga.next();

      expect(saga.next().value).toEqual(
        put(
          receiveDataFromTaskExecution(task, chalk.bold.red('Server stopped'))
        )
      );
    });

    it('should display correct message for non dev server task', () => {
      const task = { name: 'test', processId: 12345 };
      const saga = taskAbort({ task });
      saga.next();
      saga.next();

      expect(saga.next().value).toEqual(
        put(receiveDataFromTaskExecution(task, chalk.bold.red('Task aborted')))
      );
    });
  });

  describe('taskComplete saga', () => {
    it('should do nothing if the task has no process id', () => {
      const saga = taskComplete({ task: {} });

      expect(saga.next().done).toBe(true);
    });

    it('should remove the process id from the renderer', () => {
      const processId = 12345;
      const saga = taskComplete({ task: { processId } });

      expect(saga.next().value).toEqual(
        call([ipcRenderer, ipcRenderer.send], 'removeProcessId', processId)
      );
    });

    it('should reload dependency info if the task was an eject', () => {
      const processId = 12345;
      const project = { id: 'tangy-blueberry', path: '/path/to/project' };
      const task = { processId, name: 'eject', projectId: project.id };
      const saga = taskComplete({ task });
      saga.next();

      expect(saga.next().value).toEqual(select(getProjectById, task.projectId));
      // stringify to avoid deep equal inconsistencies from thunk
      expect(JSON.stringify(saga.next(project).value)).toEqual(
        JSON.stringify(
          put(loadDependencyInfoFromDisk(project.id, project.path))
        )
      );
    });
  });

  describe('getBaseProjectEnvironment', () => {
    it('should append project .bin directory to PATH', () => {
      const projectPath = path.join('path', 'to', 'project');
      const projectBinDirectory = path.join(
        projectPath,
        'node_modules',
        '.bin'
      );
      const generatedEnv = getBaseProjectEnvironment(projectPath);

      expect(generatedEnv.PATH).toContain(projectBinDirectory);
    });
  });
});
