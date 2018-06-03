import {
  RUN_TASK,
  ABORT_TASK,
  abortTask,
  receiveDataFromTaskExecution,
} from '../actions';
import { getTaskByProjectIdAndTaskName } from '../reducers/tasks.reducer';
import findAvailablePort from '../services/find-available-port.service';

const childProcess = window.require('child_process');
const os = window.require('os');
const psTree = window.require('ps-tree');

// When the app first loads, we need to get an index of existing projects.
// The default path for projects is `~/guppy-projects`.
// TODO: Configurable!
const parentPath = `${os.homedir()}/guppy-projects`;

const processes = {};

export default store => next => action => {
  switch (action.type) {
    case RUN_TASK: {
      const { projectId, taskName } = action.task;

      // TODO: So this is the same format as task IDs.
      // it's a bit weird that I'm re-creating this here, but it's also weird
      // to import the taskId generator function from the reducer...
      // Whatever this is fine for now.
      const processId = `${projectId}-${taskName}`;

      // TODO: cancel any existing child with this name.

      const task = getTaskByProjectIdAndTaskName(
        projectId,
        taskName,
        store.getState()
      );

      if (!task) {
        throw new Error('Could not find task when attempting to run task.');
      }

      findAvailablePort()
        .then(port => {
          /**
           * NOTE: Ideally, we would use the following command:
           *
              childProcess.spawn(
                `npm`,
                ['run', taskName],
                {
                  cwd: `${parentPath}/${projectId}`,
                  env: { PORT: port },
                }
              );
           *
           * The difference is that we're not using "shell" mode, and we're
           * specifying the port number as an environment variable.
           *
           * Because of a likely bug in Electron, the `env` option for
           * childProcess causes everything to blow up. I added a comment here:
           * https://github.com/electron/electron/issues/3627
           *
           * As a workaround, I'm using "shell mode" to avoid having to
           * specify environment variables:
           */

          const child = childProcess.spawn(
            `PORT=${port} npm`,
            ['run', taskName],
            {
              cwd: `${parentPath}/${projectId}`,
              shell: true,
            }
          );

          child.stdout.on('data', data => {
            next(receiveDataFromTaskExecution(task, data.toString()));
          });

          child.stderr.on('data', data => {
            next(receiveDataFromTaskExecution(task, data.toString()));
          });

          child.on('exit', code => {
            // TODO: In the case that the process is somehow killed outside
            // of the GUI toggle (maybe in a console the process is killed?)
            // we should dispatch an action that prints something to the
            // terminal.
            console.log('EXITED', code);
          });

          processes[processId] = child;

          console.log(child);
        })
        .catch(err => {
          // TODO: Error handling (this can happen if the first 15 ports are
          // occupied, or if there's some generic Node error)
          console.error(err);
        });

      break;
    }

    case ABORT_TASK: {
      const { projectId, taskName } = action.task;

      const processId = `${projectId}-${taskName}`;

      const child = processes[processId];

      // We definitely should have a child here, unless the app initialized
      // with the wrong state (say, if the GUI thinks the process is running
      // when it isn't).
      // TODO: Handle this case with an error or something.
      if (!child) {
        return;
      }

      // Our child was spawned using `shell: true` to get around a quirk with
      // electron not working when specifying environment variables the
      // "correct" way (see comment above).
      //
      // Because of that, `child.pid` refers to the `sh` command that spawned
      // the actual Node process, and so we need to use `psTree` to build a
      // tree of descendent children and kill them that way.
      psTree(child.pid, (err, children) => {
        if (err) {
          console.error('Could not gather process children:', err);
        }

        const childrenPIDs = children.map(child => child.PID);

        childProcess.spawn('kill', ['-9', ...childrenPIDs]);
      });

      break;
    }
  }

  // Pass all actions through
  return next(action);
};
