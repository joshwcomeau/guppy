import {
  IMPORT_EXISTING_PROJECT_FINISH,
  ADD_DEPENDENCY_FINISH,
  REFRESH_PROJECTS_FINISH,
  SELECT_PROJECT,
  ADD_PROJECT,
} from '../actions';

import reducer, {
  initialState as projectsInitialState,
  getById,
  getSelectedProjectId,
  getInternalProjectById,
} from './projects.reducer';

describe('Projects Reducer', () => {
  [ADD_PROJECT, IMPORT_EXISTING_PROJECT_FINISH].forEach(ACTION => {
    describe(ACTION, () => {
      it('adds the project to the state', () => {
        const action = {
          type: ACTION, // ADD_PROJECT or IMPORT_EXISTING_PROJECT_FINISH
          project: {
            name: 'testing',
            guppy: { id: 'best-id' },
            scripts: {
              start: 'react-scripts start',
            },
          },
        };
        const actualState = reducer(projectsInitialState, action);

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

      it("selects it, when it isn't the first one", () => {
        const initialState = {
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
        };
        const actualState = reducer(initialState, action);

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

  describe(ADD_DEPENDENCY_FINISH, () => {
    it('adds dependency to project dependencies', () => {
      const action = {
        type: ADD_DEPENDENCY_FINISH,
        projectId: 'foo',
        dependency: {
          description: 'Package',
          homepage: 'http://example.com/',
          keywords: [],
          license: 'MIT',
          name: 'package',
          repository: {},
          status: 'idle',
          version: '4.0.0',
        },
      };

      const initialState = {
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

      const actualState = reducer(initialState, action);

      expect(actualState).toEqual({
        byId: {
          foo: {
            ...initialState.byId.foo,
            dependencies: {
              [action.dependency.name]: action.dependency.version,
            },
          },
        },
        selectedId: null,
      });
    });
  });

  describe(REFRESH_PROJECTS_FINISH, () => {
    it('returns a null selectedId if selected project does not exist in the list of projects', () => {
      const initialState = {
        ...projectsInitialState,
        selectedId: 'hello',
      };

      const action = {
        type: REFRESH_PROJECTS_FINISH,
        projects: {},
      };

      const actualState = reducer(initialState, action);

      expect(actualState).toEqual({
        ...projectsInitialState,
        selectedId: null,
      });
    });

    it('returns a null selectedId if initial selectedId is null', () => {
      const initialState = {
        ...projectsInitialState,
        selectedId: null,
      };

      const action = {
        type: REFRESH_PROJECTS_FINISH,
        projects: {},
      };

      const actualState = reducer(initialState, action);

      expect(actualState).toEqual({
        ...initialState,
        selectedId: null,
      });
    });

    it('returns selectedId if selectedId is found in projects', () => {
      const initialState = {
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
        projects: initialState.byId,
      };

      const actualState = reducer(initialState, action);

      expect(actualState).toEqual({
        ...initialState,
        selectedId: initialState.selectedId,
      });
    });
  });

  describe(SELECT_PROJECT, () => {
    it('selects the projectId as the selectedId', () => {
      const initialState = {
        ...projectsInitialState,
      };

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
});

describe('Project Reducer // Helpers', () => {
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
      expect(getInternalProjectById(state, id)).toBe('testing');
    });
  });
});
