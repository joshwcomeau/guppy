// @flow
import { eventChannel } from 'redux-saga';
import { PACKAGE_MANAGER_CMD } from './platform.service';
import { processLogger } from './process-logger.service';
import * as childProcess from 'child_process';

import type { QueuedDependency } from '../types';

const spawnProcess = (
  cmd: string,
  cmdArgs: string[],
  projectPath: string
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
    processLogger(child, 'DEPENDENCY');
  });

export const spawnProcessChannel = (
  cmd: string,
  cmdArgs: string[],
  projectPath: string
) => {
  const output = {
    stdout: '',
    stderr: '',
  };
  const child = childProcess.spawn(cmd, cmdArgs, {
    cwd: projectPath,
  });

  return eventChannel(emitter => {
    processLogger(child, 'DEPENDENCY');

    child.stdout.on('data', data => {
      output.stdout += data.toString();
      emitter({ data: data.toString() });
    });

    child.stderr.on('data', data => {
      output.stderr += data.toString();
      emitter({ error: data.toString() });
    });

    child.on('exit', code => {
      // emit exit code & complete data/err --> not used yet but maybe useful later
      emitter({
        exit: code,
        data: {
          data: output.stdout,
          error: output.stderr,
        },
      });
    });

    // The subscriber must return an unsubscribe function
    return () => {};
  });
};

export const getDependencyInstallationCommand = (
  dependencies: Array<QueuedDependency>
): Array<string> => {
  const versionedDependencies = dependencies.map(
    ({ name, version }) => name + (version ? `@${version}` : '')
  );

  return ['add', ...versionedDependencies, '-SE'];
};

export const installDependencies = (
  projectPath: string,
  dependencies: Array<QueuedDependency>
) =>
  spawnProcess(
    PACKAGE_MANAGER_CMD,
    getDependencyInstallationCommand(dependencies),
    projectPath
  );

export const uninstallDependencies = (
  projectPath: string,
  dependencies: Array<QueuedDependency>
) =>
  spawnProcess(
    PACKAGE_MANAGER_CMD,
    ['remove', ...dependencies.map(({ name }) => name)],
    projectPath
  );

export const reinstallDependencies = (projectPath: string) =>
  spawnProcessChannel(PACKAGE_MANAGER_CMD, ['install'], projectPath);
