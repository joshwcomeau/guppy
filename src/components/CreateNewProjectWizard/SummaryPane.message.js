// @flow
import { defineMessages } from 'react-intl';

const messages = {
  start: {
    title: {
      id: 'createNewProjectWizard.summaryPane.start.title',
      defaultMessage: 'Create new project',
      description: 'Title for the "Create new project" section',
    },
    content: {
      id: 'createNewProjectWizard.summaryPane.start.content',
      defaultMessage: "Let's start by giving your new project a name.",
      description: 'Ask the user to start by giving the project a name',
    },
  },
  projectName: {
    title: {
      id: 'createNewProjectWizard.summaryPane.projectName.title',
      defaultMessage: 'Project Name',
      description: 'Title for the "Project Name" section',
    },
    content: {
      id: 'createNewProjectWizard.summaryPane.projectName.content',
      defaultMessage:
        "Don't stress too much about your project's name!" +
        ' You can always change this later.',
      description:
        'Tell the user no worry they can always change the name later',
    },
  },
  projectType: {
    title: {
      id: 'createNewProjectWizard.summaryPane.projectType.title',
      defaultMessage: 'Project Type',
      description: 'Title for the "Project Type" section',
    },
    content: {
      id: 'createNewProjectWizard.summaryPane.projectType.content',
      defaultMessage:
        'Guppy can create projects of different types.' +
        ' Click a type to learn more about it.',
      description: 'Tell the user to learn about the project types',
    },
    reactIntro: {
      id: 'createNewProjectWizard.summaryPane.projectType.reactIntro',
      defaultMessage:
        'Vanilla React projects use create-react-app, an official' +
        ' command-line tool built by Facebook for bootstrapping React applications.',
      description: 'Intro for Vanilla React',
    },
    reactComment: {
      id: 'createNewProjectWizard.summaryPane.projectType.reactComment',
      defaultMessage:
        "It's a fantastic general-purpose tool, and is the recommended" +
        " approach if you're looking to become a skilled React developer.",
      description: 'Comment for Vanilla React',
    },
    reactLearn: {
      id: 'createNewProjectWizard.summaryPane.projectType.reactIntro',
      defaultMessage: 'Learn more about create-react-app.',
      description: 'Text for Learn Vanilla React',
    },
    gatsbyIntro: {
      id: 'createNewProjectWizard.summaryPane.projectType.gatsbyIntro',
      defaultMessage:
        'Gatsby is a blazing fast static site generator for React.',
      description: 'Intro for Gatsby',
    },
    gatsbyComment: {
      id: 'createNewProjectWizard.summaryPane.projectType.gatsbyComment',
      defaultMessage:
        "It's great for building blogs and personal websites, and" +
        ' provides amazing performance out-of-the-box. A great choice for quickly' +
        ' getting products built.',
      description: 'Comment for Gatsby',
    },
    gatsbyLearn: {
      id: 'createNewProjectWizard.summaryPane.projectType.gatsbyIntro',
      defaultMessage: 'Learn more about Gatsby.',
      description: 'Text for Learn Gatsby',
    },
    nextjsIntro: {
      id: 'createNewProjectWizard.summaryPane.projectType.nextjsIntro',
      defaultMessage:
        'Next.js is a lightweight framework for static and' +
        ' server-rendered applications.',
      description: 'Intro for Next.js',
    },
    nextjsComment: {
      id: 'createNewProjectWizard.summaryPane.projectType.nextjsComment',
      defaultMessage:
        'Server-rendered by default. No need to worry about routing.' +
        ' A great choice for quickly getting products built with server-side' +
        ' rendering by a Node.js server.',
      description: 'Comment for Next.js',
    },
    nextjsLearn: {
      id: 'createNewProjectWizard.summaryPane.projectType.nextjsIntro',
      defaultMessage: 'Learn more about Next.js.',
      description: 'Text for Learn Next.js',
    },
  },
  projectIcon: {
    title: {
      id: 'createNewProjectWizard.summaryPane.projectIcon.title',
      defaultMessage: 'Project Icon',
      description: 'Title for the "Project Icon" section',
    },
    content: {
      id: 'createNewProjectWizard.summaryPane.projectIcon.content',
      defaultMessage:
        'Choose an icon, to help you recognize this project from a list.',
      description: 'Tell the user to choose an icon',
    },
  },
  projectStarter: {
    title: {
      id: 'createNewProjectWizard.summaryPane.projectStarter.title',
      defaultMessage: 'Gatsby Starter',
      description: 'Title for the "Gatsby Starter" section',
    },
    enter: {
      id: 'createNewProjectWizard.summaryPane.projectStarter.enter',
      defaultMessage:
        'Please enter a starter for your project (e.g.' +
        ' gatsby-starter-blog or repo. url) or pick one from the starters list.',
      description: 'Tell the user to enter a starter or pick one from the list',
    },
    optional: {
      id: 'createNewProjectWizard.summaryPane.projectStarter.optional',
      defaultMessage:
        'This step is optional. Just leave the field empty to use the' +
        ' default Gatsby starter. But picking a starter will help to bootstrap your' +
        ' project e.g. you can easily create your own blog by picking one of the' +
        ' blog starter templates.',
      description:
        'Tell the user he can just leave it blank to use the default starter',
    },
    overview: {
      id: 'createNewProjectWizard.summaryPane.projectStarter.overview',
      defaultMessage: 'For a better overview you can also have a look at the ',
      description: 'Tell the user he can get a better overview here',
    },
    library: {
      id: 'createNewProjectWizard.summaryPane.projectStarter.library',
      defaultMessage: 'Gatsby starters library',
      description: 'Text for "Gatsby starters library"',
    },
  },
};

const definedMessages = defineMessages(messages);

export default definedMessages;
