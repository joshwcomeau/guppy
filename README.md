# 🐠 Guppy

### A friendly application manager and task runner for React.js

![Guppy project screen](https://github.com/joshwcomeau/guppy/raw/master/docs/images/main-image.png)

There are a lot of "meta" skills around React web development that don't really have anything to do with building great web products.

For example, the terminal. For those of us who didn't grow up on a unix shell, the terminal is an inscrutable box of cryptic and indecipherable commands. It's undoubtedly powerful, and a valuable skill to develop... but should it really be a pre-requisite for modern web development?

Guppy is a free-to-use desktop application designed to make it easier to get started building React web products. It provides a friendly GUI for many of the typical tasks facing React developers:

- Creating new projects
- Running a development server
- Executing tasks (building for production, running tests)
- Managing dependencies (adding, updating, searching)

Guppy is made for beginners - folks who are just starting out with web development. We hope that it's powerful enough for advanced users as well, but we'll always prioritize the new-developer experience. We'll never charge money for Guppy, it'll always be free-to-use.

> **NOTE**: This is _super early pre-release alpha_. Truthfully it's probably not ready for beginner usage yet (there may be some frustrating bugs). The goal is to build a community of folks to work on this and create something truly useful and wonderful for beginners.

### Current Status

This project is in early pre-release Alpha.

Want to help build something great for newcomers? We're actively looking for contributors to help develop this pre-release alpha into something amazing. This is a great time to get involved and help shape the future of Guppy!

Also, important to note: this is a side-project worked on during spare time. We appreciate any bug reports, but realistically we may not be able to fix issues in a timely manner (feel free to contribute fixes though!)

### Installation

To use Guppy, you'll first need to have a modern version of Node (a Javascript runtime) installed. [Download Node](https://nodejs.org/en/download/current/). The "Current" version is recommended over LTS due to a bug in NPM 5.6.0 that can corrupt dependencies.

Once Node is installed, you can [download Guppy](https://github.com/joshwcomeau/guppy/releases).

Double-click the downloaded executable to open Guppy. Mac users may need to right-click and select "Open" if MacOS complains about the fact that this was downloaded from the internet.

> Note: In future stable releases, I hope to remove the need to download Node by using the Node runtime that comes with Guppy (see [#44](https://github.com/joshwcomeau/guppy/issues/44)). I also plan to create a proper installer so that it's easy to copy Guppy to the Applications folder (see [#26](https://github.com/joshwcomeau/guppy/issues/26)). Contributions welcome!

### Getting Started

Learn more about using Guppy in our [Getting Started guide](https://github.com/joshwcomeau/guppy/blob/master/docs/getting-started.md).

### Internationalization

Unfortunately, Guppy is only available in English right now. Internationalization is being tracked in [#66](https://github.com/joshwcomeau/guppy/issues/66), although truthfully it's pretty far in the horizon.

In the meantime, some folks have started translating the docs into different languages! So, while the app is English-only, at least the docs are translated:

[![china](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/China.png) **中文/Chinese**](https://github.com/chinanf-boy/guppy-docs-zh)

### How it works

Guppy is an electron application that secretly runs terminal commands for you in the background. It uses **create-react-app** and **gatsby-cli**. Support could conceivably be added for Next, and other project types (including non-React ones)

Guppy adds a new top-level key to your `package.json` to store project-related information. It also reads from `package.json` to figure out the current dependencies, and see which tasks are available (via `scripts`).

Guppy has intelligent modules built around task types. For example, the dev server is no ordinary task, it's one that ought to be running throughout your time working on the project, and so it's given its own module at the top of the page.

For more information on learning more about Guppy and contributing, see our [contribution docs](https://github.com/joshwcomeau/guppy/blob/master/CONTRIBUTING.md)

### Future Vision

Right now, Guppy's feature-set is pretty limited. It consists of 3 modules: a "dev-server" pane, a "tasks" pane, and a "dependencies" pane.

The first big change I'd like to see is better support for common dev tools like running tests, linting, code formatting, and so on. Some examples of potential improvements:

- Testing shouldn't just be a thin row in a list, it should have its own module, like the Dev Server does. It should run in "interactive" mode, and allow users to re-run tests by clicking buttons.

- Dependencies should be easy to update. I imagine an "update core dependencies" button that updates react, react-dom, and any associated packages, with built-in codemod support. I imagine it being able to find security problems (via [`npm audit`](https://docs.npmjs.com/getting-started/running-a-security-audit)).

I'd also like to see Guppy become far more useful for educating users about web development. The philosophy of Guppy is that anybody can learn web development, and it should provide resources to help learners along. Guppy has full access to the project code and settings, and so I wonder if there are opportunities to suggest solutions to problems the user runs into... I don't have any concrete ideas yet, but it's interesting to think about.

### Chat

Come hang out with us [on Gitter](https://gitter.im/guppy-gui/Lobby)!

### Contributing

Guppy has an active community of contributors and collaborators that enjoy working together to continuously improve the application's form and function. Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms. If you would like to get involved, have a look at our [Contributing Guide](CONTRIBUTING.md)!

### License

[ISC](LICENSE.md), Copyright 2018-present Joshua Comeau
