# Privacy Policy

Starting in v0.3.0, Guppy sends analytics data about product usage to a provider (currently [Mixpanel](https://mixpanel.com)). This document outlines our views and practices for data collection.

### Data Collected

The data we collect is strictly limited, and intended only to be used to help us make Guppy better. When a new project is created, for example, we track information like which type of project you're creating ("Vanilla React" or "Gatsby"), because understanding the usage proportions means we can focus our time on improving the experience for the largest number of people. We do **not** collect information on things like what you name your project, both because this feels too personally invasive, and because it doesn't help us make Guppy better.

Because Guppy is open-source, you can feel free to browse this repository to learn exactly how we track data. A project-wide search for `logger.logEvent` should find all the places that data is tracked. Additionally, the vast majority of analytics calls exist in our [`analytics.saga.js`](https://github.com/joshwcomeau/guppy/blob/8dcc14e225a109b82d8aec159efd7c7e3af3a329/src/sagas/analytics.saga.js#L46) file, where they're listed out by Redux action.

### Methods of Identification
Guppy is an Electron app, which means Mixpanel's default cookie-based system doesn't work for tracking data. Instead, when Guppy is opened for the first time, [a random UUID is generated and stored locally on your device](https://github.com/joshwcomeau/guppy/blob/8dcc14e225a109b82d8aec159efd7c7e3af3a329/src/services/analytics.service.js#L30). This is used to help us differentiate new users from returning users. We use a random UUID instead of a device identifier like MAC address to avoid having any sort of non-random identifiers, so that data cannot be traced back to specific devices or people.

### Opting Out and Data Deletion

We don't yet have a way to "opt out" of data collection. We're open to adding a mechanism in the future, if we get the sense that this is important to our users. Please contact us and let us know if that's the case.

In the meantime, we're happy to delete all collected data upon request. Please contact us for more info. Note that if you continue to use Guppy afterwards, new data will continue to be collected.

### Contact

If you have any questions about how data is collected and used, please feel free to ask any questons in our [Gitter chat room](https://gitter.im/guppy-gui/Lobby).

You can also email Guppy's owner at joshwcomeau@gmail.com.
