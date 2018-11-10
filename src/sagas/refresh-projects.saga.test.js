/* eslint-disable flowtype/require-valid-file-annotation */
import { call, put, select, takeEvery } from 'redux-saga/effects';

import rootSaga, { refreshProjects } from './refresh-projects.saga';

import {
  refreshProjectsError,
  REFRESH_PROJECTS_START,
  refreshProjectsFinish,
} from '../actions';
import { getPathsArray } from '../reducers/paths.reducer';
import { loadGuppyProjects } from '../services/read-from-disk.service';

describe('refresh-projects saga', () => {
  describe('root import-project saga', () => {
    it('should watching for start actions', () => {
      const saga = rootSaga();
      expect(saga.next().value).toEqual(
        takeEvery(REFRESH_PROJECTS_START, refreshProjects)
      );
    });
  });

  describe('refreshProjects', () => {
    it('fetches and dispatches project info', () => {
      const saga = refreshProjects();

      // select the paths from Redux state
      expect(saga.next().value).toEqual(select(getPathsArray));

      // load the guppy projects from the paths specified.
      const pathsArray = ['/path/to/project', 'another/path/to/project'];
      expect(saga.next(pathsArray).value).toEqual(
        call(loadGuppyProjects, pathsArray)
      );

      const guppyProjects = {
        project: {
          id: 'a',
          name: 'a',
          type: 'create-react-app',
          icon: '',
          color: '',
          createdAt: Date.now(),
          dependencies: [],
          tasks: [],
          path: pathsArray[0],
        },
        anotherProject: {
          id: 'b',
          name: 'b',
          type: 'gatsby',
          icon: '',
          color: '',
          createdAt: Date.now(),
          dependencies: [],
          tasks: [],
          path: pathsArray[1],
        },
      };

      // dispatch the 'finish' call with this data
      expect(saga.next(guppyProjects).value).toEqual(
        put(refreshProjectsFinish(guppyProjects))
      );
    });

    it('dispatches an error when it cannot fetch the projects', () => {
      const saga = refreshProjects();

      // select the paths from Redux state
      expect(saga.next().value).toEqual(select(getPathsArray));

      // load the guppy projects from the paths specified.
      const pathsArray = ['/path/to/project', 'another/path/to/project'];
      expect(saga.next(pathsArray).value).toEqual(
        call(loadGuppyProjects, pathsArray)
      );

      // dispatch the 'finish' call with this data
      const error = 'invalid path';

      expect(saga.throw(error).value).toEqual(
        put(refreshProjectsError('invalid path'))
      );
    });
  });
});
