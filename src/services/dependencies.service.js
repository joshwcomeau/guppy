// @flow
import { PACKAGE_MANAGER_CMD } from './platform.service';
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
    // logger(child) // service will be used here later
  });

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
  spawnProcess(PACKAGE_MANAGER_CMD, ['install'], projectPath);
