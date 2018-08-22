import { call, put, select } from 'redux-saga/effects';
import { cloneableGenerator } from 'redux-saga/utils';
import * as childProcess from 'child_process';
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
import { getProjectById } from '../reducers/projects.reducer';
import { getPathForProjectId } from '../reducers/paths.reducer';
import findAvailablePort from '../services/find-available-port.service';
import { PACKAGE_MANAGER_CMD } from '../services/platform.service';
import { EventEmitter } from 'events';
import { ipcRenderer } from 'electron';

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
// returned by `child_process.spawn` should be sufficient
const mockSpawn = processId => {
  const mockProcess = new EventEmitter();
  mockProcess.stdout = new EventEmitter();
  mockProcess.stderr = new EventEmitter();
  mockProcess.pid = processId;

  return mockProcess;
};

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
});
