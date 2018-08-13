// @flow
import * as childProcess from 'child_process';

export const installDependency = (
  projectPath: string,
  dependencyName: string,
  version: string
) => {
  return new Promise((resolve, reject) => {
    // TODO: yarn?
    childProcess.exec(
      `npm install ${dependencyName}@${version} -SE`,
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
      `npm uninstall ${dependencyName}`,
      { cwd: projectPath },
      (err, res) => {
        err ? reject(err) : resolve(res);
      }
    );
  });
};

export const reinstallDependencies = (projectPath: string) => {
  return new Promise((resolve, reject) => {
    childProcess.exec('npm install', { cwd: projectPath }, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};
