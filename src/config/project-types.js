// project type configuration
// used for
// - create project command args
// - devServer name mapping
//
export default {
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
      args: projectPath => [
        // used for project creation previous getBuildInstructions
        'create-react-app',
        projectPath,
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
      args: projectPath => [
        // used for project creation previous getBuildInstructions
        'gatsby',
        'new',
        projectPath, // todo replace later with config variables like $projectPath - so we can remove the function. Also check if it's getting complicated.
      ],
    },
  },
  nextjs: {
    devServer: {
      taskName: 'dev',
      args: ['run', 'dev', '-p', '$port'],
    },
    create: {
      args: projectPath => [
        'github:awolf81/create-next-app', // later will be 'create-next-app' --> added a comment to the following issue https://github.com/segmentio/create-next-app/issues/30
        projectPath,
      ],
    },
  },
};
