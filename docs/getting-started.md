# Getting Started with Guppy

> Guppy is a companion tool that aims to totally replace the terminal, so that newcomers to the field aren't burdened with a whole other skillset they need to learn before they can get started building cool things.
>
> It's currently in pre-release Alpha, which means that we're still a long way from fully realizing that dream. You may run into bugs, and it may not be compatible with your existing projects or operating system.
>
> Apologies in advance for any trouble you run into! Contributions welcome.

## Installation

Installation instructions in the [README](https://github.com/joshwcomeau/guppy/blob/master/README.md#installation).

## Adding your first project

To create your first project, click "Create a new web application" at the bottom of the main screen.

The wizard will guide you through selecting a name, icon, and project type.

If you already have a project that you'd like to use with Guppy, you can opt to import an existing project instead. _Please be advised that this feature hasn't been rigorously tested!_ It will only work with projects created with Gatsby or create-react-app, and in the worst case it could potentially mess up your project's `package.json` file. To play it safe, make sure that your project is managed with source-control, so that you can easily reset it if anything goes wrong.

For more information on the project-creation process, please see our [Adding a Project](https://github.com/joshwcomeau/guppy/blob/master/docs/adding-a-project.md) doc.

## Managing your project

After creating or importing a project, you'll be presented with the project screen. Everything you need to manage your project exists on this page!

It's split up into 3 modules: **Development Server**, **Tasks**, and **Dependencies**.

### Development Server

In the past, web development could be as simple as modifying an "index.html" file on your computer, and then opening that file in a web browser to see what it looks like.

As the web moved from simple documents to complex applications, this stopped being a viable way to work. Today's web applications are rich and dynamic, and require a more complicated setup.

The solution is to run a local development server. It's called a server because it serves content to you: in the same way that Google has a web server that serves up some HTML when you go to google.com, your local development server will handle retrieving and serving the content when you go to its URL.

Development servers do a bunch of other work behind the scenes as well - for example, they watch the files in the project, and when the files change, the page auto-refreshes!

Also, in the past, you had to be very mindful about the fact that your code would run in many different browsers. Each browser has its own Javascript engine, with its own quirks and supported/unsupported language features. The development server will compile the code you write into a form that all common browsers can understand, so it's far less of an issue.

A few years ago, creating and managing a local development environment was a big hassle. Nowadays, it's even easier than the oldschool "open an index.html file" approach, and comes with a bunch of additional benefits.

To turn the development server on, click the toggle in the top-right of the module:

![Development server module](https://github.com/joshwcomeau/guppy/raw/master/docs/images/dev-server-toggle.png)

You'll see two things happen:

- The "Idle" status indicator on the left switches to "running", and the light turns green. The status indicator is a great way to quickly check what's going on: because it compiles your code, it knows when it hits an error, and can alert you to the fact that things aren't working properly.

- The blue box on the right starts filling with output. This can often be overwhelming, as it produces a lot of information that often isn't super relevant, but it also includes helpful info about errors and warnings.

> The output you see is meant to be displayed in a terminal, and so sometimes the info isn't relevant for working with Guppy. For example, when a Gatsby project successfully builds, it suggests that you can run "gatsby build" to produce a production bundle. In Guppy, this is tackled under **Tasks** below.
>
> In future versions of Guppy, we hope to show curated, beginner-friendly output in this space instead.

At first, **this is the only module you need to worry about**. After you've started a development server, feel free to tab over to your code editor and start building your product! You can learn more about the other modules later.

### Tasks

As you continue to work on your project, you'll notice that there are some chores that need doing. For example, once your project is ready to be uploaded and served on the internet, you need a way to create the files needed for this!

The tasks are based on the project type (Vanilla React and Gatsby projects have slightly different tasks). Each task gets its own row, which tells you:

- The name of the task (eg. `build`)
- A quick description of the task
- The task status
- A button to view more information about the task
- A toggle to start (or interrupt) the task

Run a task by clicking the toggle on the right side of each task:

![Development server module](https://github.com/joshwcomeau/guppy/raw/master/docs/images/task-row-toggle.png)

You can also run tasks from within the "View Details" panel:

![Development server module](https://github.com/joshwcomeau/guppy/raw/master/docs/images/task-details-toggle.png)

When you toggle a task on, the status will switch to "pending". If you're curious to see what it's doing, you can click "View Details" to get a terminal output screen, much like the one the Development Server module has.

When the task completes, the status will switch to "success" or "error", depending on whether the task ran into any problems. The "View Details" button is a great way to learn more about why a task might have failed.

### Dependencies

As web developers, we often find that our projects have the same problems that need to be solved. React doesn't come with a built-in solution for routing, for example, and it would be extremely tedious if we all had to build our own routing solutions, for every project we start!

Happily, we can save a ton of time and energy by using solutions that other developers have built.

In the javascript community, these solutions are called _packages_. They're distributed through the Node Package Manager (NPM). Your project can _depend_ on packages, which will make those solutions available to you in your code.

This third module lets you add, update, or remove packages that other folks have written.

> You'll see that there are already a few installed. These are crucial dependencies for running the project type you've selected, and it's prudent not to try and remove them.

Let's say you've realized that your applicaton needs a slider component, to select a value. It would take a fair bit of time to build one of these yourself, so it might make sense to see if there's already one available in the community!

Click the "Add New Dependency" button to search for a new dependency:

![Development server module](https://github.com/joshwcomeau/guppy/raw/master/docs/images/add-dep-button.png)

If you search for "React slider", you'll see a few options come up:

![Development server module](https://github.com/joshwcomeau/guppy/raw/master/docs/images/search-deps.png)

You can click the names of these packages to learn more about them, and decide if they solve the problem you need. You can also use the data included in the search results to inform your decision:

- How many downloads does it have? Popular packages tend to be safer bets, since there are more people using them, and likely more people helping to build them
- How long ago was it last updated? Unmaintained packages that haven't been updated in months/years aren't as safe as recently-updated ones
- What software license does it provide? The software license details how it can be used. MIT license is the gold standard, and it might be worth ignoring solutions that don't use it.

If you click the "Add to Project" button beside each search result, that package will be added as a dependency to your project. You'll be able to use it in your project the same way that you currently use React:

```js
import React from 'react';
import Slider from 'rc-slider';
```

> While a dependency is installing, you won't be able to do any other dependency management. This shouldn't take more than a few seconds, but it's still kind of a bummer if you have a lot of dependencies to add. We're working on streamlining this process.

In the main module, you can browse through the list of installed dependencies. If the dependency is out-of-date, you can click the "Update" button to update it to the newest version.

You can delete dependencies in the Danger Zone (🔥).

You can update dependencies to their latest version in 1 click by clicking "Update", next to the version number.

> It is not currently possible to downgrade a dependency, or to select a specific dependency. This'll be added in the future. For now, you'll need to use a terminal to do this. Learn more at the [npm docs](https://docs.npmjs.com/cli/install)

### Editing your project

Guppy creates a folder inside of your home directory called `guppy-projects`. When you create a new project with Guppy, it lives in a folder inside of `guppy-projects`. Find your project there, and edit away!

## Modifying and Deleting Projects

In future versions, we hope to make it much easier to tweak the configuration of your projects.

For now, projects can't really be modified directly. If you want to change the project's name, for example, you'll have to do this by modifying your project's `package.json` in your code editor (look for the section under "guppy", where you can change its name, icon, or color).

Projects can be removed from Guppy by going to Edit -> Delete Project, and confirming the prompt. Note that this won't actually delete the code on your computer, it just makes it so that Guppy is no longer the custodian for this work.

> Removing a project from guppy won't remove the "guppy" entry in its package.json. Feel free to remove this yourself as well.
