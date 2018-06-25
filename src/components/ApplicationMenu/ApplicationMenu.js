// @flow
/**
 * Customize the application menu (file/edit/etc outside of the window).
 */
import { Component } from 'react';
import { connect } from 'react-redux';

import {
  createNewProjectStart,
  showImportExistingProjectPrompt,
} from '../../actions';

const { app, process, Menu } = window.require('electron').remote;

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
          {
            label: 'Delete Project',
            click() {},
          },
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
