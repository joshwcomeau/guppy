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
 *   - Software license
 *
 * This method reads the package.json for a specific dependency, in a specific
 * project.
 *
 * TODO: Also need to set up non-default paths for projects here.
 */
export function loadProjectDependency(
  projectId: string,
  dependencyName: string,
  fromPath: string = DEFAULT_PATH
) {
  // prettier-ignore
  const dependencyPath =
    `${fromPath}/${projectId}/node_modules/${dependencyName}/package.json`;

  return new Promise((resolve, reject) => {
    fs.readFile(dependencyPath, 'utf8', (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // Interestingly, freshly-ejected packages have `babel-loader`
          // as a dependency, but no such NPM module installed o_O.
          // Maybe it isn't a safe bet to assume that dependency name
          // always matches folder name inside `node_modules`?
          // TODO: For now I'm just going to ignore these cases, but I should
          // really figure this out!
          return resolve(null);
        }

        return reject(err);
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

      const dependency = {
        ...packageJsonSubset,
        status: 'idle',
      };

      return resolve(dependency);
    });
  });
}

/**
 * Wrapper around `loadProjectDependency` that fetches all dependencies for
 * a specific project.
 *
 * NOTE: I wonder how this would perform on a project with 100+ top-level
 * dependencies... might need to set up a streaming service that can communicate
 * loading status if it takes more than a few hundred ms.
 *
 * TODO: Handle non-default paths
 */
export function loadAllProjectDependencies(
  project: ProjectInternal,
  fromPath: string = DEFAULT_PATH
) {
  const dependencyNames = Object.keys(project.dependencies);

  return new Promise((resolve, reject) => {
    // Each project in a Guppy directory should have a package.json.
    // We'll read all the project info we need from this file.
    asyncMap(
      dependencyNames,
      function(dependencyName, callback) {
        const projectId = project.guppy.id;

        loadProjectDependency(projectId, dependencyName, fromPath)
          .then(dependency => callback(null, dependency))
          .catch(callback);
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
