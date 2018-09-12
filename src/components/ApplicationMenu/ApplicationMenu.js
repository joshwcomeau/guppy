// @flow
/**
 * Customize the application menu (file/edit/etc outside of the window).
 */
import { Component } from 'react';
import { connect } from 'react-redux';
import { shell, remote } from 'electron';

import * as actions from '../../actions';
import { GUPPY_REPO_URL } from '../../constants';
import {
  isMac,
  getCopyForOpeningFolder,
} from '../../services/platform.service';
import {
  openProjectInFolder,
  openProjectInEditor,
} from '../../services/shell.service';
import {
  getSelectedProject,
  getProjectsArray,
} from '../../reducers/projects.reducer';
import { getDevServerTaskForProjectId } from '../../reducers/tasks.reducer';

import type { Project, Task } from '../../types';

const { app, process, Menu } = remote;

type Props = {
  projects: Array<Project>,
  selectedProject: ?Project,
  devServerTask: ?Task,
  createNewProjectStart: () => any,
  showImportExistingProjectPrompt: () => any,
  clearConsole: (task: Task) => any,
  showDeleteProjectPrompt: (project: any) => any,
  showResetStatePrompt: () => any,
  showProjectSettings: () => any,
  selectProject: (projectId: string) => any,
};

class ApplicationMenu extends Component<Props> {
  menu: any;

  componentDidMount() {
    this.buildMenu(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedProject !== prevProps.selectedProject) {
      this.buildMenu(this.props);
    }
  }

  buildMenu = (props: Props) => {
    const {
      selectedProject,
      devServerTask,
      createNewProjectStart,
      showImportExistingProjectPrompt,
      clearConsole,
      showDeleteProjectPrompt,
      showResetStatePrompt,
      showProjectSettings,
      selectProject,
      projects,
    } = props;

    const template = [
      {
        id: 'file',
        label: isMac ? 'File' : '&File',
        submenu: [
          {
            label: isMac ? 'Create New Project' : 'Create &new project',
            click: createNewProjectStart,
            accelerator: 'CmdOrCtrl+N',
          },
          {
            label: isMac
              ? 'Import Existing Project...'
              : '&Import existing project...',
            click: showImportExistingProjectPrompt,
            accelerator: 'CmdOrCtrl+I',
          },
        ],
      },
      {
        id: 'edit',
        label: isMac ? 'Edit' : '&Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'delete' },
          { role: 'selectall', label: isMac ? 'Select All' : 'Select all' },
        ],
      },
      {
        id: 'view',
        label: isMac ? 'View' : '&View',
        submenu: [
          { role: 'reload' },
          {
            role: 'forcereload',
            label: isMac ? 'Force Reload' : 'Force reload',
          },
          { type: 'separator' },
          { role: 'resetzoom', label: isMac ? 'Actual Size' : 'Actual size' },
          { role: 'zoomin', label: isMac ? 'Zoom In' : 'Zoom in' },
          { role: 'zoomout', label: isMac ? 'Zoom Out' : 'Zoom out' },
          { type: 'separator' },
          {
            role: 'togglefullscreen',
            label: isMac ? 'Toggle Full Screen' : 'Toggle full screen',
          },
        ],
      },
      {
        id: 'development',
        label: isMac ? 'Development' : '&Development',
        submenu: [
          {
            role: 'toggledevtools',
            label: isMac ? 'Toggle Developer Tools' : 'Toggle developer tools',
          },
          {
            label: isMac ? 'Reset State...' : 'Reset state...',
            click: showResetStatePrompt,
          },
        ],
      },
      {
        id: 'help',
        label: isMac ? 'Help' : '&Help',
        submenu: [
          {
            label: isMac ? 'Getting Started' : 'Getting started',
            click: this.openGettingStartedDocs,
          },
          {
            label: isMac ? 'Report an Issue' : 'Report an issue',
            click: this.openReportIssue,
          },
        ],
      },
    ];

    // MacOS menus start with the app name (Guppy) and offer some standard
    // options:
    if (process.platform === 'darwin') {
      template.unshift({
        id: 'guppy',
        label: app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' },
        ],
      });
    }

    // During onboarding, there is no selected project (because none exists
    // yet). Therefore, we only want to show the 'Project' menu when a project
    // is selected.
    if (selectedProject) {
      // The `Project` menu should be inserted right after `Edit`, which will
      // have a different index depending on the platform.
      const editMenuIndex = template.findIndex(menu => menu.id === 'edit');

      const openFolderCopy = getCopyForOpeningFolder();

      let submenu = [
        {
          label: openFolderCopy,
          click: () => openProjectInFolder(selectedProject),
          accelerator: 'CmdOrCtrl+shift+F',
        },
        {
          label: isMac ? 'Open in Code Editor' : 'Open in code editor',
          click: () => openProjectInEditor(selectedProject),
          accelerator: 'CmdOrCtrl+shift+E',
        },
        {
          label: isMac ? 'Open Settings' : 'Open settings',
          click: () => showProjectSettings(),
          accelerator: 'CmdOrCtrl+shift+,',
        },
        { type: 'separator' },
      ];

      // If this project has no devServerTask, there are no logs to clear.
      if (devServerTask) {
        submenu.push({
          label: isMac ? 'Clear Server Logs' : 'Clear server logs',
          click: () => clearConsole(devServerTask),
          accelerator: 'CmdOrCtrl+K',
        });
      }

      submenu.push({
        label: isMac ? 'Delete Project' : 'Delete project',
        click: () => showDeleteProjectPrompt(selectedProject),
      });

      submenu.push({ type: 'separator' });

      // Checking projects length not needed as we're having more than one project if the Current Project menu is available
      submenu.push({
        label: isMac ? 'Select Project' : 'Select project',
        id: 'select-project',
        submenu: createProjectSelectionSubmenu(
          projects,
          selectedProject.id,
          selectProject
        ),
      });

      template.splice(editMenuIndex, 0, {
        id: 'current-project',
        label: isMac ? 'Current Project' : 'Current &project',
        submenu,
      });
    }

    this.menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(this.menu);
  };

  openGettingStartedDocs = () => {
    shell.openExternal(`${GUPPY_REPO_URL}/blob/master/docs/getting-started.md`);
  };

  openReportIssue = () => {
    shell.openExternal(`${GUPPY_REPO_URL}/issues/new/choose`);
  };

  render() {
    return null;
  }
}

// helpers
export const createProjectSelectionSubmenu = (
  projects: Array<Project>,
  selectedProjectId: string,
  selectProject: (id: string) => any
): any => {
  const isSelected = testId => testId === selectedProjectId;

  return projects.map(({ name, id }) => ({
    label: name,
    type: isSelected(id) ? 'checkbox' : 'normal',
    checked: isSelected(id),
    click: () => selectProject(id),
  }));
};

const mapStateToProps = state => {
  const selectedProject = getSelectedProject(state);

  const devServerTask = selectedProject
    ? getDevServerTaskForProjectId(state, {
        projectId: selectedProject.id,
        projectType: selectedProject.type,
      })
    : null;

  const projects = getProjectsArray(state);
  return { selectedProject, devServerTask, projects };
};

const mapDispatchToProps = {
  createNewProjectStart: actions.createNewProjectStart,
  showImportExistingProjectPrompt: actions.showImportExistingProjectPrompt,
  clearConsole: actions.clearConsole,
  showDeleteProjectPrompt: actions.showDeleteProjectPrompt,
  showResetStatePrompt: actions.showResetStatePrompt,
  showProjectSettings: actions.showProjectSettings,
  selectProject: actions.selectProject,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationMenu);
