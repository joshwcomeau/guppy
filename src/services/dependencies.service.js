// @flow
import { PACKAGE_MANAGER_CMD } from './platform.service';
import * as childProcess from 'child_process';

import type { Dependency } from '../types';

const spawnProcess = (cmd: string, cmdArgs: string[], projectPath: string) =>
  new Promise((resolve, reject) => {
    const child = childProcess.spawn(cmd, cmdArgs, {
      cwd: projectPath,
    });
    child.on(
      'exit',
      code => (code ? reject(child.stderr) : resolve(child.stdout))
    );
    // logger(child) // service will be used here later
  });

export const toPackageManagerArgs = (dependencies: Array<Dependency>) => {
  return dependencies.map(
    ({ name, version }: Dependency) => name + (version ? `@${version}` : '')
  );
};

export const installDependencies = (
  projectPath: string,
  dependencies: Array<Dependency>
) =>
  spawnProcess(
    PACKAGE_MANAGER_CMD,
    ['add', ...toPackageManagerArgs(dependencies), '-SE'],
    projectPath
  );

export const uninstallDependencies = (
  projectPath: string,
  dependencies: Array<Dependency>
) =>
  spawnProcess(
    PACKAGE_MANAGER_CMD,
    ['remove', ...toPackageManagerArgs(dependencies)],
    projectPath
  );

export const reinstallDependencies = (projectPath: string) =>
  spawnProcess(PACKAGE_MANAGER_CMD, ['install'], projectPath);
