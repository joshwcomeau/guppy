// @flow
import { defineMessages } from 'react-intl';

const messages = {
  file: {
    label: {
      id: 'applicationMenu.file.label',
      defaultMessage: '&File',
      description: 'Label for the "File" menu on Windows/Linux',
    },
    labelMac: {
      id: 'applicationMenu.file.labelMac',
      defaultMessage: 'File',
      description: 'Label for the "File" menu on Mac',
    },
    createNewProject: {
      id: 'applicationMenu.file.createNewProject',
      defaultMessage: 'Create &new project',
      description:
        'Label for "Create New Project" under "File" menu on Windows/Linux',
    },
    createNewProjectMac: {
      id: 'applicationMenu.file.createNewProjectMac',
      defaultMessage: 'Create New Project',
      description: 'Label for "Create New Project" under "File" menu on Mac',
    },
    importExistingProject: {
      id: 'applicationMenu.file.importExistingProject',
      defaultMessage: '&Import existing project...',
      description:
        'Label for "Import Existing Project..." under "File" menu on Windows/Linux',
    },
    importExistingProjectMac: {
      id: 'applicationMenu.file.importExistingProjectMac',
      defaultMessage: 'Import Existing Project...',
      description:
        'Label for "Import Existing Project..." under "File" menu on Mac',
    },
  },
  edit: {
    label: {
      id: 'applicationMenu.edit.label',
      defaultMessage: '&Edit',
      description: 'Label for the "Edit" menu on Windows/Linux',
    },
    labelMac: {
      id: 'applicationMenu.edit.labelMac',
      defaultMessage: 'Edit',
      description: 'Label for the "Edit" menu on Mac',
    },
    undo: {
      id: 'applicationMenu.edit.undo',
      defaultMessage: 'Undo',
      description: 'Label for "Undo" under "Edit" menu',
    },
    redo: {
      id: 'applicationMenu.edit.redo',
      defaultMessage: 'Redo',
      description: 'Label for "Redo" under "Edit" menu',
    },
    cut: {
      id: 'applicationMenu.edit.cut',
      defaultMessage: 'Cut',
      description: 'Label for "Cut" under "Edit" menu',
    },
    copy: {
      id: 'applicationMenu.edit.copy',
      defaultMessage: 'Copy',
      description: 'Label for "Copy" under "Edit" menu',
    },
    paste: {
      id: 'applicationMenu.edit.paste',
      defaultMessage: 'Paste',
      description: 'Label for "Paste" under "Edit" menu',
    },
    delete: {
      id: 'applicationMenu.edit.delete',
      defaultMessage: 'Delete',
      description: 'Label for "Delete" under "Edit" menu',
    },
    selectAll: {
      id: 'applicationMenu.edit.selectAll',
      defaultMessage: 'Select all',
      description: 'Label for "Select All" under "Edit" menu on Windows/Linux',
    },
    selectAllMac: {
      id: 'applicationMenu.edit.selectAllMac',
      defaultMessage: 'Select All',
      description: 'Label for "Select All" under "Edit" menu on Mac',
    },
  },
  view: {
    label: {
      id: 'applicationMenu.view.label',
      defaultMessage: '&View',
      description: 'Label for the "View" menu on Windows/Linux',
    },
    labelMac: {
      id: 'applicationMenu.view.labelMac',
      defaultMessage: 'View',
      description: 'Label for the "View" menu on Mac',
    },
    reload: {
      id: 'applicationMenu.view.reload',
      defaultMessage: 'Reload',
      description: 'Label for "Reload" under "View" menu',
    },
    forceReload: {
      id: 'applicationMenu.view.forceReload',
      defaultMessage: 'Force reload',
      description:
        'Label for "Force Reload" under "View" menu on Windows/Linux',
    },
    forceReloadMac: {
      id: 'applicationMenu.view.forceReloadMac',
      defaultMessage: 'Force Reload',
      description: 'Label for "Force Reload" under "View" menu on Mac',
    },
    actualSize: {
      id: 'applicationMenu.view.actualSize',
      defaultMessage: 'Actual size',
      description: 'Label for "Actual Size" under "View" menu on Windows/Linux',
    },
    actualSizeMac: {
      id: 'applicationMenu.view.actualSizeMac',
      defaultMessage: 'Actual Size',
      description: 'Label for "Actual Size" under "View" menu on Mac',
    },
    zoomIn: {
      id: 'applicationMenu.view.zoomIn',
      defaultMessage: 'Zoom in',
      description: 'Label for "Zoom In" under "View" menu on Windows/Linux',
    },
    zoomInMac: {
      id: 'applicationMenu.view.zoomInMac',
      defaultMessage: 'Zoom In',
      description: 'Label for "Zoom In" under "View" menu on Mac',
    },
    zoomOut: {
      id: 'applicationMenu.view.zoomOut',
      defaultMessage: 'Zoom out',
      description: 'Label for "Zoom Out" under "View" menu on Windows/Linux',
    },
    zoomOutMac: {
      id: 'applicationMenu.view.zoomOutMac',
      defaultMessage: 'Zoom Out',
      description: 'Label for "Zoom Out" under "View" menu on Mac',
    },
    toggleFullScreen: {
      id: 'applicationMenu.view.toggleFullScreen',
      defaultMessage: 'Toggle full screen',
      description:
        'Label for "Toggle Full Screen" under "View" menu on Windows/Linux',
    },
    toggleFullScreenMac: {
      id: 'applicationMenu.view.toggleFullScreenMac',
      defaultMessage: 'Toggle Full Screen',
      description: 'Label for "Toggle Full Screen" under "View" menu on Mac',
    },
  },
  development: {
    label: {
      id: 'applicationMenu.development.label',
      defaultMessage: '&Development',
      description: 'Label for the "Development" menu on Windows/Linux',
    },
    labelMac: {
      id: 'applicationMenu.development.labelMac',
      defaultMessage: 'Development',
      description: 'Label for the "Development" menu on Mac',
    },
    toggleDevTools: {
      id: 'applicationMenu.development.toggleDevTools',
      defaultMessage: 'Toggle developer tools',
      description:
        'Label for "Toggle Developer Tools" under "Development" menu on Windows/Linux',
    },
    toggleDevToolsMac: {
      id: 'applicationMenu.development.toggleDevToolsMac',
      defaultMessage: 'Toggle Developer Tools',
      description:
        'Label for "Toggle Developer Tools" under "Development" menu on Mac',
    },
    resetState: {
      id: 'applicationMenu.development.resetState',
      defaultMessage: 'Reset state...',
      description:
        'Label for "Reset State..." under "Development" menu on Windows/Linux',
    },
    resetStateMac: {
      id: 'applicationMenu.development.resetStateMac',
      defaultMessage: 'Reset State...',
      description: 'Label for "Reset State..." under "Development" menu on Mac',
    },
  },
  help: {
    label: {
      id: 'applicationMenu.help.label',
      defaultMessage: '&Help',
      description: 'Label for the "Help" menu on Windows/Linux',
    },
    labelMac: {
      id: 'applicationMenu.help.labelMac',
      defaultMessage: 'Help',
      description: 'Label for the "Help" menu on Mac',
    },
    gettingStarted: {
      id: 'applicationMenu.help.gettingStarted',
      defaultMessage: 'Getting started',
      description:
        'Label for "Getting Started" under "Help" menu on Windows/Linux',
    },
    gettingStartedMac: {
      id: 'applicationMenu.help.gettingStartedMac',
      defaultMessage: 'Getting Started',
      description: 'Label for "Getting Started" under "Help" menu on Mac',
    },
    reportIssue: {
      id: 'applicationMenu.help.reportIssue',
      defaultMessage: 'Report an issue',
      description:
        'Label for "Report an Issue" under "Help" menu on Windows/Linux',
    },
    reportIssueMac: {
      id: 'applicationMenu.help.reportIssueMac',
      defaultMessage: 'Report an Issue',
      description: 'Label for "Report an Issue" under "Help" menu on Mac',
    },
    privacyPolicy: {
      id: 'applicationMenu.help.privacyPolicy',
      defaultMessage: 'Privacy policy',
      description:
        'Label for "Privacy Policy" under "Help" menu on Windows/Linux',
    },
    privacyPolicyMac: {
      id: 'applicationMenu.help.privacyPolicyMac',
      defaultMessage: 'Privacy Policy',
      description: 'Label for "Privacy Policy" under "Help" menu on Mac',
    },
    feedback: {
      id: 'applicationMenu.help.feedback',
      defaultMessage: 'Feedback',
      description: 'Label for "Feedback" under "Help" menu',
    },
  },
  global: {
    language: {
      id: 'applicationMenu.global.language',
      defaultMessage: '&Language',
      description: 'Label for "Language" under global menu on Windows/Linux',
    },
    languageMac: {
      id: 'applicationMenu.global.languageMac',
      defaultMessage: 'Language',
      description: 'Label for "Language" under global menu on Mac',
    },
    preferences: {
      id: 'applicationMenu.global.preferences',
      defaultMessage: '&Preferences...',
      description:
        'Label for "Preferences..." under global menu on Windows/Linux',
    },
    preferencesMac: {
      id: 'applicationMenu.global.preferencesMac',
      defaultMessage: 'Preferences...',
      description: 'Label for "Preferences..." under global menu on Mac',
    },
  },
  currentProject: {
    label: {
      id: 'applicationMenu.currentProject.label',
      defaultMessage: 'Current &project',
      description: 'Label for the "Current Project" menu on Windows/Linux',
    },
    labelMac: {
      id: 'applicationMenu.currentProject.labelMac',
      defaultMessage: 'Current Project',
      description: 'Label for the "Current Project" menu on Mac',
    },
    openEditor: {
      id: 'applicationMenu.currentProject.openEditor',
      defaultMessage: 'Open in code editor',
      description:
        'Label for "Open in Code Editor" under "Current Project" menu on Windows/Linux',
    },
    openEditorMac: {
      id: 'applicationMenu.currentProject.openEditorMac',
      defaultMessage: 'Open in Code Editor',
      description:
        'Label for "Open in Code Editor" under "Current Project" menu on Mac',
    },
    openSettings: {
      id: 'applicationMenu.currentProject.openSettings',
      defaultMessage: 'Open settings',
      description:
        'Label for "Open Settings" under "Current Project" menu on Windows/Linux',
    },
    openSettingsMac: {
      id: 'applicationMenu.currentProject.openSettingsMac',
      defaultMessage: 'Open Settings',
      description:
        'Label for "Open Settings" under "Current Project" menu on Mac',
    },
    reinstallDependencies: {
      id: 'applicationMenu.currentProject.reinstallDependencies',
      defaultMessage: 'Reinstall dependencies',
      description:
        'Label for "Reinstall Dependencies" under "Current Project" menu on Windows/Linux',
    },
    reinstallDependenciesMac: {
      id: 'applicationMenu.currentProject.reinstallDependenciesMac',
      defaultMessage: 'Reinstall Dependencies',
      description:
        'Label for "Reinstall Dependencies" under "Current Project" menu on Mac',
    },
    clearServerLogs: {
      id: 'applicationMenu.currentProject.clearServerLogs',
      defaultMessage: 'Clear server logs',
      description:
        'Label for "Clear Server Logs" under "Current Project" menu on Windows/Linux',
    },
    clearServerLogsMac: {
      id: 'applicationMenu.currentProject.clearServerLogsMac',
      defaultMessage: 'Clear Server Logs',
      description:
        'Label for "Clear Server Logs" under "Current Project" menu on Mac',
    },
    deleteProject: {
      id: 'applicationMenu.currentProject.deleteProject',
      defaultMessage: 'Delete project',
      description:
        'Label for "Delete Project" under "Current Project" menu on Windows/Linux',
    },
    deleteProjectMac: {
      id: 'applicationMenu.currentProject.deleteProjectMac',
      defaultMessage: 'Delete Project',
      description:
        'Label for "Delete Project" under "Current Project" menu on Mac',
    },
    selectProject: {
      id: 'applicationMenu.currentProject.selectProject',
      defaultMessage: 'Select project',
      description:
        'Label for "Select Project" under "Current Project" menu on Windows/Linux',
    },
    selectProjectMac: {
      id: 'applicationMenu.currentProject.selectProjectMac',
      defaultMessage: 'Select Project',
      description:
        'Label for "Select Project" under "Current Project" menu on Mac',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
