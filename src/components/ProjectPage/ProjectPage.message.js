// @flow
import { defineMessages } from 'react-intl';

const messages = {
  fail: {
    ohNo: {
      id: 'projectPage.fail.ohNo',
      defaultMessage: 'Oh no!',
      description: 'Text for "Oh no!" when project fails',
    },
    missing: {
      id: 'projectPage.fail.missing',
      defaultMessage: ' Looks like your project dependencies are missing.',
      description:
        'Text to show the project dependencies are missing when project fails',
    },
    freshClone: {
      id: 'projectPage.fail.freshClone',
      defaultMessage:
        "This can happen if you've freshly cloned a project from GitHub." +
        " In order to run scripts in Guppy, you'll need to install them now.",
      description:
        "Text to show the the fail might happen if it's a fresh clone" +
        ' and prompt the user to install the dependencies',
    },
    install: {
      id: 'projectPage.fail.install',
      defaultMessage: 'Install Dependencies',
      description: 'Label for the "Install Dependencies" button',
    },
  },
  main: {
    openInEditor: {
      id: 'projectPage.main.openInEditor',
      defaultMessage: 'Open in Editor',
      description: 'Label for the "Open in Editor" button',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
