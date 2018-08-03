// @flow
import { select, call, put, take, takeEvery } from 'redux-saga/effects';
import { buffers, eventChannel, END } from 'redux-saga';
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
import {
  isWin,
  formatCommandForPlatform,
  getPathForPlatform,
} from '../services/platform.services';

import type { Task, ProjectType } from '../types';

const { ipcRenderer } = window.require('electron');
const childProcess = window.require('child_process');
const psTree = window.require('ps-tree');

function* launchDevServer({ task }) {
  const project = yield select(getProjectById, task.projectId);
  const projectPath = yield select(getPathForProjectId, task.projectId);

  try {
    const port = yield call(findAvailablePort);
    const { commandArgs, commandEnv } = yield call(
      getDevServerArguments,
      task,
      project.type,
      port
    );

    /**
     * NOTE: A quirk in Electron means we can't use `env` to supply
     * environment variables, as you would traditionally:
     *
        childProcess.spawn(
          `npm`,
          ['run', name],
          {
            cwd: projectPath,
            env: { PORT: port },
          }
        );
    *
    * If I try to run this, I get a bunch of nonsensical errors about
    * no commands (not even built-in ones like `ls`) existing.
    * I added a comment here:
    * https://github.com/electron/electron/issues/3627
    *
    * As a workaround, I'm using "shell mode" to avoid having to
    * specify environment variables:
    */

    const child = yield call(
      [childProcess, 'spawn'],
      formatCommandForPlatform('npm'),
      commandArgs,
      { cwd: projectPath, env: { ...commandEnv, PATH: getPathForPlatform() } }
    );

    // Now that we have a port/processId for the server, attach it to
    // the task. The port is used for opening the app, the pid is used
    // to kill the process
    yield put(attachTaskMetadata(task, child.pid, port));

    yield call([ipcRenderer, 'send'], 'addProcessId', child.pid);

    const stdioChannel = yield call(createStdioChannel, child, {
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
        // Windows sends code 1 (I guess its because we foce kill??)
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
    // or if there' s some generic Node error
    console.error(err);
  }
}

function* taskRun({ task }) {
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
    additionalArgs.push('--', '--coverage');
  }

  const child = yield call(
    [childProcess, 'spawn'],
    formatCommandForPlatform('npm'),
    ['run', name, ...additionalArgs],
    {
      cwd: projectPath,
      env: {
        PATH: getPathForPlatform(),
      },
    }
  );

  // When this application exits, we want to kill this process.
  // Send it up to the main process.
  yield call([ipcRenderer, 'send'], child.pid);

  // TODO: Does the renderer process still need to know about the child
  // processId?
  yield put(attachTaskMetadata(task, child.pid));

  const stdioChannel = yield call(createStdioChannel, child, {
    stdout: emitter => data => {
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

function* taskAbort({ task }) {
  const { processId, name } = task;

  // For Windows Support
  // On Windows there is only one process so no need for psTree (see below)
  // We use /f for focefully terminate process because it ask for confirmation
  // We use /t to kill all child processes
  // More info https://ss64.com/nt/taskkill.html
  if (isWin) {
    yield call([childProcess, 'spawn'], 'taskkill', [
      '/pid',
      processId,
      '/f',
      '/t',
    ]);
    yield call([ipcRenderer, 'send'], 'removeProcessId', processId);

    const abortMessage = isDevServerTask(name)
      ? 'Server stopped'
      : 'Task aborted';

    yield put(
      receiveDataFromTaskExecution(task, `\u001b[31;1m${abortMessage}\u001b[0m`)
    );
  } else {
    // Our child was spawned using `shell: true` to get around a quirk with
    // electron not working when specifying environment variables the
    // "correct" way (see comment above).
    //
    // Because of that, `child.pid` refers to the `sh` command that spawned
    // the actual Node process, and so we need to use `psTree` to build a
    // tree of descendent children and kill them that way.

    // wrap psTree in a promise to facilitate use inside a saga (yield cannot
    // be used inside a callback function, even when it's nested within a
    // generator)
    const promisifyPsTree = _processId =>
      new Promise((resolve, reject) => {
        psTree(_processId, (err, children) => {
          if (err) return reject(err);
          return resolve(children);
        });
      });

    try {
      const children = yield call(promisifyPsTree, processId);

      // in the original task middleware, the below code would run regardless
      // of psTree throwing an error, which I don't believe is correct; I imagine
      // children would be undefined, null, or an empty array -- whichever, there
      // doesn't seem to be any point to continue if this is the case. As such,
      // I've kept it inside the try block.
      const childrenPIDs = children.map(child => child.PID);

      yield call([childProcess, 'spawn'], 'kill', ['-9', ...childrenPIDs]);

      yield call([ipcRenderer, 'send'], 'removeProcessId', processId);

      // Once the children are killed, we should dispatch a notification
      // so that the terminal shows something about this update.
      // My initial thought was that all tasks would have the same message,
      // but given that we're treating `start` as its own special thing,
      // I'm realizing that it should vary depending on the task type.
      // TODO: Find a better place for this to live.
      const abortMessage = isDevServerTask(name)
        ? 'Server stopped'
        : 'Task aborted';

      yield put(
        receiveDataFromTaskExecution(
          task,
          `\u001b[31;1m${abortMessage}\u001b[0m`
        )
      );
    } catch (err) {
      yield call([console, 'error'], 'Could not gather process children:', err);
    }
  }
}

function* displayTaskComplete(task) {
  // Send a message to add info to the terminal about the task being done.
  // TODO: ASCII fish art?

  const message = 'Task completed';

  yield put(
    receiveDataFromTaskExecution(task, `\u001b[32;1m${message}\u001b[0m`)
  );
}

function* taskComplete({ task }) {
  if (task.processId) {
    yield call([ipcRenderer, 'send'], 'removeProcessId', task.processId);
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
    stdout: (emitter: any) => (data: string) => null,
    stderr: (emitter: any) => (data: string) => null,
    exit: (emitter: any) => (code: number) => null,
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

const getDevServerArguments = (
  task: Task,
  projectType: ProjectType,
  port: string
) => {
  switch (projectType) {
    case 'create-react-app':
      return { commandArgs: ['run', task.name], commandEnv: { PORT: port } };
    case 'gatsby':
      return {
        commandArgs: ['run', task.name, '--', `-p ${port}`],
        commandEnv: {},
      };
    default:
      throw new Error('Unrecognized project type: ' + projectType);
  }
};

const sendCommandToProcess = (child: any, command: string) => {
  // Commands have to be suffixed with '\n' to signal that the command is
  // ready to be sent. Same as a regular command + hitting the enter key.
  child.stdin.write(`${command}\n`);
};

// $FlowFixMe
export default function* rootSaga() {
  yield takeEvery(LAUNCH_DEV_SERVER, launchDevServer);
  // these saga handlers are named in reverse order (RUN_TASK => taskRun, etc.)
  // to avoid naming conflicts with their related actions (completeTask is
  // already an action creator).
  yield takeEvery(RUN_TASK, taskRun);
  yield takeEvery(ABORT_TASK, taskAbort);
  yield takeEvery(COMPLETE_TASK, taskComplete);
}
