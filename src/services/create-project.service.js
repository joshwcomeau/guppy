// @flow
import slug from 'slug';
import random from 'random-seed';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import uuid from 'uuid/v1';
import projectConfigs from '../config/project-types';
import { processLogger } from './process-logger.service';
import { substituteConfigVariables } from './config-variables.service';

import { RAW_COLORS } from '../constants';

import {
  formatCommandForPlatform,
  getBaseProjectEnvironment,
} from './platform.service';

import { FAKE_CRA_PROJECT } from './create-project.fixtures';

import type { ProjectType, ProjectInternal } from '../types';

// Change this boolean flag to skip project creation.
// Useful when working on the flow, to avoid having to wait for a real project
// to be created every time.
export const DISABLE = {
  status: false, // change status to true here to enable fakeProject
};

type ProjectInfo = {
  projectName: string,
  projectType: ProjectType,
  projectIcon: string,
  projectStarter: ?string,
};

type BuildOptions = {
  projectStarter: ?string, // used for gatsby
};

export const checkIfProjectExists = (dir: string, projectName: string) =>
  fs.existsSync(path.join(dir, projectName));

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
  { projectName, projectType, projectIcon, projectStarter }: ProjectInfo,
  projectHomePath: string,
  onStatusUpdate: (update: string) => void,
  onError: (err: string) => void,
  onComplete: (packageJson: ProjectInternal) => void
) => {
  if (DISABLE.status) {
    onComplete(FAKE_CRA_PROJECT);
    return;
  }

  // Create the projects directory, if this is the first time creating a
  // project.
  if (!fs.existsSync(projectHomePath)) {
    fs.mkdirSync(projectHomePath);
  }

  onStatusUpdate('Created parent directory');

  const projectDirectoryName = getProjectNameSlug(projectName);

  // For Windows Support
  // To support cross platform with slashes and escapes
  const projectPath = path.join(projectHomePath, projectDirectoryName);

  // Add starter for Gatsby. Check is optional as it can't be entered in the build steps for other project types.
  const buildOptions =
    projectType === 'gatsby'
      ? {
          projectStarter,
        }
      : null;

  const [instruction, ...args] = getBuildInstructions(
    projectType,
    projectPath,
    buildOptions
  );

  const process = childProcess.spawn(instruction, args, {
    env: getBaseProjectEnvironment(projectPath),
    shell: true,
  });

  processLogger(process, 'CREATE_PROJECT');

  process.stdout.on('data', onStatusUpdate);
  process.stderr.on('data', onError);

  // TODO: This code could be a lot nicer.
  // Maybe promisify some of these callback APIs to avoid callback hell?
  process.on('close', () => {
    onStatusUpdate('Dependencies installed');

    fs.readFile(
      path.join(projectPath, 'package.json'),
      'utf8',
      (readErr, data) => {
        if (readErr) {
          return console.error(readErr);
        }

        const packageJson = JSON.parse(data);

        packageJson.guppy = {
          id: uuid(),
          name: projectName,
          type: projectType,
          icon: projectIcon,
          // The project color is currently unused for freshly-created projects,
          // however it's used for imported non-guppy projects, and it seems like
          // a good thing to be consistent about (may be useful in other ways).
          color: getColorForProject(projectName),
          createdAt: Date.now(),
        };

        // Gatsby specific fix - the command 'npx gatsby new ...' always sets the
        // name key in package.json to `gatsby-starter-default`. Overwrite it so
        // project is named correctly.
        // if (projectType === 'gatsby') {
        //   packageJson.name = projectDirectoryName;
        // }
        // Todo: Check if always setting the name is a problem --> we don't want project-type specific stuff here
        packageJson.name = projectDirectoryName;

        const prettyPrintedPackageJson = JSON.stringify(packageJson, null, 2);

        fs.writeFile(
          path.join(projectPath, 'package.json'),
          prettyPrintedPackageJson,
          err => {
            if (err) {
              return console.error(err);
            }
            onComplete(packageJson);
          }
        );

        if (projectType === 'create-react-app') {
          try {
            // CRA 2.0 immediately initializes a git repo upon project creation
            // so we need to immediately commit the Guppy updates to package.json
            childProcess.exec(
              'git add package.json && git commit -m "Add Guppy data to package.json"',
              {
                cwd: projectPath,
              }
            );
          } catch (err) {
            // Ignore
          }
        }
      }
    );
  });
};

//
//
// Helpers
//

export const getProjectNameSlug = (projectName: string) =>
  slug(projectName).toLowerCase();

// Exported so that getColorForProject can be tested
export const possibleProjectColors = [
  RAW_COLORS.hotPink[700],
  RAW_COLORS.pink[700],
  RAW_COLORS.red[700],
  RAW_COLORS.orange[700],
  RAW_COLORS.green[700],
  RAW_COLORS.teal[700],
  RAW_COLORS.violet[700],
  RAW_COLORS.purple[700],
];

export const getColorForProject = (projectName: string) => {
  const projectColorIndex = random
    .create(projectName)
    .range(possibleProjectColors.length);

  return possibleProjectColors[projectColorIndex];
};

export const getBuildInstructions = (
  projectType: ProjectType,
  projectPath: string,
  options: ?BuildOptions
) => {
  // For Windows Support
  // Windows tries to run command as a script rather than on a cmd
  // To force it we add *.cmd to the commands
  const command = formatCommandForPlatform('npx');
  if (!projectConfigs.hasOwnProperty(projectType)) {
    throw new Error('Unrecognized project type: ' + projectType);
  }

  const createCommand: Object = substituteConfigVariables(
    projectConfigs[projectType].create,
    {
      $projectPath: projectPath,
      $projectStarter: options && options.projectStarter,
    }
  );

  return [command, ...createCommand.args];
};
