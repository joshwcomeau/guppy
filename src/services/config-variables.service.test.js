/* eslint-disable flowtype/require-valid-file-annotation */
import { substituteConfigVariables } from './config-variables.service';

describe('substitute config variables', () => {
  it('should replace $values with real values', () => {
    const configuration = {
      env: { cwd: '$projectPath', PORT: '$port' },
      create: ['npx', '$projectPath', '$projectStarter'],
    };

    // Flow error here & not sure why.
    // It complains about missing property toMatchInlineSnapshot with 6 or cases.
    // It error message starts like:
    // Cannot call `expect(...).toMatchInlineSnapshot` because:
    // - Either property`toMatchInlineSnapshot` is missing in `JestExpectType`[1].
    // - Or property `toMatchInlineSnapshot` is missing in `JestPromiseType` [2].
    // - ...
    // $FlowFixMe
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
