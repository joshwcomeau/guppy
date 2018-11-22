// @flow
import { substituteConfigVariables } from './config-variables.service';

describe('substitute config variables', () => {
  it('should replace $values with real values', () => {
    const configuration = {
      env: {
        cwd: '$projectPath',
        PORT: '$port',
      },
      create: ['npx', '$projectPath', '$projectStarter'],
    };

    expect(
      substituteConfigVariables(configuration, {
        $port: '3000',
        $projectPath: 'some/path/to/project',
        $projectStarter: 'https://github.com/gatsbyjs/gatsby-starter-default',
      })
    ).toMatchInlineSnapshot(`
Object {
  "create": Array [
    "npx",
    "some/path/to/project",
    "https://github.com/gatsbyjs/gatsby-starter-default",
  ],
  "env": Object {
    "PORT": "3000",
    "cwd": "some/path/to/project",
  },
}
`);
  });
});
