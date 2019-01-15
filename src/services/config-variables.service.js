// @flow

// Mapping type for config template variables '$port'
export type VariableMap = {
  $port?: string,
  $projectPath?: string,
  $projectStarter?: ?string,
};

// We're using "template" variables inside the project type configuration file (config/project-types.js)
// so with the following function we can replace the string $port with the real port number e.g. 3000
// (see type VariableMap for used mapping strings)
export const substituteConfigVariables = (
  configObject: Object,
  variableMap: VariableMap
) => {
  // e.g. $port inside args will be replaced with variable reference from variabeMap obj. {$port: port}
  return Object.keys(configObject).reduce(
    (config: any, key) => {
      if (config[key] instanceof Array) {
        // replace $port inside args array
        // empty string is special here - we'd like to us it as replacement
        config[key] = config[key].map(
          arg => (variableMap[arg] === '' ? '' : variableMap[arg] || arg)
        );
      } else {
        // check config[key] e.g. is {env: { PORT: '$port'} }
        if (config[key] instanceof Object) {
          // config[key] = {PORT: '$port'}, key = 'env'
          config[key] = Object.keys(config[key]).reduce(
            (newObj, nestedKey) => {
              // use replacement value if available
              newObj[nestedKey] =
                variableMap[newObj[nestedKey]] === ''
                  ? ''
                  : variableMap[newObj[nestedKey]] || newObj[nestedKey];
              return newObj;
            },
            { ...config[key] }
          );
        }
      }
      // todo: add top level substitution - not used yet but maybe needed later e.g. { env: $port } won't be replaced.
      //       Bad example but just to have it as reminder.
      return config;
    },
    { ...configObject }
  );
};
