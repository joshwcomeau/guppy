import React, { Component } from 'react';
import IntroScreen from '../IntroScreen';
const fs = window.require('fs');
const path = window.require('path');
const os = window.require('os');

class Home extends Component {
  componentDidMount() {
    // When the app first loads, we need to get an index of existing projects.
    // The default path for projects is `~/guppy`.
    const projectsPath = `${os.homedir()}/guppy`;

    // TODO: Make this path overrideable?
    // TODO: Windows?
    const { readdirSync, statSync } = fs;

    try {
      this.projectDirectories = readdirSync(projectsPath).filter(f =>
        statSync(path.join(projectsPath, f)).isDirectory()
      );
    } catch (e) {
      // If the projects path doesn't exist, an error is thrown.
      // This just means that we haven't yet created it though!
      this.projectDirectories = [];
    }
  }

  render() {
    return <IntroScreen />;
  }
}

export default Home;
