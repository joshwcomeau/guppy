// @flow
import asyncMap from 'async/map';

import { pick } from '../utils';
import type { ProjectInternal } from '../types';

const fs = window.require('fs');
const path = window.require('path');
const os = window.require('os');

// Guppy projects are stored in a shared parent directory.
// The default path for this directory is `~/guppy-projects`.
// TODO: Make this path overrideable?
// TODO: Windows?
const DEFAULT_PATH = `${os.homedir()}/guppy-projects`;

/**
 * Find all the projects managed by Guppy, and read their package.jsons.
 * NOTE: Currently only supports projects in DEFAULT_PATH. We should fix that.
 */
export function loadGuppyProjects(fromPath: string = DEFAULT_PATH) {
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
        if (err) {
          return reject(err);
        }

        // TODO: It's possible the projects on disk may not have been created
        // with Guppy. In this case, I'll need to infer the guppy ID from the
        // `packageJson.name` field

        // The results will be an array of package.jsons.
        // I want a database-style map.
        const projects = results.reduce(
          (projectsMap, project) => ({
            ...projectsMap,
            [project.guppy.id]: project,
          }),
          {}
        );

        resolve(projects);
      }
    );
  });
}

/**
 * Find a specific project's dependency information.
 * While all guppy projects have basic info already loaded in via the project's
 * package.json, it would be nice to learn more about the dependencies.
 *
 * We want information such as:
 *   - The specific version number installed (not just the acceptable range)
 *   - The dependency's description
 *   - The dependency's authors or maintainers
 *   - Links to homepage / git repo
 *   - Software license (probably not super important, -shrugs-)
 *
 * This method finds all of the `package.json` files for each of the
 * dependencies, and parses them.
 *
 * NOTE: I wonder how this would perform on a project with 100+ top-level
 * dependencies... might need to set up a streaming service that can communicate
 * loading status if it takes more than a few hundred ms.
 *
 * TODO: Also need to set up non-default paths for projects here.
 */
export function loadProjectDependencies(
  project: ProjectInternal,
  fromPath: string = DEFAULT_PATH
) {
  const { readdirSync, statSync } = fs;

  let dependencies;

  const dependencyNames = Object.keys(project.dependencies);

  return new Promise((resolve, reject) => {
    // Each project in a Guppy directory should have a package.json.
    // We'll read all the project info we need from this file.
    asyncMap(
      dependencyNames,
      function(dependencyName, callback) {
        return fs.readFile(
          `${fromPath}/${
            project.guppy.id
          }/node_modules/${dependencyName}/package.json`,
          'utf8',
          (err, data) => {
            if (err) {
              if (err.code === 'ENOENT') {
                // Interestingly, freshly-ejected packages have `babel-loader`
                // as a dependency, but no such NPM module installed.
                // Maybe it isn't a safe bet to assume that dependency name
                // always matches folder name inside `node_modules`?
                return callback(null, null);
              }

              return callback(err);
            }

            const packageJson = JSON.parse(data);

            const packageJsonSubset = pick(packageJson, [
              'name',
              'description',
              'keywords',
              'version',
              'homepage',
              'license',
              'repository',
            ]);

            return callback(null, packageJsonSubset);
          }
        );
      },
      (err, results) => {
        if (err) {
          return reject(err);
        }

        // Filter out any unloaded dependencies
        const filteredResults = results.filter(result => result);

        // The results will be an array of package.jsons.
        // I want a database-style map.
        const dependencies = filteredResults.reduce(
          (dependenciesMap, dependency) => ({
            ...dependenciesMap,
            [dependency.name]: dependency,
          }),
          {}
        );

        resolve(dependencies);
      }
    );
  });
}
