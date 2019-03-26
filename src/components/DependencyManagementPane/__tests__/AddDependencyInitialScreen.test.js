import React from 'react';
import { mount } from 'enzyme';

import AddDependencyInitialScreen, {
  InstructionsParagraph,
  PoweredByWrapper,
} from '../AddDependencyInitialScreen';

jest.mock('../AlgoliaLogo', () => 'svg');

describe('AddDependencyInitialScreen component', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<AddDependencyInitialScreen />);
  });

  it('should render instruction paragraphs', () => {
    expect(wrapper.find(InstructionsParagraph)).toMatchSnapshot();
  });

  it('should render powered by Algolia link', () => {
    expect(wrapper.find(PoweredByWrapper)).toMatchSnapshot();
  });
});
