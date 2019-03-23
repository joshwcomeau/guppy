/* eslint-disable flowtype/require-valid-file-annotation */
import { getDocumentationLink } from './project-type-specifics';

describe('getDocumentationLink', () => {
  it('should get the documentation links by project type', () => {
    const gatsbyString = getDocumentationLink('gatsby');
    const createReactAppString = getDocumentationLink('create-react-app');

    expect(typeof gatsbyString).toEqual('string');
    expect(typeof createReactAppString).toEqual('string');

    expect(gatsbyString).not.toBe(createReactAppString);
  });

  it('should throw an exception if passed a project type that is not defined', () => {
    const unknownProjectType = 'some-unknown-project-type';

    expect(() => getDocumentationLink(unknownProjectType)).toThrow(
      `Unrecognized project type: ${unknownProjectType}`
    );
  });
});
