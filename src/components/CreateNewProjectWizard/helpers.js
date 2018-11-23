// @flow

// Not perfect to have this helper but we're having two locations (BuildPane & CreateNewProjectWizard) where it is used
// I'd like to keep the user input unmodified and use only Gatsby github repo as short-hand so entering
// gatsby-starter-blog will be https://github.com/gatsby/gatsby-starter-blog
// Todo: We could also add a short-hand for username/repo to replace with https://github.com/username/repo
//       An additional check for string with-out slash would be required to still support the Gatsby replacement.

export const defaultStarterUrl = 'https://github.com/gatsbyjs/';

export const replaceProjectStarterStringWithUrl = (
  projectStarterInput: string
) =>
  !projectStarterInput.includes('http') && projectStarterInput !== ''
    ? defaultStarterUrl + projectStarterInput
    : projectStarterInput;
