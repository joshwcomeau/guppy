# 🐠 Guppy

### A friendly application manager and task runner for React.js

There are a lot of "meta" skills around React web development that don't really have anything to do with building great web products.

For example, the terminal. For those of us who didn't grow up on a unix shell, the terminal is an inscrutable box of cryptic and indecipherable commands. It's undoubtedly powerful, and a valuable skill to develop... but should it really be a pre-requisite for modern web development?

Guppy is a desktop application designed to make it easier to get started building React web products. It provides a friendly GUI for many of the typical tasks facing React developers:

- Creating new projects
- Running a development server
- Executing tasks (building for production, running tests, ...)
- Managing dependencies (adding, updating, searching)

Guppy is made for beginners - folks who are just starting out with web development. We hope that it's powerful enough for advanced users as well, but we'll always prioritize the new-developer experience.

### Download

[Download Guppy]()

For more information on setup, see [Installation](#installation) below.

### Current Status

This project is in early pre-release Alpha. We hope to collect feedback and eventually wind up with a rock-solid tool, but for now there may be tons of bugs and missing functionality.

This is a side-project worked on during spare time, and no guarantees are made about timely updates and bug fixes.

### Platform Support

Right now, **Guppy only works for MacOS**. We hope to support Windows and Linux soon.

Want to help build Guppy? This is the biggest missing feature right now, and contributions would be extremely welcome.

### Installation

To use Guppy, you'll first need to have a modern version of Node (a Javascript runtime) installed. [Download Node](https://nodejs.org/en/download/current/).

Once Node is installed, you can [download Guppy]().

Double-click the downloaded executable to open Guppy.

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

Guppy is an electron application that secretly runs terminal commands for you in the background. It uses **create-react-app** and **gatsby-cli**. Support could conceivably be added for Next, and other project types (including non-React ones)

Guppy adds a new top-level key to your `package.json` to store project-related information. It also reads from `package.json` to figure out the current dependencies, and see which tasks are available (via `scripts`).

Guppy has intelligent modules built around task types. For example, the dev server is no ordinary task, it's one that ought to be running throughout your time working on the project, and so it's given its own module at the top of the page.
