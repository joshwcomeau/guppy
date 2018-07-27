import { generateRandomName } from './project-name.service'

describe('generateRandomName', () => {
  it('should capitalize the first letter of each word in the project name', () => {
    const projectName = generateRandomName()

    const tokens = projectName.split(' ')

    tokens.map(token => () => expect(token.charAt(0)).stringMatching(/[A-Z]/))
  })
})