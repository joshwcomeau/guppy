# dependencies vs. devDependencies

> What's the difference between these two properties in `package.json`?

While functionally almost identical, there are small differences that set these two apart. At its core, both `dependencies` and `devDependences` properties in `package.json` are where external packages that your project uses are defined. Both properties contain an object of name/versions. Each time you `npm install` or `npm install --save-dev` a new entry is added to either `dependencies` or `devDependencies` respectively, in the format of 
```json
  "name": "version"
```

## dependencies

The `dependencies` property is where external packages that are essential for your code to run in production are defined (e.g React and React-dom).

## devDependencies

In contrast, `devDependencies` property is *usually* (but not always) used to define packages needed for development. Packages that could be considered a `devDependency` include tooling for Unit Tests (Jest, Mocha, Chai, Ava), linting (Eslint, Prettier), Javascript transpilation (Babel, TypeScript, Flow), minification (UglifyJs), and deployment tools.

## Caveats

While historically these have been split using the above logic, for front-end React apps, only the dependencies your code uses will be included in the bundle, regardless of whether they're installed in `dependencies` or `devDependencies`.

However, for organizational purposes in `package.json` and to help you and other developers understand how dependencies are used, the separation might still be useful to maintain.

For further reading, please see the [npm docs](https://docs.npmjs.com/files/package.json#dependencies).