// @flow
import { defineMessages } from 'react-intl';

const messages = {
  main: {
    selected: {
      id: 'createNewProjectWizard.gatsby.selectStarterList.main.selected',
      defaultMessage: 'selected',
      description: 'Text for "selected"',
    },
    noDescreption: {
      id: 'createNewProjectWizard.gatsby.selectStarterList.main.noDescreption',
      defaultMessage: 'No description',
      description: 'Text for "No description"',
    },
    preview: {
      id: 'createNewProjectWizard.gatsby.selectStarterList.main.preview',
      defaultMessage: 'Preview in Codesandbox',
      description: 'Text for "Preview in Codesandbox"',
    },
    showMore: {
      id: 'createNewProjectWizard.gatsby.selectStarterList.main.showMore',
      defaultMessage: 'Show more...',
      description: 'Text for the button "Show more..."',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
