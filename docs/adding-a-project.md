# Getting Started with Guppy

> Guppy is a companion tool that aims to totally replace the terminal, so that newcomers to the field aren't burdened with a whole other skillset they need to learn before they can get started building cool things.
>
> It's currently in Alpha, which means that we're still a long way from fully realizing that dream. You may run into bugs, and it's only compatible with certain types of projects, and certain operating systems.
>
> Apologies in advance for any trouble you run into. Please leave feedback!

## Installation

Read the [Installation Guide](todo) to get the application downloaded and running.

## Your First Project

Guppy works on a per-project basis: each project has its own area in Guppy's interface. So, the first thing we need is a project to work on!

The intro screen presents two options: "Create a new web application" and "import an existing project".

### Creating a New Project

Choose this option if you want to start a brand new project.

The wizard will guide you through the process, but this guide will add some additional detail on the fields you'll need to fill out.

#### Project Name

Your project name can be whatever you want! Special characters are cool. So are emoji 🎉 give it whatever name you want.

There is currently no way to change the project name from within Guppy, but you can always [modify the package.json](todo) to use a different name.

#### Project Type

There are currently 2 types of supported projects: Vanilla React, and Gatsby.

**Vanilla React** is a minimal yet fully-ready-to-go solution for getting started with React development. It uses [create-react-app]() behind the scenes, a tool built by Facebook, and has become the standard way that new applications are created, for beginners and experienced developers alike.

**Gatsby** is an amazing project that strives to be a static site generator, somewhat like Jekyll. It does a bunch of powerful performance optimizations, so the site you build is lightning-quick. It also has a vibrant community behind it! If you're building a static site (eg. a blog, something informational), it can be a huge productivity boost.

> NOTE: Gatsby has a wide array of "starters" for different usecases, but Guppy doesn't support them yet. We'll add this in a future update, but for now it might be best to create the product through a terminal and then import it into Guppy. See [their official docs](https://www.gatsbyjs.org/tutorial/part-one/#check-your-development-environment) for more information.

Ultimately, the project type you choose depends on your goals. Some thoughts:

- Are you looking to become a professional web developer, and want to learn the craft? Choose "Vanilla React", so that you can learn more about creating React apps from scratch

- Are you looking to build a complex app, like a social network or an AirBnb clone? You'll likely want to go with "Vanilla React", as this is a bit outside the scope of what Gatsby was created for

- Are you looking to build a blog, landing page, or other content-based product? "Gatsby" can save you a ton of time, and is likely the best choice.

####
