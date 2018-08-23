// @flow
import { select, call, put, take, takeEvery } from 'redux-saga/effects';
import { buffers, eventChannel, END } from 'redux-saga';
import { ipcRenderer } from 'electron';
import * as childProcess from 'child_process';
import * as path from 'path';
import chalkRaw from 'chalk';

import {
  RUN_TASK,
  ABORT_TASK,
  COMPLETE_TASK,
  LAUNCH_DEV_SERVER,
  completeTask,
  attachTaskMetadata,
  receiveDataFromTaskExecution,
  loadDependencyInfoFromDisk,
} from '../actions';
import { getProjectById } from '../reducers/projects.reducer';
import { getPathForProjectId } from '../reducers/paths.reducer';
import { isDevServerTask } from '../reducers/tasks.reducer';
import findAvailablePort from '../services/find-available-port.service';
import killProcessId from '../services/kill-process-id.service';
import { isWin, PACKAGE_MANAGER_CMD } from '../services/platform.service';

import type { Task, ProjectType } from '../types';
import type { Saga } from 'redux-saga';

const chalk = new chalkRaw.constructor({ level: 3 });

export function* launchDevServer({ task }: { task: Task }): Saga<void> {
  const project = yield select(getProjectById, task.projectId);
  const projectPath = yield select(getPathForProjectId, task.projectId);

  try {
    const port = yield call(findAvailablePort);
    const { args, env } = yield call(
      getDevServerCommand,
      task,
      project.type,
      port
    );

    const child = yield call(
      [childProcess, childProcess.spawn],
      PACKAGE_MANAGER_CMD,
      args,
      {
        cwd: projectPath,
        env: { ...getBaseProjectEnvironment(projectPath), ...env },
      }
    );

    // Now that we have a port/processId for the server, attach it to
    // the task. The port is used for opening the app, the pid is used
    // to kill the process
    yield put(attachTaskMetadata(task, child.pid, port));

    yield call([ipcRenderer, ipcRenderer.send], 'addProcessId', child.pid);

    const stdioChannel = createStdioChannel(child, {
      stdout: emitter => data => {
        // Ok so, unfortunately, failure-to-compile is still pushed
        // through stdout, not stderr. We want that message specifically
        // to trigger an error state, and so we need to parse it.
        const text = data.toString();

        const isError = text.includes('Failed to compile');

        emitter({ channel: 'stdout', text, isError });
      },
      stderr: emitter => data => {
        emitter({ channel: 'stderr', text: data.toString() });
      },
      exit: emitter => code => {
        // For Windows Support
        // Windows sends code 1 (I guess its because we force kill??)
        const successfulCode = isWin ? 1 : 0;
        const wasSuccessful = code === successfulCode || code === null;
        const timestamp = new Date();

        emitter({ channel: 'exit', timestamp, wasSuccessful });
        // calling emitter(END) will break out of the try block of any
        // actively listening subscribers when they take() it
        emitter(END);
      },
    });

    try {
      while (true) {
        const message = yield take(stdioChannel);

        // eslint-disable-next-line default-case
        switch (message.channel) {
          case 'stdout':
            yield put(
              receiveDataFromTaskExecution(task, message.text, message.isError)
            );
            break;
          case 'stderr':
            yield put(receiveDataFromTaskExecution(task, message.text));
            break;
          case 'exit':
            yield call(displayTaskComplete, task);
            yield put(
              completeTask(task, message.timestamp, message.wasSuccessful)
            );
            break;
        }
      }
    } finally {
      /* child process has completed */
    }
  } catch (err) {
    // TODO: Error handling (this can happen if the first 15 ports are occupied,
    // or if there's some generic Node error
    console.error(err);
  }
}

export function* taskRun({ task }: { task: Task }): Saga<void> {
  const project = yield select(getProjectById, task.projectId);
  const projectPath = yield select(getPathForProjectId, task.projectId);
  const { name } = task;

  // TEMPORARY HACK
  // By default, create-react-app runs tests in interactive watch mode.
  // This is a brilliant way to do it, but it's interactive, which won't
  // work as-is.
  // In the future, I expect "Tests" to get its own module on the project
  // page, in which case we can support the interactive mode, except with
  // descriptive buttons instead of cryptic letters!
  // Alas, this would be mucho work, and this is an MVP. So for now, I'm
  // disabling watch mode, and doing "just run all the tests once" mode.
  // This is bad, and I feel bad, but it's a corner that needs to be cut,
  // for now.
  const additionalArgs = [];
  if (project.type === 'create-react-app' && name === 'test') {
    additionalArgs.push('--coverage');
  }

  const child = yield call(
    [childProcess, childProcess.spawn],
    PACKAGE_MANAGER_CMD,
    ['run', name, ...additionalArgs],
    {
      cwd: projectPath,
      env: getBaseProjectEnvironment(projectPath),
    }
  );

  // TODO: Does the renderer process still need to know about the child
  // processId?
  yield put(attachTaskMetadata(task, child.pid));

  // When this application exits, we want to kill this process.
  // Send it up to the main process.
  yield call([ipcRenderer, ipcRenderer.send], 'addProcessId', child.pid);

  const stdioChannel = createStdioChannel(child, {
    stdout: emitter => data => {
      // The 'eject' task prompts the user, to ask if they're sure.
      // We can bypass this prompt, as our UI already has an alert that
      // confirms this action.
      // TODO: Eject deserves its own Redux action, to avoid cluttering up
      // this generic "RUN_TASK" action.
      // TODO: Is there a way to "future-proof" this, in case the CRA
      // confirmation copy changes?
      const isEjectPrompt = data
        .toString()
        .includes('Are you sure you want to eject? This action is permanent');

      if (isEjectPrompt) {
        sendCommandToProcess(child, 'y');
      }

      emitter({ channel: 'stdout', text: data.toString() });
    },
    stderr: emitter => data => {
      emitter({ channel: 'stderr', text: data.toString() });
    },
    exit: emitter => code => {
      const timestamp = new Date();

      emitter({ channel: 'exit', timestamp, wasSuccessful: code === 0 });
      emitter(END);
    },
  });

  try {
    while (true) {
      const message = yield take(stdioChannel);

      // eslint-disable-next-line default-case
      switch (message.channel) {
        case 'stdout':
          yield put(receiveDataFromTaskExecution(task, message.text));
          break;
        case 'stderr':
          yield put(receiveDataFromTaskExecution(task, message.text));
          break;
        case 'exit':
          yield call(displayTaskComplete, task);
          yield put(
            completeTask(task, message.timestamp, message.wasSuccessful)
          );
          if (task.name === 'eject') {
            yield put(loadDependencyInfoFromDisk(project.id, project.path));
          }
          break;
      }
    }
  } finally {
    /* child process has completed */
  }
}

export function* taskAbort({ task }: { task: Task }): Saga<void> {
  const { processId, name } = task;

  yield call(killProcessId, processId);
  yield call([ipcRenderer, ipcRenderer.send], 'removeProcessId', processId);

  // Once the children are killed, we should dispatch a notification
  // so that the terminal shows something about this update.
  // My initial thought was that all tasks would have the same message,
  // but given that we're treating `start` as its own special thing,
  // I'm realizing that it should vary depending on the task type.
  // TODO: Find a better place for this to live.
  const abortMessage = isDevServerTask(name)
    ? 'Server stopped'
    : 'Task aborted';

  yield put(receiveDataFromTaskExecution(task, chalk.bold.red(abortMessage)));
}

export function* displayTaskComplete(task: Task): Saga<void> {
  // Send a message to add info to the terminal about the task being done.
  // TODO: ASCII fish art?

  const message = 'Task completed';

  yield put(receiveDataFromTaskExecution(task, chalk.bold.green(message)));
}

export function* taskComplete({ task }: { task: Task }): Saga<void> {
  if (task.processId) {
    yield call(
      [ipcRenderer, ipcRenderer.send],
      'removeProcessId',
      task.processId
    );
  }

  // The `eject` task is special; after running it, its dependencies will
  // have changed.
  // TODO: We should really have a `EJECT_PROJECT_COMPLETE` action that does
  // this instead.
  if (task.name === 'eject') {
    const project = yield select(getProjectById, task.projectId);

    yield put(loadDependencyInfoFromDisk(project.id, project.path));
  }
}

const createStdioChannel = (
  child: any,
  handlers: {
    stdout: (emitter: any) => (data: string) => void,
    stderr: (emitter: any) => (data: string) => void,
    exit: (emitter: any) => (code: number) => void,
  }
) => {
  return eventChannel(emitter => {
    child.stdout.on('data', handlers.stdout(emitter));
    child.stderr.on('data', handlers.stderr(emitter));
    child.on('exit', handlers.exit(emitter));

    return () => {
      /* unsubscribe any listeners */
    };

    // use an expanding buffer because we don't want to lose any information
    // passed up by the child process. initialize it at a length of 2 because
    // at bare minimum we expect to have 2 messages queued at some point (as
    // the exit channel completes, it should emit the return code of the process
    // and then immediately END
  }, buffers.expanding(2));
};

export const getBaseProjectEnvironment = (projectPath: string) => ({
  // Forward the host env, and append the
  // project's .bin directory to PATH to allow
  // package scripts to function properly.
  ...window.process.env,
  PATH:
    window.process.env.PATH +
    path.delimiter +
    path.join(projectPath, 'node_modules', '.bin'),
});

export const getDevServerCommand = (
  task: Task,
  projectType: ProjectType,
  port: string
) => {
  switch (projectType) {
    case 'create-react-app':
      return {
        args: ['run', task.name],
        env: {
          PORT: port,
        },
      };
    case 'gatsby':
      return {
        args: ['run', task.name, '-p', port],
        env: {},
      };
    default:
      throw new Error('Unrecognized project type: ' + projectType);
  }
};

export const sendCommandToProcess = (child: any, command: string) => {
  // Commands have to be suffixed with '\n' to signal that the command is
  // ready to be sent. Same as a regular command + hitting the enter key.
  child.stdin.write(`${command}\n`);
};

export default function* rootSaga(): Saga<void> {
  yield takeEvery(LAUNCH_DEV_SERVER, launchDevServer);
  // these saga handlers are named in reverse order (RUN_TASK => taskRun, etc.)
  // to avoid naming conflicts with their related actions (completeTask is
  // already an action creator).
  yield takeEvery(RUN_TASK, taskRun);
  yield takeEvery(ABORT_TASK, taskAbort);
  yield takeEvery(COMPLETE_TASK, taskComplete);
}
