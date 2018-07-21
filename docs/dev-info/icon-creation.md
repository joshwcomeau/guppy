# Icon Creation

Application icons for Guppy projects are finicky; each platform has its own format.

Happily, [Electron Icon Maker](https://github.com/jaretburkett/electron-icon-maker) solves a lot of it for us!

Here's the steps that were taken the last time our icon needed updating:

```
npm i -g electron-icon-maker
electron-icon-maker -i /path/to/logo.png -o ./src/assets/icons
```

Additionally, a few small tweaks are necessary:

- by default, the tool names Windows/Mac icon files icon.ico and icon.icns, respectively. We use logo.ico and logo.icns, so make sure to rename to match this convention so that bundling works correctly.
- for whatever reason, the tool does not create png/96x96.png, so you'll still have to generate that manually

If we find ourselves needing to create icons a lot, for some reason, we could remove these edge-cases by using the default name of `icon.x`, as well as not including a 96x96 icon.
