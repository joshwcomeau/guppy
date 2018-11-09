// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { check } from 'react-icons-kit/feather/check';

import Spinner from '../Spinner';
import { COLORS } from '../../constants';
import FadeIn from '../FadeIn';

type Status = 'upcoming' | 'in-progress' | 'done';

type Props = {
  step: any,
  status: Status,
};

type State = {
  shouldShowAdditionalCopy: boolean,
};

class BuildStepProgress extends PureComponent<Props, State> {
  timeoutId: number;

  state = {
    shouldShowAdditionalCopy: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.status === 'done') {
      this.setState({ shouldShowAdditionalCopy: false });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.status !== 'in-progress' &&
      this.props.status === 'in-progress'
    ) {
      this.timeoutId = window.setTimeout(this.triggerAdditionalCopy, 5000);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeoutId);
  }

  triggerAdditionalCopy = () => {
    this.setState({ shouldShowAdditionalCopy: true });
  };

  render() {
    const { step, status } = this.props;
    const { shouldShowAdditionalCopy } = this.state;
    return (
      <Wrapper isUpcoming={status === 'upcoming'}>
        <IconWrapper>
          {status === 'in-progress' && <Spinner size={20} />}
          {status === 'done' && <Checkmark size={32} icon={check} />}
        </IconWrapper>
        <ChildWrapper>
          <MainCopy>{step.copy}</MainCopy>
          {step.additionalCopy &&
            shouldShowAdditionalCopy && (
              <FadeIn>
                <AdditionalCopy>{step.additionalCopy}</AdditionalCopy>
              </FadeIn>
            )}
        </ChildWrapper>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 18px;
  opacity: ${props => (props.isUpcoming ? 0.5 : 1)};
  will-change: opacity;
  transition: opacity 800ms;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  margin-right: 10px;
`;

const ChildWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const Checkmark = styled(IconBase)`
  color: ${COLORS.lightSuccess};
`;

const MainCopy = styled.div`
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  font-size: 18px;
`;

const AdditionalCopy = styled.div`
  position: absolute;
  top: 110%;
  font-size: 14px;
`;

export default BuildStepProgress;
