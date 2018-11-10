/* eslint-disable flowtype/require-valid-file-annotation */
import { generateRandomName, prefixes, suffixes } from './project-name.service';

describe('generateRandomName', () => {
  const projectName = generateRandomName();
  const tokens = projectName.split(' ');

  it('should capitalize the first letter of each word in the project name', () => {
    tokens.map(token => () => expect(token.charAt(0)).stringMatching(/[A-Z]/));
  });

  it('should put together a prefix and a suffix to generate a project name', () => {
    // The list of words are lowercase, therefore we need to make sure our comparison is the same
    // If the list ever changes to not be all lowercase, then this test will need to be changed/rewritten
    const firstWord = tokens[0].toLowerCase();
    const lastWord = tokens[tokens.length - 1].toLowerCase();

    // We're assuming there are only two words per project name
    // If there are more, we're only testing if the first word is contained within prefix list
    // and if the last word is contained in suffix list
    const isFirstWordAPrefix = prefixes.includes(firstWord);
    const isLastWordASuffix = suffixes.includes(lastWord);

    expect(isFirstWordAPrefix).toEqual(true);
    expect(isLastWordASuffix).toEqual(true);
  });
});
