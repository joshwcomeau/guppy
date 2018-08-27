// @flow
/**
 * Customize the application menu (file/edit/etc outside of the window).
 */
import { Component } from 'react';
import { connect } from 'react-redux';
import { shell, remote } from 'electron';

import * as actions from '../../actions';
import { GUPPY_REPO_URL } from '../../constants';
import { isMac } from '../../services/platform.service';
import { getSelectedProject } from '../../reducers/projects.reducer';
import { getDevServerTaskForProjectId } from '../../reducers/tasks.reducer';

import type { Task } from '../../types';

const { app, process, Menu } = remote;

type Props = {
  selectedProject: ?string,
  selectedProjectId: ?string,
  devServerTask: ?Task,
  createNewProjectStart: () => any,
  showImportExistingProjectPrompt: () => any,
  clearConsole: (task: Task) => any,
  showDeleteProjectPrompt: (project: any) => any,
};

class ApplicationMenu extends Component<Props> {
  menu: any;

  componentDidMount() {
    this.buildMenu(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.selectedProjectId !== nextProps.selectedProjectId) {
      this.buildMenu(nextProps);
    }
  }

  buildMenu = (props: Props) => {
    const {
      selectedProject,
      selectedProjectId,
      devServerTask,
      createNewProjectStart,
      showImportExistingProjectPrompt,
      clearConsole,
      showDeleteProjectPrompt,
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
          {
            role: 'selectall',
            label: isMac ? 'Select All' : 'Select all',
          },
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
          {
            role: 'toggledevtools',
            label: isMac ? 'Toggle Developer Tools' : 'Toggle developer tools',
          },
          { type: 'separator' },
          {
            role: 'resetzoom',
            label: isMac ? 'Actual Size' : 'Actual size',
          },
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
    if (selectedProjectId) {
      // The `Project` menu should be inserted right after `Edit`, which will
      // have a different index depending on the platform.
      const editMenuIndex = template.findIndex(menu => menu.id === 'edit');

      // Only include clear console menu item if devServerTask exists
      let submenu = [];

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

      template.splice(editMenuIndex, 0, {
        id: 'project',
        label: isMac ? 'Project' : '&Project',
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

const mapStateToProps = state => {
  const selectedProject = getSelectedProject(state);

  const selectedProjectId = selectedProject ? selectedProject.id : null;
  const devServerTask = selectedProject
    ? getDevServerTaskForProjectId(
        state,
        selectedProject.id,
        selectedProject.type
      )
    : null;

  return { selectedProject, selectedProjectId, devServerTask };
};

const mapDispatchToProps = {
  createNewProjectStart: actions.createNewProjectStart,
  showImportExistingProjectPrompt: actions.showImportExistingProjectPrompt,
  clearConsole: actions.clearConsole,
  showDeleteProjectPrompt: actions.showDeleteProjectPrompt,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationMenu);
