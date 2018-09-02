// @flow
/**
 * Thin wrapper around electron `shell`, and other shell-like functions
 */
import { shell } from 'electron';
import launchEditor from 'react-dev-utils/launchEditor';

import type { Project } from '../types';

export const openProjectInFolder = (project: Project) =>
  shell.openItem(project.path);

export const openProjectInEditor = (project: Project) =>
  launchEditor(project.path, 1, 1);
