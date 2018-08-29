# Guppy Code Structure

Hi, prospective contributor!

This guide is meant to give you a quick, high-level overview of how Guppy is structured, so you can track where code might live, and figure out how to structure your contributions.

It is not an exhaustive resource; if you have any questions not covered in this guide, please feel free to [pop into our Gitter](https://gitter.im/guppy-gui/Lobby) and ask!

### Tools Used

Guppy is an [Electron](https://electronjs.org/) application, which means that it's a desktop application written using web technologies.

In addition, we use the following libraries and tools:

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/) (with [Redux Saga](https://github.com/redux-saga/redux-saga) for side-effects and orchestration)
- [styled-components](styled-components.com)
- [Prettier](https://github.com/prettier/prettier)
- [ESLint](https://eslint.org/)
- [Flow](https://flow.org/)
- [Storybook](https://github.com/storybooks/storybook)

Some of these tools, like Electron and Flow, might be intimidating if you haven't used them before. Don't worry too much about this, though; we're a helpful bunch, and we're glad to answer any questions you have, or point you in the right direction in pull requests.

You can learn a bit more about how we use these tools in our [style guide](https://github.com/joshwcomeau/guppy/blob/master/docs/dev-info/style-guide.md).

### Bundling and Electron

In many ways, Guppy is very similar to a standard web app; this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), which means it's bundled with Webpack.

There are a few things that make it different though.

The first is that there's an entry file that runs in Node.js. This file is [main.js](https://github.com/joshwcomeau/guppy/blob/master/src/main.js), and it handles opening the Guppy window, tackles killing processes before the app quits, stuff like that.

Also, Electron fuses the Chrome JS environment with a Node environment, which means some of the code in [`src/services`](https://github.com/joshwcomeau/guppy/blob/master/src/services) use native Node modules, like `child_process` to manage processes, and `fs` to access the file-system.

### File structure

All app code lives in [`src`](https://github.com/joshwcomeau/guppy/blob/master/src/).

Files are grouped by type. This means that there is a directory for components, reducers, services, etc.

Components are stored in directories. This way, we can colocate component-specific things like stories, helpers, and tests:

```
components
└── Button
    ├── Button.js
    ├── Button.stories.js
    ├── Button.test.js
    ├── Button.helpers.js
    └── index.js
```

Occasionally, files won't fit neatly into this structure. For example, there are stories that are not component-specific, like [colors](https://github.com/joshwcomeau/guppy/blob/master/src/stories/colors.stories.js). In these cases, we have folders for them; `src/stories` holds all non-specific stories, for example.

In general, though, we prefer to colocate stories and tests with the associated components.

### Services and Utils

Something a little bit different is the idea of "services" in this application.

A service is just a collection of helper functions, grouped around a domain task. For example, we have a number of functions related to reading and writing to disk, and so there's a [read-from-disk](https://github.com/joshwcomeau/guppy/blob/master/src/services/read-from-disk.service.js) service that groups them.

There is also a [`utils.js`](https://github.com/joshwcomeau/guppy/blob/master/src/utils.js/). This file is meant to hold generic, not-domain-specific utility functions. Essentially this does lodash-type things.

To understand the distinction between "utils" and "services", think of it this way: Is this the kind of function I might want to bring with me to a totally different project? If so, it probably goes in utils. Otherwise, it's likely a service.

### Redux Philosophy

This project uses Redux, and we're pretty opinionated in how we use it.

Actions should describe things happening in the application; either things that the user is doing, or things happening asynchronously because of events. In most cases, they should not be thought of as "setters", or be tightly coupled to a specific reducer.

Ideally, we want to be able to look at the actions log, and get a clear sense of what the user has been doing:

```
SELECT_PROJECT
LAUNCH_DEV_SERVER
RECEIVE_DATA_FROM_TASK_EXECUTION
ADD_DEPENDENCY_START
ADD_DEPENDENCY_FINISH
```

Actions are descriptive, like a narration of what the user is doing. In our opinion, Redux works _so much nicer_ when used this way. The big advantage to doing things this way is that it's easier to keep a consistent mental model: actions describe what's happening, and reducers implement the code required to change the state based on those actions.

It's hard to put into words why this is such a powerful idea, but this perspective-shift can be the difference between hating Redux and loving it.

In contrast, here's the kind of thing we'd like to avoid:

```
// Bad:
SET_PROJECT
SET_TASK_STATUS
SPAWN_TASK
UPDATE_TASK_LOG
LOCK_DEPENDENCIES_FOR_PROJECT
SET_DEPENDENCY_STATUS
SET_DEPENDENCY_LIST
SET_DEPENDENCY_STATUS
```

This example uses actions as MVC setters, and as a result you need a lot more actions to set all the different reducers. In addition to the cost of all those extra renders, the big issue is that it is harder to understand what's happening; it's harder to debug, harder for new developers to understand what's happening.

### Redux Side Effects

By default, Redux doesn't come with any convention to manage side effects, or to sequence action-dispatching.

In its early days, Guppy used `redux-thunk` to handle sequencing, and Redux middlewares to manage side-effects like writing to disk. This approach worked, but it was hard to test, and often felt too complicated.

We're in the middle of switching over to [Redux Saga](https://github.com/redux-saga/redux-saga). Redux Saga is really powerful for both sequencing actions as well as managing side-effects. It's easier to test, and comes with many great tools for advanced sequencing.
