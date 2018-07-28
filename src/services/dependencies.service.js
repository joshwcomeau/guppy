// @flow
import packageMan from './package-manager.service';
const childProcess = window.require('child_process');

export const installDependency = (
  projectPath: string,
  dependencyName: string,
  version: string
) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      `${packageMan.addDependencyCommand()} ${dependencyName}@${version} -SE`,
      { cwd: projectPath },
      (err, res) => {
        err ? reject(err) : resolve(res);
      }
    );
  });
};

export const uninstallDependency = (
  projectPath: string,
  dependencyName: string
) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      `${packageMan.removeDependencyCommand()} ${dependencyName}`,
      { cwd: projectPath },
      (err, res) => {
        err ? reject(err) : resolve(res);
      }
    );
  });
};

export const reinstallDependencies = (projectPath: string) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(
      packageMan.addDependencyCommand(),
      { cwd: projectPath },
      (err, res) => {
        err ? reject(err) : resolve(res);
      }
    );
  });
};
