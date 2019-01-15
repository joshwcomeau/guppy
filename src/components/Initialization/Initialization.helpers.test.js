/* eslint-disable flowtype/require-valid-file-annotation */
import {
  mapTasksPerProjectToString,
  mapActionsToString,
} from './Initialization';

describe('Initialization helpers', () => {
  it('should map install task to string', () => {
    let task = {
      action: 'install',
      active: true,
      dependencies: [
        {
          name: 'test',
          version: '1.0',
          updating: false,
        },
      ],
    };

    expect(mapTasksPerProjectToString(task)).toEqual('- Installing 1 task');

    task.dependencies.push({
      name: 'test2',
      version: '1.0',
      updating: false,
    });
    expect(mapTasksPerProjectToString(task)).toEqual('- Installing 2 tasks');
  });

  it('should map uninstall task to string', () => {
    let task = {
      action: 'uninstall',
      active: true,
      dependencies: [
        {
          name: 'test',
          version: '1.0',
          updating: false,
        },
      ],
    };

    expect(mapTasksPerProjectToString(task)).toEqual('- Uninstalling 1 task');
  });

  it('should map project actions to string', () => {
    const activeActions = [
      {
        name: 'My Dummy Project',
        pending: [
          {
            action: 'install',
            active: true,
            dependencies: [
              {
                name: 'test',
                version: '1.0',
                updating: false,
              },
            ],
          },
          {
            action: 'install',
            active: false, // pending installation
            dependencies: [
              {
                name: 'test2',
                version: '1.0',
                updating: false,
              },
            ],
          },
        ],
      },
      {
        name: 'My Second Project',
        pending: [
          {
            action: 'install',
            active: true,
            dependencies: [
              {
                name: 'test',
                version: '1.0',
                updating: false,
              },
            ],
          },
          {
            action: 'uninstall',
            active: false, // pending installation
            dependencies: [
              {
                name: 'test2',
                version: '1.0',
                updating: false,
              },
              {
                name: 'test3',
                version: '1.0',
                updating: false,
              },
            ],
          },
        ],
      },
    ];

    expect(mapActionsToString(activeActions)).toEqual(
      'Tasks in project My Dummy Project:\n- Installing 1 task\n- Queued 1 task\n\n' +
        'Tasks in project My Second Project:\n- Installing 1 task\n- Queued 2 tasks\n'
    );
  });
});
