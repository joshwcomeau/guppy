// @flow
/**
 * Customize the application menu (file/edit/etc outside of the window).
 */
import { Component } from 'react';
import { connect } from 'react-redux';
import { shell, remote } from 'electron';

import {
  createNewProjectStart,
  showImportExistingProjectPrompt,
} from '../../actions';

const { app, process, Menu } = remote;

type Props = {
  createNewProjectStart: () => any,
  showImportExistingProjectPrompt: () => any,
};

// TODO: Maybe I should store the git repo URL somewhere? Maybe it should
// read from package.json?
const baseRepoUrl = 'https://github.com/joshwcomeau/guppy';

class ApplicationMenu extends Component<Props> {
  menu: any;

  componentDidMount() {
    const {
      createNewProjectStart,
      showImportExistingProjectPrompt,
    } = this.props;

    const __DARWIN__ = process.platform === 'darwin';
    const template = [
      {
        label: __DARWIN__ ? 'File' : '&File',
        submenu: [
          {
            label: __DARWIN__
              ? 'Create New Project...'
              : 'Create &new project...',
            click: createNewProjectStart,
            accelerator: 'CmdOrCtrl+N',
          },
          {
            label: __DARWIN__
              ? 'Import Existing Project...'
              : '&Import existing project...',
            click: showImportExistingProjectPrompt,
            accelerator: 'CmdOrCtrl+I',
          },
        ],
      },
      {
        label: __DARWIN__ ? 'Edit' : '&Edit',
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
            label: __DARWIN__ ? 'Select All' : 'Select all',
          },
        ],
      },
      {
        label: __DARWIN__ ? 'View' : '&View',
        submenu: [
          { role: 'reload' },
          {
            role: 'forcereload',
            label: __DARWIN__ ? 'Force Reload' : 'Force reload',
          },
          {
            role: 'toggledevtools',
            label: __DARWIN__
              ? 'Toggle Developer Tools'
              : 'Toggle developer tools',
          },
          { type: 'separator' },
          {
            role: 'resetzoom',
            label: __DARWIN__ ? 'Actual Size' : 'Actual size',
          },
          { role: 'zoomin', label: __DARWIN__ ? 'Zoom In' : 'Zoom in' },
          { role: 'zoomout', label: __DARWIN__ ? 'Zoom Out' : 'Zoom out' },
          { type: 'separator' },
          {
            role: 'togglefullscreen',
            label: __DARWIN__ ? 'Toggle Full Screen' : 'Toggle full screen',
          },
        ],
      },
      {
        label: __DARWIN__ ? 'Help' : '&Help',
        submenu: [
          {
            label: __DARWIN__ ? 'Getting Started' : 'Getting started',
            click: this.openGettingStartedDocs,
          },
          {
            label: __DARWIN__ ? 'Report an Issue' : 'Report an issue',
            click: this.openReportIssue,
          },
        ],
      },
    ];

    // MacOS menus start with the app name (Guppy) and offer some standard
    // options:
    if (process.platform === 'darwin') {
      template.unshift({
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

    this.menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(this.menu);
  }

  openGettingStartedDocs = () => {
    shell.openExternal(`${baseRepoUrl}/docs/getting-started.md`);
  };

  openReportIssue = () => {
    shell.openExternal(`${baseRepoUrl}/issues/new`);
  };

  render() {
    return null;
  }
}

const mapDispatchToProps = {
  createNewProjectStart,
  showImportExistingProjectPrompt,
};

export default connect(
  null,
  mapDispatchToProps
)(ApplicationMenu);
