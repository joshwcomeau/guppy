/* eslint-disable flowtype/require-valid-file-annotation */
import {
  replaceProjectStarterStringWithUrl,
  defaultStarterUrl,
} from '../helpers';

describe('Build helpers', () => {
  describe('Gatsby helper', () => {
    it('should replace Gatsby starter string with url', () => {
      expect(replaceProjectStarterStringWithUrl('gatsby-starter-blog')).toEqual(
        defaultStarterUrl + 'gatsby-starter-blog'
      );
    });

    it('should ignore empty starter strings', () => {
      expect(replaceProjectStarterStringWithUrl('')).toEqual('');
    });
  });
});
