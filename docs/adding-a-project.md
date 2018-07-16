# Adding a Project

> Guppy is a companion tool that aims to totally replace the terminal, so that newcomers to the field aren't burdened with a whole other skillset they need to learn before they can get started building cool things.
>
> It's currently in Alpha, which means that we're still a long way from fully realizing that dream. You may run into bugs, and it's only compatible with certain types of projects, and certain operating systems.
>
> Apologies in advance for any trouble you run into. Please leave feedback!

## Installation

Installation instructions in the [README](https://github.com/joshwcomeau/guppy/blob/master/README.md#installation).

## Your First Project

Guppy works on a per-project basis: each project has its own area in Guppy's interface. So, the first thing we need is a project to work on!

The intro screen presents two options: "Create a new web application" and "import an existing project".

You can also access these options at any time through the application menu:

- `File -> Create New Project` (keyboard shortcut: `⌘N`)
- `File -> Import Existing Project` (keyboard shortcut: `⌘I`)

### Creating a New Project

Choose this option if you want to start a brand new project.

The wizard will guide you through the process, but this guide will add some additional detail on the fields you'll need to fill out.

#### Project Name

Your project name can be whatever you'd like! Special characters are cool. So are emoji 🎉.

> There is currently no way to change the project name from within Guppy, but you can always modify the project's package.json to use a different name.

#### Project Type

There are currently 2 types of supported projects: Vanilla React, and Gatsby.

**Vanilla React** is a minimal yet fully-ready-to-go solution for getting started with React development. It uses [create-react-app](https://github.com/facebook/create-react-app) behind the scenes, a tool built by Facebook, and has become the standard way that new applications are created, for beginners and experienced developers alike.

[**Gatsby**](https://www.gatsbyjs.org/) is a supercharged static site generator that does a bunch of optimizations to be lightning quick. It also has a vibrant community behind it! If you're building a static site (eg. a blog, something informational), it can be a huge productivity boost.

> NOTE: Gatsby has a wide array of "starters" for different usecases, but Guppy doesn't support them yet. We'll add this in a future update, but for now it might be best to create the product through a terminal and then import it into Guppy. See [their official docs](https://www.gatsbyjs.org/tutorial/part-one/#check-your-development-environment) for more information.

Ultimately, the project type you choose depends on your goals. Some thoughts:

- Are you looking to become a professional web developer, and want to learn the craft? Choose "Vanilla React", so that you can learn more about creating React apps from scratch

- Are you looking to build a complex app, like a social network or an AirBnb clone? You'll likely want to go with "Vanilla React", as this is a bit outside the scope of what Gatsby was created for

- Are you looking to build a blog, landing page, or other content-based product? "Gatsby" can save you a ton of time, and is likely the best choice.

#### Project Icon

When you have multiple projects, it's helpful to have a quick, visual way to tell them apart. Your project's icon is useful for jumping around quickly in Guppy.

Note that this icon is not intended to be used within your application, it's simply for Guppy administration.

> In the future, we'll add the ability to use the project's favicon, or upload your own photo. For now, though, we're afraid the only choices are a handful of royalty-free shots.

### Importing an Existing Project

If you've built a create-react-app or Gatsby project outside of Guppy, you may be able to import it to use within Guppy.

Guppy will save a reference to that project, so that the next time you open Guppy, that project is remembered. If the project's path on the disk changes, like if you move it to another directory, you'll need to re-import it, but all of the settings will be saved (we store this information in your project's package.json, so Guppy will always recognize it when it's re-imported, even if it's on another computer!).

To import a project, use the option in the menu at `File -> Import Existing Project` (keyboard shortcut: `⌘I`).
