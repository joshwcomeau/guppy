// @flow
import { eventChannel } from 'redux-saga';
import { processLogger } from '../services/process-logger.service';
import * as childProcess from 'child_process';

// todo: Refactor other usages to this helper e.g. dependency.saga uses it as well.
export const spawnProcess = (
  cmd: string,
  cmdArgs: string[],
  projectPath: string,
  logName: string = 'MISC'
): Promise<string> =>
  new Promise((resolve, reject) => {
    const output = {
      stdout: '',
      stderr: '',
    };
    const child = childProcess.spawn(cmd, cmdArgs, {
      cwd: projectPath,
    });

    child.stdout.on('data', data => (output.stdout += data.toString()));
    child.stderr.on('data', data => (output.stderr += data.toString()));
    child.on(
      'exit',
      code => (code ? reject(output.stderr) : resolve(output.stdout))
    );
    processLogger(child, logName);
  });

export const spawnProcessChannel = (
  cmd: string,
  cmdArgs: string[],
  projectPath: string,
  logName: string = 'MISC'
) => {
  const output = {
    stdout: '',
    stderr: '',
  };
  const child = childProcess.spawn(cmd, cmdArgs, {
    cwd: projectPath,
  });

  return eventChannel(emitter => {
    processLogger(child, logName);

    child.stdout.on('data', data => {
      output.stdout += data.toString();
      emitter({
        data: {
          stdout: data.toString(),
        },
        child,
      });
    });

    child.stderr.on('data', data => {
      output.stderr += data.toString();
      emitter({
        data: {
          stderr: data.toString(),
        },
      });
    });

    child.on('exit', code => {
      // emit exit code & complete data/err
      emitter({
        exit: code,
        data: {
          ...output,
        },
      });
    });

    // The subscriber must return an unsubscribe function
    return () => {};
  });
};
