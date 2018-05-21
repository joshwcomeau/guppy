import {
  CREATE_PROJECT_START,
  createProjectUpdateStatus,
  createProjectFinish,
} from '../actions';

const fs = window.require('fs');
const path = window.require('path');
const os = window.require('os');
const childProcess = window.require('child_process');

export default () => store => next => action => {
  if (action.type === CREATE_PROJECT) {
    const { id, name } = action.project;

    // When the app first loads, we need to get an index of existing projects.
    // The default path for projects is `~/guppy`.
    const projectsPath = `${os.homedir()}/guppy`;

    // Create the projects directory, if this is the first time creating a
    // project.
    if (!fs.existsSync(projectsPath)) {
      fs.mkdirSync(projectsPath);
    }

    const path = `${projectsPath}/${name}`;
    const cra = childProcess.spawn('create-react-app', [path]);

    cra.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
    });

    cra.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
    });

    cra.on('close', code => {
      console.log(`child process exited with code ${code}`);
    });
  }

  return next(action);
};
