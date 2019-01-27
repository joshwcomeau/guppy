// @flow
/**
 * Thin wrapper around electron `shell`, and other shell-like functions
 */
import { shell, remote } from 'electron';
import launchEditor from 'react-dev-utils/launchEditor';
import { exec } from 'child_process';

import type { Project } from '../types';

const { BrowserWindow } = remote;

const openedWindows = {};

export const openProjectInFolder = (project: Project) =>
  shell.openItem(project.path);

export const openProjectInEditor = (projectOrPath: Project | string) =>
  launchEditor(projectOrPath.path || projectOrPath, 1, 1);

export const openWindow = (url: string) => {
  const urlKey = url.replace(/(\/|:|\.)/g, '');

  if (openedWindows[urlKey]) {
    try {
      return openedWindows[urlKey].show();
    } catch (err) {
      if (!err.message.includes('Object has been destroyed')) {
        console.error(err);
        throw new Error('Unhandled error');
      }
      // else swallow Object has been destroyed - Window could be closed
    }
  }

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: false,
    },
  });
  // Remove the menu
  win.setMenu(null);
  win.loadURL(url);
  win.show();

  // Save Window so we can open it later
  openedWindows[urlKey] = win;
};

export const getNodeJsVersion = () =>
  new Promise<string | void>(resolve =>
    exec('node -v', { env: window.process.env }, (error, stdout) => {
      if (error) {
        return resolve();
      }

      resolve(stdout.toString().trim());
    })
  );
