import {
  extractSelectedTaskFromUrl,
  extractProjectIdFromUrl,
  extractProjectTabFromUrl,
} from './location.service';

describe('Location Service', () => {
  const stubLocation = {
    pathname: '/project/some-project-id/tasks/sometaskname',
  };

  describe('extractProjectIdFromUrl', () => {
    it('should extract the project ID from the URL', () => {
      expect(extractProjectIdFromUrl(stubLocation)).toEqual('some-project-id');
    });

    it('should not return anything when the URL does not contain a project ID', () => {
      const locationExample = {
        pathname: '/some/path',
      };

      expect(extractProjectIdFromUrl(locationExample)).toEqual(null);
    });
  });

  describe('extractProjectTabFromUrl', () => {
    it('should extract the project tab from the url', () => {
      expect(extractProjectTabFromUrl(stubLocation)).toEqual('tasks');
    });

    it('should not return anything when the URL does not contain a project tab', () => {
      const locationExample = {
        pathname: '/some/path',
      };

      expect(extractProjectTabFromUrl(locationExample)).toEqual(null);
    });
  });

  describe('extractSelectedTaskFromUrl', () => {
    it('should extract the selected task from the url', () => {
      expect(extractSelectedTaskFromUrl(stubLocation)).toEqual('sometaskname');
    });

    it('should not return anything when the URL does not contain a task', () => {
      const projectLocation = {
        pathname: '/project/some-project-id',
      };

      expect(extractSelectedTaskFromUrl(projectLocation)).toEqual(null);
    });
  });
});
