# About `package.json`

## Overview

Modern web development projects, whether created by Guppy or through the command line, use Node Package Manager (NPM) to manage dependencies (for example, React is a dependency because it's an external package that your code relies on).

Each project that uses NPM has a manifest called `package.json` in the main directory of the project. Inside, it contains various metadata relevant to the project. An example `package.json` looks like this:

```json
{
  "name": "example",
  "version": "1.0.0",
  "main": "src/main.js",
  "homepage": "./",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/yourrepo.git"
  },
  "license": "ISC",
  "scripts": {
    "start": "..."
  },
  "dependencies": {
    "name": "version"
  },
  "devDependencies": {
    "name": "version"
  }
}
```

[This article](https://nodesource.com/blog/the-basics-of-package-json-in-node-js-and-npm/) is a great resource for learning more about these available fields in depth.

## `dependencies` vs. `devDependencies`

### Overview

> What's the difference between these two properties in `package.json`?

While functionally almost identical, there are small differences that set these two apart. At its core, both `dependencies` and `devDependencies` properties in `package.json` are where external packages that your project uses are defined. Both properties contain an object of name/versions. Each time you `npm install` or `npm install --save-dev` a new entry is added to either `dependencies` or `devDependencies` respectively, in the format of 
```json
  "name": "version"
```

### dependencies

The `dependencies` property is where external packages that are essential for your code to run in production are defined (e.g React and React-dom).

### devDependencies

In contrast, `devDependencies` are generally packages needed for development, but not used in your main codebase.

For example, many developers find it worthwhile to write automated tests. Tests let the developer run a task to quickly verify that core functionality still works, without having to manually try things out in the browser.

For React applications, a common test library is jest. Jest is an external dependency, but it's not one we want to include in our application code; our users don't need to run the tests, it's only necessary during development. So we can add it to `devDependencies`, as a way to indicate to other developers that this dependency is only useful for development.

**Note:** For modern web applications, like the ones created with Guppy, the difference between `dependencies` and `devDependencies` is semantic. There is no functional difference between the two. This is because applications only bundle the dependencies *actively used* in the project. Simply installing a dependency, whether to `dependencies` or `devDependencies`, doesn't affect the code sent to your users, unless you use that dependency in the application.

For further reading, please see the [npm docs](https://docs.npmjs.com/files/package.json#dependencies).

## Advanced

### Semantic Versioning

Semantic Versioning (or `SemVer`) is a set of rules that dictate how version numbers are incremented, in the form of `X.Y.Z` (or `Major.Minor.Patch`).

- MAJOR for incompatible changes
- MINOR for backwards-compatible functionality
- PATCH for backwards-compatible bug fixes

For example, if the current version of a package is 1.1.5 and the next version contains a simple bug fix that doesn't alter the core API, it would be considered a patch and thus bumped to version 1.1.6.

When it comes time to update your dependencies, this is very useful information, because at a glance you should then be able to tell if the updated version will break anything or if it can be integrated seamlessly.

### How NPM handles versions

Dependencies you install with Guppy will always be locked to a specific version: If you install React when 16.4.0 is the newest version, the project will always install version 16.4.0, even if you reinstall the dependencies from another computer, a year from now.

When working with the NPM command utility, though, there are special symbols that can be used to specify version ranges, rather than specific versions.

When installing dependencies with `npm install react`, you'll notice that the dependency in package.json has a caret prefix: `^16.4.0`. The caret means that it will pull the latest *minor version*. This means that if you reinstall dependencies a year from now, and the newest version is 16.7.5, it'll grab that version. But if there's been a major version bump to 17.0.0, it'll stick with the latest 16.x.x release.

There are other symbols available corresponding to different ranges. The tilde will match the most recent minor version. For example, `~1.2.3` will match all 1.2.x versions but will not select 1.3.0 or higher. `>=` means any version more than or equal will satisfy. There are many more ranges available. For further reading, please visit the [NPM docs](https://docs.npmjs.com/misc/semver#advanced-range-syntax).

### NPM 5.x.x

In version 5 and above, NPM introduced the `package-lock.json`. This will be generated for you by default every time a dependency is initially installed (`npm install <dependency>`) or `npm install` is run. The file describes the exact dependency tree that was generated, and ensures that any following installs will generate identical trees, regardless of any range symbols.