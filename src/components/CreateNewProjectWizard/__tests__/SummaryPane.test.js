import React from 'react';
import { shallow } from 'enzyme';

import SummaryPane from '../SummaryPane';
import projectTypes from '../../../config/project-types';

describe('SummaryPane component', () => {
  let wrapper;
  const steps = ['projectName', 'projectType', 'projectIcon', 'projectStarter'];

  steps.forEach(step =>
    it(`should render summary for ${step}`, () => {
      if (step === 'projectType') {
        wrapper = shallow(<SummaryPane currentStep={step} />);
        Object.keys(projectTypes).forEach(projectType => {
          wrapper = shallow(
            <SummaryPane currentStep={step} projectType={projectType} />
          );
          expect(wrapper).toMatchSnapshot();
        });
      } else {
        wrapper = shallow(<SummaryPane currentStep={step} />);
        expect(wrapper).toMatchSnapshot();
      }
    })
  );

  it('should throw an error if step not found', () => {
    expect(() =>
      shallow(<SummaryPane currentStep={'not-available'} />)
    ).toThrow();
  });
});
