/* eslint-disable flowtype/require-valid-file-annotation */
import {
  IMPORT_EXISTING_PROJECT_FINISH,
  INSTALL_DEPENDENCIES_FINISH,
  UNINSTALL_DEPENDENCIES_FINISH,
  REFRESH_PROJECTS_FINISH,
  SAVE_PROJECT_SETTINGS_FINISH,
  FINISH_DELETING_PROJECT,
  SELECT_PROJECT,
  ADD_PROJECT,
  RESET_ALL_STATE,
  REARRANGE_PROJECTS_IN_SIDEBAR,
} from '../actions';

import reducer, {
  initialState,
  getById,
  getSelectedProjectId,
  getInternalProjectById,
  prepareProjectForConsumption,
  getProjectsArray,
  getProjectById,
} from './projects.reducer';

describe('Projects Reducer', () => {
  [ADD_PROJECT, IMPORT_EXISTING_PROJECT_FINISH].forEach(ACTION => {
    describe(`${ACTION}`, () => {
      const testProject = {
        name: 'testing',
        guppy: { id: 'best-id' },
        scripts: {
          start: 'react-scripts start',
        },
      };

      it("adds the project to the state when still onboarding and doesn't select it", () => {
        const action = {
          type: ACTION, // ADD_PROJECT or IMPORT_EXISTING_PROJECT_FINISH
          project: testProject,
          isOnboardingCompleted: false,
        };
        const actualState = reducer(initialState, action);

        const { name, guppy, scripts } = action.project;

        expect(actualState).toEqual({
          byId: {
            [guppy.id]: {
              name,
              guppy,
              scripts,
            },
          },
          order: ['best-id'],
          selectedId: null,
        });
      });

      it('adds the project to the state when onboarding is finished and selects it', () => {
        const action = {
          type: ACTION, // ADD_PROJECT or IMPORT_EXISTING_PROJECT_FINISH
          project: testProject,
          isOnboardingCompleted: true,
        };
        const actualState = reducer(initialState, action);

        const { name, guppy, scripts } = action.project;

        expect(actualState).toEqual({
          byId: {
            [guppy.id]: {
              name,
              guppy,
              scripts,
            },
          },
          order: ['best-id'],
          selectedId: guppy.id,
        });
      });

      it("selects it, when it isn't the first one", () => {
        const prevState = {
          byId: {
            preexisting: {
              name: 'I pre-exist!',
              guppy: {},
              scripts: {
                start: 'react-scripts start',
              },
            },
          },
          order: ['best-id'],
          selectedId: 'preexisting',
        };

        const action = {
          type: ACTION, // ADD_PROJECT or IMPORT_EXISTING_PROJECT_FINISH
          project: {
            name: 'next project',
            guppy: { id: 'next-project' },
            scripts: {
              start: 'react-scripts start',
            },
          },
          isOnboardingCompleted: true,
        };
        const actualState = reducer(prevState, action);

        const { name, guppy, scripts } = action.project;

        expect(actualState).toEqual({
          byId: {
            preexisting: {
              name: 'I pre-exist!',
              guppy: {},
              scripts: {
                start: 'react-scripts start',
              },
            },
            [guppy.id]: {
              name,
              guppy,
              scripts,
            },
          },
          order: ['next-project', 'best-id'],
          selectedId: guppy.id,
        });
      });
    });
  });

  describe(`${INSTALL_DEPENDENCIES_FINISH}`, () => {
    it('adds dependency to project dependencies', () => {
      const action = {
        type: INSTALL_DEPENDENCIES_FINISH,
        projectId: 'foo',
        dependencies: [
          {
            description: 'Package',
            homepage: 'http://example.com/',
            keywords: [],
            license: 'MIT',
            name: 'package',
            repository: {},
            status: 'idle',
            version: '4.0.0',
          },
        ],
      };

      const prevState = {
        byId: {
          foo: {
            dependencies: {},
            guppy: {
              color: 'black',
              createdAt: 12345,
              icon: 'http://example.com/link/to/pic',
              id: 'foo',
              name: 'Foo',
              type: 'create-react-app',
            },
          },
        },
      };

      const actualState = reducer(prevState, action);

      expect(actualState).toEqual({
        byId: {
          foo: {
            ...prevState.byId.foo,
            dependencies: {
              [action.dependencies[0].name]: action.dependencies[0].version,
            },
          },
        },
        order: [],
        selectedId: null,
      });
    });
  });

  describe(`${UNINSTALL_DEPENDENCIES_FINISH}`, () => {
    it('removes dependency', () => {
      const initialDependencies = {
        package: {
          description: 'Package',
          homepage: 'http://example.com/',
          keywords: [],
          license: 'MIT',
          name: 'package',
          repository: {},
          status: 'idle',
          version: '4.0.0',
        },
        'another-package': {
          description: 'Another Package',
          homepage: 'http://example-package.com/',
          keywords: [],
          license: 'MIT',
          name: 'another-package',
          repository: {},
          status: 'idle',
          version: '4.0.0',
        },
      };
      const prevState = {
        ...initialState,
        byId: {
          foo: {
            dependencies: { ...initialDependencies },
            guppy: {
              color: 'black',
              createdAt: 12345,
              icon: 'http://example.com/link/to/pic',
              id: 'foo',
              name: 'Foo',
              type: 'create-react-app',
            },
          },
        },
      };
      const action = {
        type: UNINSTALL_DEPENDENCIES_FINISH,
        projectId: 'foo',
        dependencies: [
          {
            description: 'Another Package',
            homepage: 'http://example-package.com/',
            keywords: [],
            license: 'MIT',
            name: 'another-package',
            repository: {},
            status: 'idle',
            version: '4.0.0',
          },
        ],
      };
      const actualState = reducer(prevState, action);

      expect(actualState).toEqual({
        ...prevState,
        byId: {
          foo: {
            ...prevState.byId.foo,
            dependencies: {
              package: {
                description: 'Package',
                homepage: 'http://example.com/',
                keywords: [],
                license: 'MIT',
                name: 'package',
                repository: {},
                status: 'idle',
                version: '4.0.0',
              },
            },
          },
        },
      });
    });
  });

  describe(`${REFRESH_PROJECTS_FINISH}`, () => {
    it('returns a null selectedId if selected project does not exist in the list of projects', () => {
      const prevState = {
        ...initialState,
        selectedId: 'hello',
      };

      const action = {
        type: REFRESH_PROJECTS_FINISH,
        projects: {},
      };

      const actualState = reducer(prevState, action);

      expect(actualState).toEqual({
        ...initialState,
        selectedId: null,
      });
    });

    it('returns a null selectedId if initial selectedId is null', () => {
      const prevState = {
        ...initialState,
        selectedId: null,
      };

      const action = {
        type: REFRESH_PROJECTS_FINISH,
        projects: {},
      };

      const actualState = reducer(prevState, action);

      expect(actualState).toEqual({
        ...prevState,
        selectedId: null,
      });
    });

    it('returns selectedId if selectedId is found in projects', () => {
      const prevState = {
        byId: {
          foo: {
            name: 'foo',
            guppy: { id: 'foo' },
            scripts: {
              start: 'command it',
            },
          },
        },
        order: ['foo'],
        selectedId: 'foo',
      };

      const action = {
        type: REFRESH_PROJECTS_FINISH,
        projects: prevState.byId,
      };

      const actualState = reducer(prevState, action);

      expect(actualState).toEqual({
        ...prevState,
        selectedId: prevState.selectedId,
      });
    });

    it('should update but maintain the order', () => {
      const testProject = {
        name: 'testing',
        guppy: { id: 'best-id' },
        scripts: {
          start: 'react-scripts start',
        },
      };

      const prevState = {
        byId: {
          'first-id': {
            name: 'foo',
            guppy: { id: 'first-id', icon: null },
            scripts: { start: 'command it' },
          },
          'second-id': {
            name: 'foo',
            guppy: { id: 'second-id', icon: null },
            scripts: { start: 'command it' },
          },
          'third-id': {
            name: 'foo',
            guppy: { id: 'third-id', icon: null },
            scripts: { start: 'command it' },
          },
        },
        order: ['second-id', 'first-id', 'third-id'], // re-ordered intentionally
        selectedId: null,
      };

      const projects = { ...prevState.byId, 'best-id': { ...testProject } };

      const refreshAction = {
        type: REFRESH_PROJECTS_FINISH,
        projects,
      };
      const actualState = reducer(prevState, refreshAction);

      expect(actualState).toEqual({
        ...actualState,
        byId: {
          ...prevState.byId,
          'best-id': { ...testProject },
        },
        order: ['best-id', 'second-id', 'first-id', 'third-id'], // keep previous order & add new project as first item
      });
    });
  });

  describe(`${SELECT_PROJECT}`, () => {
    it('selects the projectId as the selectedId', () => {
      const action = {
        type: SELECT_PROJECT,
        projectId: 'foobar',
      };

      const actualState = reducer(initialState, action);

      expect(actualState).toEqual({
        ...initialState,
        selectedId: action.projectId,
      });
    });
  });

  describe(`${RESET_ALL_STATE}`, () => {
    it('resets to initialState', () => {
      const prevState = {
        byId: {
          foo: {
            name: 'foo',
            guppy: { id: 'foo' },
            scripts: {
              start: 'command it',
            },
          },
        },
        selectedId: 'foo',
      };
      const action = { type: RESET_ALL_STATE };
      const actualState = reducer(prevState, action);

      expect(actualState).toEqual(initialState);
    });
  });

  describe(`${SAVE_PROJECT_SETTINGS_FINISH}`, () => {
    it('should update state', () => {
      const prevState = {
        byId: {
          'uuidv1-id': {
            name: 'foo',
            guppy: { id: 'uuidv1-id', icon: null },
            scripts: { start: 'command it' },
          },
        },
        selectedId: null,
      };

      const newProject = {
        name: 'new foo',
        guppy: { id: 'uuidv1-id', icon: 'new-icon' },
        scripts: { start: 'command it' },
      };
      const action = {
        type: SAVE_PROJECT_SETTINGS_FINISH,
        project: newProject,
      };
      const actualState = reducer(prevState, action);

      expect(actualState).toEqual({
        byId: {
          'uuidv1-id': newProject,
        },
        order: [],
        selectedId: 'uuidv1-id',
      });
    });
  });

  describe(`${REARRANGE_PROJECTS_IN_SIDEBAR}`, () => {
    it('should change order', () => {
      const prevState = {
        order: ['first-id', 'second-id', 'third-id'],
      };
      const action = {
        type: REARRANGE_PROJECTS_IN_SIDEBAR,
        originalIndex: 0,
        newIndex: 1,
      };
      const actualState = reducer(prevState, action);

      expect(actualState).toEqual({
        ...initialState,
        order: ['second-id', 'first-id', 'third-id'],
      });
    });
  });

  describe(`${FINISH_DELETING_PROJECT}`, () => {
    it('should remove deleted item from order', () => {
      const prevState = {
        order: ['first-id', 'second-id', 'third-id'],
      };
      const action = {
        type: FINISH_DELETING_PROJECT,
        projectId: 'second-id',
      };
      const actualState = reducer(prevState, action);

      expect(actualState).toEqual({
        ...initialState,
        order: ['first-id', 'third-id'],
      });
    });
  });
});

describe('Selectors', () => {
  const mockDependencies = {
    foo: {
      'first-dep': {},
      'second-dep': {},
    },
    bar: {
      'first-dep': {},
      'second-dep': {},
    },
  };

  it('should getProjectsArray', () => {
    const commonProjectKeys = {
      type: 'create-react-app',
      color: 'black',
      icon: 'http://example.com/link/to/pic',
      createdAt: 12345,
    };
    const mockParameters = {
      byId: {
        foo: {
          name: 'foo',
          guppy: { id: 'foo', name: 'Foo', ...commonProjectKeys },
          scripts: {
            start: 'command it',
          },
        },
        bar: {
          name: 'bar',
          guppy: { id: 'bar', name: 'Bar', ...commonProjectKeys },
          scripts: {
            start: 'command it',
          },
        },
      },
      tasks: {},
      dependencies: {
        ...mockDependencies,
      },
      paths: ['project-path/'],
      order: ['foo', 'bar'],
    };
    const selected = getProjectsArray.resultFunc(
      mockParameters.byId,
      mockParameters.tasks,
      mockParameters.dependencies,
      mockParameters.paths,
      mockParameters.order
    );
    expect(selected).toMatchSnapshot();
  });

  it('should getProjectById', () => {
    const mockParameters = {
      internalProject: {
        guppy: {
          id: 'test-id',
          name: 'test',
          type: 'create-react-app',
          color: 'black',
          icon: 'http://example.com/link/to/pic',
          createdAt: 12345,
        },
      },
      tasks: {},
      dependencies: {
        ...mockDependencies,
      },
      path: 'project-path/',
    };
    const selected = getProjectById.resultFunc(
      mockParameters.internalProject,
      mockParameters.tasks,
      mockParameters.dependencies,
      mockParameters.path
    );

    expect(getProjectById.resultFunc(null)).toBeNull();
    expect(selected).toMatchSnapshot();
  });
});

describe('helpers', () => {
  describe('getById', () => {
    it('gets projects by id', () => {
      const state = { projects: { byId: 'great object' } };
      expect(getById(state)).toBe('great object');
    });
  });

  describe('getSelectedProjectId', () => {
    it('gets projects selected id', () => {
      const state = { projects: { selectedId: 'great object' } };
      expect(getSelectedProjectId(state)).toBe('great object');
    });
  });

  describe('getInternalProjectById', () => {
    it('gets project by id', () => {
      const id = 'test-id';
      const state = {
        projects: { byId: { [id]: 'testing' }, order: ['best-id'] },
      };
      expect(getInternalProjectById(state, { projectId: id })).toBe('testing');
    });
  });

  describe('prepareProjectForConsumption', () => {
    it('prepares project for consumption', () => {
      // Note: It combines project, tasks, dependencies, path into a project
      const project = {
        guppy: {
          id: 'test-id',
          name: 'test',
          type: 'create-react-app',
          color: 'black',
          icon: 'http://example.com/link/to/pic',
          createdAt: 12345,
        },
      };
      const tasks = {};
      const dependencies = {};
      const path = 'user/guppy-projects';
      expect(prepareProjectForConsumption(project, tasks, dependencies, path))
        .toMatchInlineSnapshot(`
Object {
  "color": "black",
  "createdAt": 12345,
  "dependencies": Array [],
  "icon": "http://example.com/link/to/pic",
  "id": "test-id",
  "name": "test",
  "path": "user/guppy-projects",
  "tasks": Array [],
  "type": "create-react-app",
}
`);
    });
  });
});
