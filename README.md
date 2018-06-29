# 🐠 Guppy

### A friendly application manager and task runner for React.js

> This is a temporary README and should be rewritten pre-launch

There are a lot of "meta" skills around React web development that don't really have anything to do with building great web products.

For example, the terminal. For those of us who didn't grow up on a unix shell, the terminal is an inscrutable box of cryptic and indecipherable commands. It's undoubtedly powerful, and a valuable skill to develop... but should it really be a pre-requisite for modern web development?

Guppy is a desktop application designed to make it easier to get started building React web products. It provides a friendly GUI for many of the typical tasks facing React developers:

- Creating new projects
- Running a development server
- Executing tasks (building for production, running tests, ...)
- Managing dependencies (adding, updating, searching)

Guppy is made for beginners - folks who are just starting out with web development. We hope that it's powerful enough for advanced users as well, but we'll always prioritize the new-developer experience.

### Current Status

This project is in early pre-release Alpha. We hope to collect feedback and eventually wind up with a rock-solid tool, but for now there may be tons of bugs and missing functionality.

### Platform Support

Right now, **Guppy only works for MacOS**. We hope to support Windows and Linux soon.

Want to help build Guppy? This is the biggest missing feature right now, and contributions would be extremely welcome.

### Installation

To use Guppy, you'll first need to have a modern version of Node (a Javascript runtime) installed. [Download Node](https://nodejs.org/en/download/current/).

Once Node is installed, you can [download Guppy]().

That's it! Double-click Guppy to open it.

> Note: In future stable releases, I hope to remove the need to download Node by using the Node runtime that comes with Guppy. I also plan to create a proper installer so that it's easy to copy Guppy to the Applications folder. Contributions welcome!

### Getting Started

Learn more about using Guppy in our [Getting Started guide](https://github.com/joshwcomeau/guppy/blob/master/docs/getting-started.md).

### Future Vision

Right now, Guppy's feature-set is pretty limited. It consists of 3 modules: a "dev-server" pane, a "tasks" pane, and a "dependencies" pane.

The first big change I'd like to see is better support for common dev tools like running tests, linting, code formatting, and so on. Some examples of potential improvements:

- Testing shouldn't just be a thin row in a list, it should have its own module, like the Dev Server does. It should run in "interactive" mode, and allow users to re-run tests by clicking buttons.

- Dependencies should be easy to update. I imagine an "update core dependencies" button that updates react, react-dom, and any associated packages, with built-in codemod support. I imagine it being able to find security problems (via [`npm audit`](https://docs.npmjs.com/getting-started/running-a-security-audit)).

I'd also like to see Guppy become far more useful for educating users about web development. The philosophy of Guppy is that anybody can learn web development, and it should provide resources to help learners along. Guppy has full access to the project code and settings, and so I wonder if there are opportunities to suggest solutions to problems the user runs into... I don't have any concrete ideas yet, but it's interesting to think about.

### How it works

Guppy is an electron application that secretly runs terminal commands for you in the background. It uses **create-react-app**, with support coming soon for other project types, like Gatsby and Next.

Guppy adds a new key to your `package.json` to store project-related information. It also reads from `package.json` to figure out the current dependencies, and see which tasks are available (via `scripts`).

Originally, Guppy was going to be much more agnostic about project type. I had imagined that it would treat every `script` as a task, and they'd all work exactly the same way. I realized that this isn't very helpful, though; the tasks you want to perform are radically different, and should be treated as such!

For example, the common script for running a development server is `start`. This is a long-running task, though, and extremely important for local development. Guppy separates it in the UI to have its own module. I can also imagine doing this for all of the built-in scripts, so that only user-defined scripts are treated generically.

### Code Organization

This project uses React and Redux. I'm also experimenting with holding most logic in "services". These are just modules (in `src/services`) that manage specific things, like creating a project, finding an available port, or helping provide routing info. They're essentially helper modules, but all geared around specifc tasks.

A lot of the task-running logic lives in `middlewares/task.middleware.js`. This may move into a service at some point.

### Temporary development notes

This project is a create-react-app project, using Electron. I followed the instructions at https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c (well, mostly; instead of using Foreman, I used concurrently, and came up with my own scripts strategy. But overall I mostly followed that blog post).
