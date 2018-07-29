// @flow
import packageMan from './package-manager.service';
import { PACKAGE_MANAGER_CMD } from './platform.services';
const childProcess = window.require('child_process');

/* TODO: Improve flow type for executor - no type annotation found
         from facebook flow source https://github.com/facebook/flow/blob/v0.76.0/lib/core.js#L584:
          constructor(callback: (
                resolve: (result: Promise<R> | R) => void,
                reject: (error: any) => void
              ) => mixed): void;
*/

const spawnProcess = (
  cmd: string,
  cmdArgs: Array<string>,
  projectPath: string,
  [resolve, reject]: Array<any>
) => {
  const child = childProcess.spawn(cmd, cmdArgs, {
    cwd: projectPath,
  });

  child.on('exit', code => {
    if (code) {
      reject(child.stderr);
    } else {
      resolve(child.stdout);
    }
  });

  return child;
};

export const installDependency = (
  projectPath: string,
  dependencyName: string,
  version: string
) => {
  return new Promise(function(resolve, reject) {
    // no arrow function so we can use function arguments to pass
    const child = spawnProcess(
      PACKAGE_MANAGER_CMD,
      [
        packageMan.addDependencyCommand(),
        `${dependencyName}@${version}`,
        '-SE',
      ],
      projectPath,
      arguments
    );
  });
};

export const uninstallDependency = (
  projectPath: string,
  dependencyName: string
) => {
  return new Promise(function(resolve, reject) {
    const child = spawnProcess(
      PACKAGE_MANAGER_CMD,
      [packageMan.removeDependencyCommand(), dependencyName],
      projectPath,
      arguments
    );
  });
};

export const reinstallDependencies = (projectPath: string) => {
  return new Promise(function(resolve, reject) {
    const child = spawnProcess(
      PACKAGE_MANAGER_CMD,
      [packageMan.addDependencyCommand()],
      projectPath,
      arguments
    );
  });
};
