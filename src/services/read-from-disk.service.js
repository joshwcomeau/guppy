// @flow
import asyncMap from 'async/map';

import { pick } from '../utils';
import { getDefaultParentPath } from '../reducers/paths.reducer';

import type { ProjectInternal } from '../types';

const fs = window.require('fs');
const path = window.require('path');

const DEFAULT_PARENT_PATH = getDefaultParentPath();

/**
 * Load a project's package.json
 */
export const loadPackageJson = (path: string) => {
  return new Promise((resolve, reject) => {
    return fs.readFile(`${path}/package.json`, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(JSON.parse(data));
    });
  });
};

/**
 * Update a project's package.json.
 */
export const writePackageJson = (projectPath: string, json: any) => {
  const prettyPrintedPackageJson = JSON.stringify(json, null, 2);

  return new Promise((resolve, reject) => {
    fs.writeFile(
      `${projectPath}/package.json`,
      prettyPrintedPackageJson,
      err => {
        if (err) {
          return reject(err);
        }

        resolve(json);
      }
    );
  });
};

/**
 * Given an array of paths, load each one as a distinct Guppy project.
 * Parses the `package.json` to find Guppy's saved info.
 */
export function loadGuppyProjects(projectPathsInput: Array<string>) {
  const { readdirSync, statSync } = fs;

  // Create a clone of paths so we aren't mutating the provided array.
  const projectPaths = [...projectPathsInput];

  // In addition to the paths recovered from localStorage, we also want to
  // parse the default parent path, to collect any local projects that Guppy
  // doesn't know about
  // (this is mainly useful for dev, so that I can clear localStorage to
  // emulate a clean slate, but might also be useful for users who want to
  // create projects outside of Guppy but have them managed internally)
  try {
    readdirSync(DEFAULT_PARENT_PATH).forEach(f => {
      const projectPath = path.join(DEFAULT_PARENT_PATH, f);
      const isDirectory = statSync(projectPath).isDirectory();

      if (isDirectory && !projectPaths.includes(projectPath)) {
        projectPaths.push(projectPath);
      }
    });
  } catch (e) {
    // If the default parent path doesn't exist, it'll throw an error.
    // This is fine, though; it just means that we have
  }

  return new Promise((resolve, reject) => {
    // Each project in a Guppy directory should have a package.json.
    // We'll read all the project info we need from this file.
    // TODO: Maybe use asyncReduce to handle the output format in 1 neat step?
    asyncMap(
      projectPaths,
      function(path, callback) {
        loadPackageJson(path)
          .then(json => callback(null, json))
          .catch(err =>
            // If the package.json couldn't be loaded, this likely means the
            // project was deleted, and our cache is out-of-date.
            // This isn't truly an error, it just means we need to ignore this
            // project.
            // TODO: Handle other errors!
            callback(null, null)
          );
      },
      (err, results) => {
        // It's possible that the project was deleted since Guppy last checked.
        // Ignore any `null` results.
        // If the project was deleted, an exception is caught, and so `err`
        // might not be a true error.
        // TODO: Handle true errors tho!
        if (!results) {
          return reject(err);
        }

        // a `null` result means the project couldn't be loaded, probably
        // because it was deleted.
        // TODO: Maybe a warning prompt should be raised if this is the case,
        // so that users don't wonder where the project went?
        const validProjects = results.filter(project => !!project);

        // The results will be an array of package.jsons.
        // I want a database-style map.
        const projects = validProjects.reduce(
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
 */
export function loadProjectDependency(
  projectPath: string,
  dependencyName: string
) {
  // prettier-ignore
  const dependencyPath =
    `${projectPath}/node_modules/${dependencyName}/package.json`;

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
 * TODO: support devDependencies
 */
export function loadAllProjectDependencies(
  project: ProjectInternal,
  projectPath: string
) {
  // Get a fresh copy of the dependencies from the project's package.json
  return loadPackageJson(projectPath).then(
    packageJson =>
      new Promise((resolve, reject) => {
        const dependencyNames = Object.keys(packageJson.dependencies);

        // Each project in a Guppy directory should have a package.json.
        // We'll read all the project info we need from this file.
        asyncMap(
          dependencyNames,
          function(dependencyName, callback) {
            loadProjectDependency(projectPath, dependencyName)
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
      })
  );
}
