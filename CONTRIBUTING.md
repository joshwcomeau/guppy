# Contributing

Thanks for your interest in Guppy! We are open to, and grateful for, any contributions made by the community. We want Guppy to be a community endeavour, all of us working together to make web development more accessible for folks who don't have terminal experience!

## Reporting Issues and Asking Questions

Before opening an issue, please search the [issue tracker](https://github.com/joshwcomeau/guppy/issues) to make sure your issue hasn't already been reported.

### Bugs and Improvements

_Guppy is alpha software_, and you will likely encounter some issues.

We use the issue tracker to keep track of bugs and improvements to Guppy itself, its examples, and the documentation. We encourage you to open issues to discuss improvements, architecture, theory, internal implementation, etc. If a topic has been discussed before, we will ask you to join the previous discussion.

## Development

Visit the [issue tracker](https://github.com/joshwcomeau/guppy/issues) to find a list of open issues that need attention. The best way to contribute is to find something you feel able and willing to tackle. As the project matures we hope to add more "good first contribution" issues for folks newer to React development.

Fork, then clone the repo:

```
git clone https://github.com/your-username/guppy.git
```

### Running

#### Local development

To get started, install all of Guppy's dependencies with [yarn](https://yarnpkg.com/en/docs/getting-started). While you can also use npm for this, we use a `yarn.lock` file to keep everyone's dependecy versions consistent.

```
yarn install
```

Next, run the `start` task to get the app running locally:

```
yarn start
```

This should open an Electron window with the application running.

In development, all projects are created at `~/guppy-projects-dev`

You can build a macOS executable by running:

```
yarn package
```

The result will be in the `release-builds` folder.

### Testing and Type-Checking

Unfortunately, very little of Guppy is currently tested.

We hope to add more tests in the meantime, as well as add CI integration to run tests on push, but for now you can run the tests with:

```
yarn test
```

This project uses Flow, and the types can be checked with:

```
yarn flow
```

This project uses Prettier, this should be run automatically on commit. That step requires that you have yarn installed.

### Debugging

To help you debug, you can open the chromium developer tools inside the running Electron instance from the `View` menu. You can also open the redux developer tools with <kbd>ctrl</kbd>+<kbd>h</kbd> and close them with <kbd>ctrl</kbd>+<kbd>q</kbd>.

### Docs

Please learn more about Guppy at the project [README](https://github.com/joshwcomeau/guppy/blob/master/README.md), or the docs located in the [/docs](https://github.com/joshwcomeau/guppy/tree/master/docs) directory.

### Sending a Pull Request

For non-trivial changes, please open an issue with a proposal for a new feature or refactoring before starting on the work, or comment on an existing requested-feature issue. We don't want you to waste your efforts on a pull request that we won't want to accept.

On the other hand, sometimes the best way to start a conversation _is_ to send a pull request. Use your best judgement!

In general, the contribution workflow looks like this:

- Find or open a new issue in the [Issue tracker](https://github.com/joshwcomeau/guppy/issues).
- Fork the repo.
- Create a new feature branch based off the `master` branch.
- Make sure all tests pass
- Submit a pull request, referencing any issues it addresses.

Please try to keep your pull request focused in scope and avoid including unrelated commits.

After you have submitted your pull request, we'll try to get back to you as soon as possible. We may suggest some changes or improvements.

Thank you for contributing!
