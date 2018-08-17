// @flow
import { PACKAGE_MANAGER_CMD } from './platform.service';
import * as childProcess from 'child_process';

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

export const installDependency = (
  projectPath: string,
  dependencyName: string,
  version: string
) =>
  spawnProcess(
    PACKAGE_MANAGER_CMD,
    ['add', `${dependencyName}@${version}`, '-SE'],
    projectPath
  );

export const uninstallDependency = (
  projectPath: string,
  dependencyName: string
) => spawnProcess(PACKAGE_MANAGER_CMD, ['remove', dependencyName], projectPath);

export const reinstallDependencies = (projectPath: string) =>
  spawnProcess(PACKAGE_MANAGER_CMD, ['install'], projectPath);
