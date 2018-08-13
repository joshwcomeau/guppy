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

    const template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Create New Project',
            click: createNewProjectStart,
            accelerator: 'CmdOrCtrl+N',
          },
          {
            label: 'Import Existing Project',
            click: showImportExistingProjectPrompt,
            accelerator: 'CmdOrCtrl+I',
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'delete' },
          { role: 'selectall' },
        ],
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Getting Started',
            click: this.openGettingStartedDocs,
          },
          {
            label: 'Report an Issue',
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
