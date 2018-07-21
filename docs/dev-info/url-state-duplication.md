# URL State Duplication

> This is a document I wrote mainly for myself, to remind me why I have a somewhat unorthodox setup to manage the "selected project" state.

In most apps, the URL is the state of truth for the ID of a thing.

If you're on /projects/123, the projectID is 123, and the URL is the state of truth. Redux will hold the map of objects, but you'll have to select the one with `id: 123` from that map, based on the URL.

Generally what you want is to avoid duplicating that state in the redux store. Redux works best as a single source of truth, and it can be fragile to try and link Redux and URL state.

And yet, that's exactly what I've done. 🤔

### Why I can't just use URL state

This is a desktop app. When it loads, I want to redirect users to the project page they were at last time they opened it.

I _have_ to store the selected project ID in redux, so that I can persist it in localStorage, and rehydrate the next time they open the app.

Also, there may be times where I want to access the selected project ID from a different page altogether. I'd like to have the flexibility to do that if/when the time comes.

### Why I can't just use Redux state

There's still value in having route-specific projects. Without it, I'd have to create my own routing solution for navigating between projects, and I want to be able to link to specific project pages from anywhere in the app without worrying about dispatching a redux action. This project uses React Router and it would be weird to not have project pages be proper URLs.

### What I've done to mitigate the dangers of duplicating this source of truth

In `App`, I register a listener on the `history` object. Whenever any route in the page changes, I check to see if it's a navigation to a product page, and dispatch an action to update the Redux store with the project ID from the URL.

In terms of working within the app, we should treat Redux as the source of truth.

In effect, the URL is the _action_ that sets the state. Eric Vinceti has a talk where he talks about how URLs are actions, not state. That model seems to work pretty well here.
