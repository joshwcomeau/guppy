import {
  IMPORT_EXISTING_PROJECT_FINISH,
  INSTALL_DEPENDENCIES_FINISH,
  REFRESH_PROJECTS_FINISH,
  SAVE_PROJECT_SETTINGS_FINISH,
  SELECT_PROJECT,
  ADD_PROJECT,
  RESET_ALL_STATE,
} from '../actions';

import reducer, {
  initialState,
  getById,
  getSelectedProjectId,
  getInternalProjectById,
} from './projects.reducer';

describe('Projects Reducer', () => {
  [ADD_PROJECT, IMPORT_EXISTING_PROJECT_FINISH].forEach(ACTION => {
    describe(ACTION, () => {
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
          selectedId: guppy.id,
        });
      });
    });
  });

  describe(INSTALL_DEPENDENCIES_FINISH, () => {
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
        selectedId: null,
      });
    });
  });

  describe(REFRESH_PROJECTS_FINISH, () => {
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
  });

  describe(SELECT_PROJECT, () => {
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

  describe(RESET_ALL_STATE, () => {
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

  describe(SAVE_PROJECT_SETTINGS_FINISH, () => {
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
        selectedId: 'uuidv1-id',
      });
    });
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
      const state = { projects: { byId: { [id]: 'testing' } } };
      expect(getInternalProjectById(state, { projectId: id })).toBe('testing');
    });
  });
});
