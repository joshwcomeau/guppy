// @flow
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { folderPlus } from 'react-icons-kit/feather/folderPlus';

import { COLORS, RAW_COLORS } from '../../constants';

import ImportProjectButton from '../ImportProjectButton';

type Props = {
  isOnboarding: boolean,
};

export const ImportExisting = ({ isOnboarding }: Props) => {
  if (isOnboarding) {
    // When the user is onboarding, there's a much more prominent prompt to
    // import existing projects, so we don't need this extra snippet.
    return null;
  }

  return (
    <Wrapper>
      <ImportProjectButton>
        <IconWrapper>
          <IconBase icon={folderPlus} size={18} />
        </IconWrapper>
      </ImportProjectButton>
      <MainText>
        Already have a project you'd like to manage with Guppy?{' '}
        <ImportProjectButton color={COLORS.textOnBackground}>
          Import it instead
        </ImportProjectButton>.
      </MainText>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  max-width: 350px;
`;
const IconWrapper = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgba(255, 255, 255, 0.75);
  border-radius: 50%;
  color: ${RAW_COLORS.transparentWhite[300]};
`;

const MainText = styled.div`
  flex: 1;
  text-align: left;
  margin-left: 10px;
  color: ${RAW_COLORS.transparentWhite[300]};
`;

const mapStateToProps = state => ({
  isOnboarding: state.onboardingStatus !== 'done',
});

export default connect(mapStateToProps)(ImportExisting);
