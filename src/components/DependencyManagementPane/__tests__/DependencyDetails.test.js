import React from 'react';
import { shallow } from 'enzyme';
import lolex from 'lolex';

import DependencyDetails from '../DependencyDetails';
import { mockReactHit } from '../__mocks__/dependency';

describe('DependencyDetails component', () => {
  lolex.install();

  const projectId = 'a-project';
  const wrapper = shallow(
    <DependencyDetails projectId={projectId} dependency={mockReactHit} />
  );

  it('should render', () => {
    expect(
      wrapper.renderProp('children')({
        name: mockReactHit.name,
        latestVersion: '16.8.0',
        lastUpdatedAt: Date.now(),
        isLoading: false,
      })
    ).toMatchSnapshot();
  });
});
