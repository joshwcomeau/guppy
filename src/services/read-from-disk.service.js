// @flow
import asyncMap from 'async/map';
import * as fs from 'fs';
import * as path from 'path';

import { pick } from '../utils';

import type {
  QueuedDependency,
  DependencyLocation,
  Dependency,
  ProjectInternal,
} from '../types';

/**
 * Load a project's package.json
 */
export const loadPackageJson = (projectPath: string) => {
  return new Promise<any>((resolve, reject) => {
    return fs.readFile(
      path.join(projectPath, 'package.json'),
      'utf8',
      (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(JSON.parse(data));
      }
    );
  });
};

/**
 * Update a project's package.json.
 */
export const writePackageJson = (projectPath: string, json: any) => {
  const prettyPrintedPackageJson = JSON.stringify(json, null, 2);

  return new Promise<any>((resolve, reject) => {
    fs.writeFile(
      path.join(projectPath, 'package.json'),
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
export const loadGuppyProjects = (projectPaths: Array<string>) =>
  new Promise<{ [projectId: string]: ProjectInternal }>((resolve, reject) => {
    // Each project in a Guppy directory should have a package.json.
    // We'll read all the project info we need from this file.
    // TODO: Maybe use asyncReduce to handle the output format in 1 neat step?
    asyncMap(
      projectPaths,
      function(projectPath, callback) {
        loadPackageJson(projectPath)
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
        const validProjects = results.filter(
          project => !!project && project.guppy
        );

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
  dependencyName: string,
  dependencyLocation: DependencyLocation = 'dependencies'
) {
  // prettier-ignore
  const dependencyPath = path.join(projectPath, 'node_modules', dependencyName, 'package.json');

  return new Promise<Dependency | null>((resolve, reject) => {
    fs.readFile(dependencyPath, 'utf8', (err, data) => {
      if (err) {
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
        location: dependencyLocation,
      };

      // $FlowFixMe
      return resolve(dependency);
    });
  });
}

/**
 * Wrapper around `loadProjectDependency` that fetches all dependencies from
 * an array.
 */
export function loadProjectDependencies(
  projectPath: string,
  dependencies: Array<QueuedDependency>
) {
  return new Promise<Array<Dependency>>((resolve, reject) => {
    asyncMap(
      dependencies,
      function({ name, location }, callback) {
        loadProjectDependency(projectPath, name, location)
          .then(dependency => callback(null, dependency))
          .catch(callback);
      },
      (err, results) => {
        if (err) {
          return reject(err);
        }

        // Filter out any unloaded dependencies
        const filteredResults = results.filter(result => result);

        resolve(filteredResults);
      }
    );
  });
}

/**
 * Wrapper around `loadProjectDependency` that fetches all dependencies for
 * a specific project.
 *
 * NOTE: I wonder how this would perform on a project with 100+ top-level
 * dependencies... might need to set up a streaming service that can communicate
 * loading status if it takes more than a few hundred ms.
 */
export function loadAllProjectDependencies(projectPath: string) {
  // Get a fresh copy of the dependencies from the project's package.json
  return loadPackageJson(projectPath).then(
    packageJson =>
      new Promise((resolve, reject) => {
        // Check for existence of both dependencies and devDependencies
        // We can reasonably assume all projects have dependencies
        // but some may not have devDependencies
        const deps = Object.keys(packageJson.dependencies);
        const devDeps = Object.keys(packageJson.devDependencies || {});
        const dependencies = [...deps, ...devDeps].map(name => ({
          name,
          location: devDeps.includes(name) ? 'devDependencies' : 'dependencies',
        }));

        loadProjectDependencies(projectPath, dependencies)
          .then(dependenciesFromPackageJson => {
            // The results will be an array of package.jsons.
            // I want a database-style map.
            const dependenciesByName = dependenciesFromPackageJson.reduce(
              (dependenciesMap, dependency) => ({
                ...dependenciesMap,
                [dependency.name]: dependency,
              }),
              {}
            );

            resolve(dependenciesByName);
          })
          .catch(err => {
            reject(err);
          });
      })
  );
}
