// @flow
import asyncMap from 'async/map';

import { pick } from '../utils';
import type { ProjectInternal } from '../types';

const fs = window.require('fs');
const prettier = window.require('prettier');

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
  const prettyPrintedPackageJson = prettier.format(JSON.stringify(json), {
    parser: 'json',
  });

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
export function loadGuppyProjects(paths: Array<string>) {
  return new Promise((resolve, reject) => {
    // Each project in a Guppy directory should have a package.json.
    // We'll read all the project info we need from this file.
    // TODO: Maybe use asyncReduce to handle the output format in 1 neat step?
    asyncMap(
      paths,
      function(path, callback) {
        loadPackageJson(path).then(json => callback(null, json));
        // .catch(callback);
      },
      (err, results) => {
        if (err) {
          return reject(err);
        }

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
  const dependencyNames = Object.keys(project.dependencies);

  return new Promise((resolve, reject) => {
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
  });
}
