// @flow
/**
 * Thin wrapper around electron `shell`, and other shell-like functions
 */
import { shell } from 'electron';
import launchEditor from 'react-dev-utils/launchEditor';
import { exec } from 'child_process';

import type { Project } from '../types';

export const openProjectInFolder = (project: Project) =>
  shell.openItem(project.path);

export const openProjectInEditor = (project: Project) =>
  launchEditor(project.path, 1, 1);

export const getNodeJsVersion = () =>
  new Promise<string | void>(resolve =>
    exec('node -v', { env: window.process.env }, (error, stdout) => {
      if (error) {
        return resolve();
      }

      resolve(stdout.toString().trim());
    })
  );
