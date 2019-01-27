// @flow

// project type configuration
// used for
// - create project command args
// - devServer name mapping
//
import type { ProjectType } from '../types';

const config: {
  [projectType: ProjectType]: {
    devServer: {
      taskName: string,
      args: Array<string>,
      env?: {
        [envVariable: string]: string,
      },
    },
    create: {
      args: Array<string>,
    },
  },
} = {
  'create-react-app': {
    devServer: {
      taskName: 'start',
      args: ['run', 'start'],
      env: {
        PORT: '$port',
      },
    },
    create: {
      // not sure if we need that nesting but I think there could be more to configure
      args: [
        // used for project creation previous getBuildInstructions
        'create-react-app',
        '$projectPath',
      ],
    },
  },
  gatsby: {
    devServer: {
      taskName: 'develop',
      // gatsby needs -p instead of env for port changing
      args: ['run', 'develop', '-p', '$port'],
    },
    create: {
      // not sure if we need that nesting but I think there could be more to configure
      args: [
        // used for project creation previous getBuildInstructions
        'gatsby',
        'new',
        '$projectPath',
        '$projectStarter',
      ],
    },
  },
  nextjs: {
    devServer: {
      taskName: 'dev',
      args: ['run', 'dev', '-p', '$port'],
    },
    create: {
      args: [
        'github:awolf81/create-next-app', // later will be 'create-next-app' --> added a comment to the following issue https://github.com/segmentio/create-next-app/issues/30
        '$projectPath',
      ],
    },
  },
};

export default config;
