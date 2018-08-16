# Contributing

Thanks for your interest in Guppy! We are open to, and grateful for, any contributions made by the community. We want Guppy to be a community endeavour, all of us working together to make web development more accessible for folks who don't have terminal experience!

The most important thing to be aware of is that Guppy is a side-project without any full-time staff. As a result, we can't guarantee that issues or pull-requests will be addressed or reviewed in a timely fashion (although we'll certainly try!).

We'd also like to emphasize that, outside of specific cases like quick bug fixes, we'd prefer if **pull requests were opened in response to issues** (and ideally ones that have a consensus already established as to the solution). We don't want to have to reject a pull request because we disagree with the direction or the implementation. For more information, see [Sending a Pull Request](https://github.com/joshwcomeau/guppy/blob/master/CONTRIBUTING.md#sending-a-pull-request)

## Reporting Issues and Asking Questions

Before opening an issue, please search the [issue tracker](https://github.com/joshwcomeau/guppy/issues) to make sure your issue hasn't already been reported.

### Bugs and Improvements

_Guppy is alpha software_, and you will likely encounter some issues.

We use the issue tracker to keep track of bugs and improvements to Guppy itself, its examples, and the documentation. We encourage you to open issues to discuss improvements, architecture, theory, internal implementation, etc. If a topic has been discussed before, we will ask you to join the previous discussion.

### Sending a Pull Request

Please open an issue with a proposal for a new feature or refactoring before starting on the work, or comment on an existing requested-feature issue. We don't want you to waste your efforts on a pull request that we won't want to accept.

Some changes are exceptions. Examples include tiny bugfixes, clarifying something in the docs, etc. Stuff that is unlikely to be controversial, and easy to review.

In general, the contribution workflow looks like this:

- Find or open a new issue in the [Issue tracker](https://github.com/joshwcomeau/guppy/issues).
- Fork the repo.
- Create a new feature branch based off the `master` branch.
- Make sure all tests pass
- Submit a pull request, referencing any issues it addresses.

Please try to keep your pull request focused in scope and avoid including unrelated commits.

After you have submitted your pull request, we'll try to get back to you as soon as possible. We may suggest some changes or improvements.

Thank you for contributing!

### Collaborators

If you contribute a valuable code change, you may receive an invitation to become a collaborator on the Guppy repo. Collaborators are contributors who are given full write access; they can create branches on the repo, merge code, close issues, etc.

We really like the idea of empowering contributors by giving them these privileges. We're trying to build an active community of folks who care about creating a great tool for new coders, and it seems like collaborator roles is a great way to encourage that!

This is a new project, and we're still figuring out the conventions, but here's what you need to know about becoming a collaborator:

- You can clone the repo directly and open pull requests from feature branches, instead of using a fork
- You can moderate issues, closing ones that are duplicates or not relevant, or reopening ones you feel deserve more discussion
- You can submit code reviews for other folks' changes, accepting or requesting changes.
- When reviewing small changes that don't affect the UI, feel free to merge it in when you feel the code is good to go. At least for now, the owner (@joshwcomeau) wants to keep an eye on visual/design changes, so please don't merge in design changes. And for large, non-trivial changes, it might be good to get at least a couple approvals before landing.

When it comes to your own pull requests, please don't accept and/or merge them; we should have at least 1 other pair of eyes on any changes before landing.

It's important to point out that there is **no expectation** of additional work. Feel free to accept the invitation even if you don't think you'll have much time to help contribute. This is about giving people the option to help if they want, not burdening folks with additional responsibilities.

This is an evolving process (collaborators are a new thing for Guppy!), so we'll likely iterate on these conventions as we go.

## Development

Visit the [issue tracker](https://github.com/joshwcomeau/guppy/issues) to find a list of open issues that need attention. The best way to contribute is to find something you feel able and willing to tackle. As the project matures we hope to add more "good first contribution" issues for folks newer to React/Electron development.

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

You can build an executable by running:

```
# MacOS
yarn dist:mac

# Windows
yarn dist:win

# Linux
yarn dist:linux
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

You can check that the project compiles successfully with:

```
yarn package
```

For larger changes, it's worth trying to build the packaged version, to make sure it runs properly there as well.

### Debugging

To help you debug, you can open the chromium developer tools inside the running Electron instance from the `View` menu. You can also open the redux developer tools with <kbd>ctrl</kbd>+<kbd>h</kbd> and close them with <kbd>ctrl</kbd>+<kbd>q</kbd>.

### Docs

Please learn more about Guppy at the project [README](https://github.com/joshwcomeau/guppy/blob/master/README.md), or the docs located in the [/docs](https://github.com/joshwcomeau/guppy/tree/master/docs) directory.
