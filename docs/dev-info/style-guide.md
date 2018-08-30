# Guppy Style Guide

We rely on tools like [Flow](https://flow.org/), [Prettier](https://github.com/prettier/prettier), and [ESLint](https://eslint.org/) to handle most "code style" concerns. However, even with these tools, some things still need to be done manually.

This document holds our conventions around code styles.

---

### Imports

Imports should be grouped in the following way:

```js
// First block: Native Node modules and third-party modules
import fs from 'fs';
import React, { Component } from 'react';

// Second block: actions, constants, reducers, services, etc
import { refreshProjects } from '../../actions';
import { COLORS } from '../../constants';
import { getOnboardingStatus } from '../../reducers/onboarding-status.reducer';

// Third block: React components
// NOTE: Second and third block can be combined in files without a ton of
// imports.
import Sidebar from '../Sidebar';
import ProjectPage from '../ProjectPage';

// Final block: type imports, both third-party and Guppy-specific
import type {Action} from 'redux';
import type {Project} from '../../types';
```

Having consistent import groups makes it easy to quickly get a sense of which
modules a file is using.

### React component structure

##### Flow types

Components should have their props and state defined, when needed, as specific variables:

```js
// BAD
class BadExample extends Component<{ children: React$Node }> {
  ...
}

// GOOD
type Props = {
  children: React$Node,
};

class GoodExample extends Component<Props> {
  ...
}
```

##### One component per file

Every React component file should only have a single "stateful" component.

Feel free to add small stateless-functional-components, if needed, although you can also create those small stateless components in their own files within the same directory:

```js
// BAD
class ThingLink extends Component<ThingProps, ThingState> {
  ...
}

class Thing extends Component<Props, State> {
  ...
}
```

```js
// GOOD
const ThingLink = ({ href }: { href: string }) => (
  ...
)

class Thing extends Component<Props, State> {
  ...
}


// Also good, using file structure:
components
└── Thing
    ├── Thing.js
    ├── ThingLink.js
    └── index.js
```

---

More to come!
