export const PACKAGE_MANAGER = 'yarn';

const PACKAGE_MANAGERS = {
  yarn: {
    add: 'yarn add',
    remove: 'yarn remove',
  },
  npm: {
    add: 'npm install',
    remove: 'npm uninstall',
  },
};

export const addDependencyCommand = (): string =>
  PACKAGE_MANAGERS[PACKAGE_MANAGER].add;

export const removeDependencyCommand = (): string =>
  PACKAGE_MANAGERS[PACKAGE_MANAGER].remove;

export default {
  addDependencyCommand,
  removeDependencyCommand,
};
