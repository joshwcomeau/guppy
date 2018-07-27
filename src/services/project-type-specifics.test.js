import { getDocumentationLink } from './project-type-specifics'

import type { ProjectType } from '../types';

describe('getDocumentationLink', () => {
  it("should get the documentation link for React", () => {
    expect(getDocumentationLink('create-react-app')).toEqual('https://github.com/facebook/create-react-app#user-guide')
  })

  it('should get the documentation link for Gatsby', () => {
    expect(getDocumentationLink('gatsby')).toEqual('https://www.gatsbyjs.org/docs/')
  })

  it('should throw an exception if passed a project type that is not defined', () => {
    const unknownProjectType = 'some-unknown-project-type'
    expect(() => getDocumentationLink(unknownProjectType)).toThrowError(`Unrecognized project type: ${unknownProjectType}`)
  })
})