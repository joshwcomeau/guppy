# 🐠 Guppy

### A friendly application manager and task runner for React.js

> This is a temporary README and should be rewritten pre-launch

There are a lot of "meta" skills around React web development that don't really have anything to do with building great web products.

For example, the terminal. For those of us who didn't grow up on a unix shell, the terminal is an inscrutable box of cryptic and indecipherable commands. It's undoubtedly powerful, and a valuable skill to develop... but should it really be a pre-requisite for working with React?

Guppy is a desktop application designed to make it easier to get started building React web products. It provides a friendly GUI for many of the typical tasks facing React developers:

- Creating new projects
- Running a development server
- Executing other tasks (building for production, running tests, ...)
- Managing dependencies (searching on NPM, adding, updating)

Guppy is built for beginners - I imagine the typical user as a fresh bootcamp enrollee, or someone starting to tinker on the side. It also aims to be powerful enough to be useful for experienced developers as well, although this is a secondary priority.

### Current Status

Guppy is in pre-release development.

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
