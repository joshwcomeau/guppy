import { PACKAGE_MANAGER_CMD } from './platform.services';
export const PACKAGE_MANAGER = 'yarn';

const PACKAGE_MANAGERS = {
  yarn: {
    add: 'add',
    remove: 'remove',
  },
  npm: {
    add: 'install',
    remove: 'uninstall',
  },
};

export const addDependencyCommand = (): string =>
  `${PACKAGE_MANAGER_CMD} ${PACKAGE_MANAGERS[PACKAGE_MANAGER].add}`;

export const removeDependencyCommand = (): string =>
  `${PACKAGE_MANAGER_CMD} ${PACKAGE_MANAGERS[PACKAGE_MANAGER].remove}`;

export default {
  addDependencyCommand,
  removeDependencyCommand,
};
