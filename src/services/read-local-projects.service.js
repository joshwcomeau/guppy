import asyncMap from 'async/map';

const fs = window.require('fs');
const path = window.require('path');
const os = window.require('os');

// Guppy projects are stored in a shared parent directory.
// The default path for this directory is `~/guppy`.
// TODO: Make this path overrideable?
// TODO: Windows?
const DEFAULT_PATH = `${os.homedir()}/guppy-projects`;

export default function readLocalProjectsFromDisk(fromPath = DEFAULT_PATH) {
  // TODO: Make this path overrideable?
  // TODO: Windows?
  const { readdirSync, statSync } = fs;

  let projects;

  try {
    projects = readdirSync(fromPath).filter(f =>
      statSync(path.join(fromPath, f)).isDirectory()
    );
  } catch (e) {
    // If the projects path doesn't exist, an error is thrown.
    // This just means that we haven't yet created it though!
    projects = [];
  }

  return new Promise((resolve, reject) => {
    // Each project in a Guppy directory should have a package.json.
    // We'll read all the project info we need from this file.
    asyncMap(
      projects,
      function(projectDirName, callback) {
        return fs.readFile(
          `${fromPath}/${projectDirName}/package.json`,
          'utf8',
          (err, data) => {
            if (err) {
              return callback(err);
            }

            const packageJson = JSON.parse(data);

            return callback(null, packageJson);
          }
        );
      },
      (err, results) => {
        console.log(err, results);
        if (err) {
          return reject(err);
        }

        // The results will be an array of package.jsons.
        // I want a database-style map.
        const projects = results.reduce(
          (projectsMap, project) => ({
            ...projectsMap,
            [project.name]: project,
          }),
          {}
        );

        resolve(projects);
      }
    );
  });
}
