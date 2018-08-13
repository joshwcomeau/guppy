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
            accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
          },
          {
            label: 'Import Existing Project',
            click: showImportExistingProjectPrompt,
            accelerator: process.platform === 'darwin' ? 'Cmd+I' : 'Ctrl+I',
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
    // TODO: Maybe I should store the git repo URL somewhere? Maybe it should
    // read from package.json?
    const baseRepoUrl = 'https://github.com/joshwcomeau/guppy';
    shell.openExternal(`${baseRepoUrl}/docs/getting-started.md`);
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
