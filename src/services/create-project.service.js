import slug from 'slug';

const fs = window.require('fs');
const os = window.require('os');
const childProcess = window.require('child_process');

/**
 * This service manages the creation of a new project.
 * It is in charge of interfacing with the host machine to:
 *   1) Figure out if it needs to install any dependencies
 *      I'm gonna assume that installing Guppy also installs Node.
 *
 *   2) Generate the project directory, if it doesn't already exist
 *
 *   3) Using create-react-app (or the Vue CLI) to generate a new project
 *
 *   4) Add some custom info to package.json to make it a distinct Guppy project
 *      (probably just the 'name' so that we can avoid slug-only names?)
 *
 * TODO: Ew callbacks. I can't just use a promise, though, since it needs to
 * fire multiple times, to handle updates mid-creation. Maybe an observable?
 */
export default (
  { projectName, projectType, projectIcon },
  onStatusUpdate,
  onError,
  onComplete
) => {
  // When the app first loads, we need to get an index of existing projects.
  // The default path for projects is `~/guppy-projects`.
  const parentPath = `${os.homedir()}/guppy-projects`;

  // Create the projects directory, if this is the first time creating a
  // project.
  if (!fs.existsSync(parentPath)) {
    fs.mkdirSync(parentPath);
  }

  onStatusUpdate('Created parent directory');

  const id = slug(
    'Hello World' + Math.round(Math.random() * 10000)
  ).toLowerCase(); // TEMP

  console.log({ id });

  const path = `${parentPath}/${id}`;

  // TODO: support Gatsby
  const instruction = 'npx';
  const args = ['create-react-app', path];

  const process = childProcess.spawn(instruction, args);

  process.stdout.on('data', onStatusUpdate);
  process.stderr.on('data', onError);

  process.on('close', onComplete);
};
