// @flow
/**
 * This service collects factories that create the entities defined in
 * `types.js`, for use in writing automated tests.
 */
import path from 'path';

const sept14thTimestamp = 1536927197731;

export const createProject = (overrides: any) => ({
  id: '6f36787f-3a7a-4b3e-a822-88b0b55db6cd',
  name: 'Hello World',
  type: 'create-react-app',
  icon: 'path/to/icon',
  color: '#FF0000',
  createdAt: sept14thTimestamp,
  dependencies: [
    {
      name: 'react',
      description: '',
      version: '16.5',
      homepage: '',
      license: 'MIT',
      repository: { type: 'git', url: '/' },
      status: 'idle',
      location: 'dependencies',
    },
  ],
  tasks: [
    {
      projectId: '6f36787f-3a7a-4b3e-a822-88b0b55db6cd',
      name: 'start',
      description: '',
      type: 'sustained',
      status: 'idle',
      command: 'react-scripts start',
      timeSinceStatusChange: null,
      logs: [],
    },
  ],
  path: path.join('work', 'hello-world'),
  ...overrides,
});

export const createProjectInternal = (overrides: any) => ({
  name: 'hello-world',
  dependencies: {
    react: '^16.5.0',
    'react-dom': '^16.5.0',
  },
  scripts: {
    start: 'react-scripts start',
    build: 'react-scripts build',
  },
  guppy: {
    id: '26890cf3-06b9-4b35-a92f-2fb8241b7f6d',
    name: 'Hello World',
    type: 'create-react-app',
    color: '#00FFFF',
    icon: 'path/to/icon',
    createdAt: sept14thTimestamp,
  },
});
