import {
  IMPORT_EXISTING_PROJECT_FINISH,
  ADD_DEPENDENCY_FINISH,
  REFRESH_PROJECTS,
  SELECT_PROJECT,
  ADD_PROJECT,
} from '../../actions';

import reducer, {
  initialState as projectsInitialState,
  getById,
  getSelectedProjectId,
  getInternalProjectById,
  getProjectsArray,
} from '../projects.reducer';

describe('Projects Reducer', () => {
  describe(ADD_PROJECT, () => {
    it('adds a project', () => {
      const action = {
        type: ADD_PROJECT,
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
        selectedId: guppy.id,
      });
    });
  });

  describe(IMPORT_EXISTING_PROJECT_FINISH, () => {
    it('imports existing project', () => {
      const action = {
        type: IMPORT_EXISTING_PROJECT_FINISH,
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
        selectedId: guppy.id,
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

  describe(REFRESH_PROJECTS, () => {
    it('returns a null selectedId if selected project does not exist in the list of projects', () => {
      const initialState = {
        ...projectsInitialState,
        selectedId: 'hello',
      };

      const action = {
        type: REFRESH_PROJECTS,
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
        type: REFRESH_PROJECTS,
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
        type: REFRESH_PROJECTS,
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
