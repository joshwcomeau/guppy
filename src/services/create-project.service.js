// @flow
import slug from 'slug';
import type { ProjectType } from '../types';

const prettier = window.require('prettier');

const fs = window.require('fs');
const os = window.require('os');
const childProcess = window.require('child_process');

const DISABLE = false;

type ProjectInfo = {
  projectName: string,
  projectType: ProjectType,
  projectIcon: string,
};

/**
 * This service manages the creation of a new project.
 * It is in charge of interfacing with the host machine to:
 *   1) Figure out if it needs to install any dependencies
 *      I'm gonna assume that installing Guppy also installs Node.
 *
 *   2) Generate the project directory, if it doesn't already exist
 *
 *   3) Using create-react-app (or Gatsby) to generate a new project
 *
 *   4) Add some custom info to package.json to make it a distinct Guppy project
 *      (probably just the 'name' so that we can avoid slug-only names?)
 *
 * TODO: Ew callbacks. I can't just use a promise, though, since it needs to
 * fire multiple times, to handle updates mid-creation. Maybe an observable?
 */
export default (
  { projectName, projectType, projectIcon }: ProjectInfo,
  onStatusUpdate: (update: string) => void,
  onError: (err: string) => void,
  onComplete: (packageJson: any) => void
) => {
  if (DISABLE) {
    const fakeProject = {
      name: 'haidddd',
      version: '0.1.0',
      private: true,
      dependencies: {
        react: '^16.4.0',
        'react-dom': '^16.4.0',
        'react-scripts': '1.1.4',
      },
      scripts: {
        start: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test --env=jsdom',
        eject: 'react-scripts eject',
      },
      guppy: {
        id: 'haidddd',
        name: 'Haidddd',
        icon: '/static/media/icon_blueorange.174c0078.jpg',
      },
    };

    onComplete(fakeProject);
    return;
  }

  // When the app first loads, we need to get an index of existing projects.
  // The default path for projects is `~/guppy-projects`.
  const parentPath = `${os.homedir()}/guppy-projects`;

  // Create the projects directory, if this is the first time creating a
  // project.
  if (!fs.existsSync(parentPath)) {
    fs.mkdirSync(parentPath);
  }

  onStatusUpdate('Created parent directory');

  const id = slug(projectName).toLowerCase();

  const path = `${parentPath}/${id}`;

  // TODO: support Gatsby
  const instruction = 'npx';
  const args = ['create-react-app', path];

  const process = childProcess.spawn(instruction, args);

  process.stdout.on('data', onStatusUpdate);
  process.stderr.on('data', onError);

  // TODO: This code could be a lot nicer.
  // Maybe promisify some of these callback APIs to avoid callback hell?
  process.on('close', () => {
    onStatusUpdate('Dependencies installed');

    fs.readFile(`${path}/package.json`, 'utf8', (err, data) => {
      if (err) {
        return console.error(err);
      }

      const packageJson = JSON.parse(data);

      packageJson.guppy = {
        id,
        name: projectName,
        type: projectType,
        icon: projectIcon,
      };

      const prettyPrintedPackageJson = prettier.format(
        JSON.stringify(packageJson),
        { parser: 'json' }
      );

      fs.writeFile(`${path}/package.json`, prettyPrintedPackageJson, err => {
        if (err) {
          return console.error(err);
        }
        onComplete(packageJson);
      });
    });
  });
};
