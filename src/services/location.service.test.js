import {
  extractProjectIdFromUrl,
  buildUrlForProjectId,
  buildUrlForProjectTask,
} from './location.service';

describe('Location Service', () => {
  describe('buildUrlForProjectId', () => {
    test('should return the correct project url based on the project ID', () => {
      expect(buildUrlForProjectId('some-project-id')).toEqual(
        '/project/some-project-id'
      );
    });
  });

  describe('buildUrlForProjectTask', () => {
    test('should return the correct task url based on the project ID and task name', () => {
      expect(
        buildUrlForProjectTask('some-project-id', 'some-task-name')
      ).toEqual('/project/some-project-id/tasks/some-task-name');
    });
  });
});
