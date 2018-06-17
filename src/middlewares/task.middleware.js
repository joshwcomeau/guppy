// @flow
import {
  RUN_TASK,
  ABORT_TASK,
  COMPLETE_TASK,
  LAUNCH_DEV_SERVER,
  completeTask,
  attachProcessIdToTask,
  receiveDataFromTaskExecution,
} from '../actions';
import { getProjectById } from '../reducers/projects.reducer';
import { getPathForProjectId } from '../reducers/paths.reducer';
import { isDevServerTask } from '../reducers/tasks.reducer';
import findAvailablePort from '../services/find-available-port.service';

import type { Task, ProjectType } from '../types';

const childProcess = window.require('child_process');
const psTree = window.require('ps-tree');

export default (store: any) => (next: any) => (action: any) => {
  if (!action.task) {
    return next(action);
  }

  const { task } = action;

  const state = store.getState();

  const project = getProjectById(task.projectId, state);
  const projectPath = getPathForProjectId(task.projectId, state);

  // eslint-disable-next-line default-case
  switch (action.type) {
    case LAUNCH_DEV_SERVER: {
      findAvailablePort()
        .then(port => {
          const [instruction, ...args] = getDevServerCommand(
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

          const child = childProcess.spawn(instruction, args, {
            cwd: projectPath,
            shell: true,
          });

          // Now that we have a port/processId for the server, attach it to
          // the task. The port is used for opening the app, the pid is used
          // to kill the process
          next(attachProcessIdToTask(task, child.pid, port));

          child.stdout.on('data', data => {
            // Ok so, unfortunately, failure-to-compile is still pushed
            // through stdout, not stderr. We want that message specifically
            // to trigger an error state, and so we need to parse it.
            const text = data.toString();

            const isError = text.includes('Failed to compile.');

            next(receiveDataFromTaskExecution(task, text, isError));
          });

          child.stderr.on('data', data => {
            next(receiveDataFromTaskExecution(task, data.toString()));
          });

          child.on('exit', code => {
            const wasSuccessful = code === 0 || code === null;
            const timestamp = new Date();

            store.dispatch(completeTask(task, timestamp, wasSuccessful));
          });
        })
        .catch(err => {
          // TODO: Error handling (this can happen if the first 15 ports are
          // occupied, or if there's some generic Node error)
          console.error(err);
        });

      break;
    }

    // TODO: As tasks start to get more customized for the project types,
    // it probably makes sense to have separate actions (eg. RUN_TESTS,
    // BUILD_FOR_PRODUCTION), and use RUN_TASK just for user-added tasks.
    case RUN_TASK: {
      const { projectId, name } = action.task;

      const project = getProjectById(projectId, store.getState());

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

      /* Bypasses 'Are you sure?' check when ejecting CRA
       *
       * @todo add windows support
       *
       * Works perfect on Linux (Ubuntu). Most likely will
       * work great in Mac machines too. Although it
       * will certainly fail on Windows.
       */
      const command =
        project.type === 'create-react-app' && name === 'eject'
          ? 'echo yes | npm'
          : 'npm';

      const child = childProcess.spawn(
        command,
        ['run', name, ...additionalArgs],
        {
          cwd: projectPath,
          shell: true,
        }
      );

      // To abort this task, we'll need access to its processId (pid).
      // Attach it to the task.
      next(attachProcessIdToTask(task, child.pid));

      child.stdout.on('data', data => {
        next(receiveDataFromTaskExecution(task, data.toString()));
      });

      child.stderr.on('data', data => {
        next(receiveDataFromTaskExecution(task, data.toString()));
      });

      child.on('exit', code => {
        const timestamp = new Date();

        store.dispatch(completeTask(task, timestamp, code === 0));
      });

      break;
    }

    case ABORT_TASK: {
      const { task } = action;
      const { processId, name } = task;

      // Our child was spawned using `shell: true` to get around a quirk with
      // electron not working when specifying environment variables the
      // "correct" way (see comment above).
      //
      // Because of that, `child.pid` refers to the `sh` command that spawned
      // the actual Node process, and so we need to use `psTree` to build a
      // tree of descendent children and kill them that way.
      psTree(processId, (err, children) => {
        if (err) {
          console.error('Could not gather process children:', err);
        }

        const childrenPIDs = children.map(child => child.PID);

        childProcess.spawn('kill', ['-9', ...childrenPIDs]);

        // Once the children are killed, we should dispatch a notification
        // so that the terminal shows something about this update.
        // My initial thought was that all tasks would have the same message,
        // but given that we're treating `start` as its own special thing,
        // I'm realizing that it should vary depending on the task type.
        // TODO: Find a better place for this to live.
        const abortMessage = isDevServerTask(name)
          ? 'Server stopped'
          : 'Task aborted';

        next(
          receiveDataFromTaskExecution(
            task,
            `\u001b[31;1m${abortMessage}\u001b[0m`
          )
        );
      });

      break;
    }

    case COMPLETE_TASK: {
      const { task } = action;

      // Send a message to add info to the terminal about the task being done.
      // TODO: ASCII fish art?

      const message = 'Task completed';

      next(
        receiveDataFromTaskExecution(task, `\u001b[32;1m${message}\u001b[0m`)
      );

      break;
    }
  }

  // Pass all actions through
  return next(action);
};

const getDevServerCommand = (
  task: Task,
  projectType: ProjectType,
  port: string
) => {
  switch (projectType) {
    case 'create-react-app':
      return [`PORT=${port} npm`, 'run', task.name];
    case 'gatsby':
      return ['npm', 'run', task.name, '--', `-p ${port}`];
    default:
      throw new Error('Unrecognized project type: ' + projectType);
  }
};
