// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { u1F4C3 as billIcon } from 'react-icons-kit/noto_emoji_regular/u1F4C3';
import { x as xIcon } from 'react-icons-kit/feather/x';

import { RAW_COLORS } from '../../constants';

import ExternalLink from '../ExternalLink';
import Spacer from '../Spacer';

type Props = {
  license: ?string,
  withIcon?: boolean,
};

class License extends Component<Props> {
  render() {
    const { license, withIcon } = this.props;

    return (
      <Wrapper>
        {withIcon && (
          <Fragment>
            <IconWrapper color={license ? 'inherit' : RAW_COLORS.red[500]}>
              <IconBase icon={license ? billIcon : xIcon} size={24} />
            </IconWrapper>
            <Spacer size={6} />
          </Fragment>
        )}
        {license ? (
          <Fragment>
            <LicenseLink href={`https://opensource.org/licenses/${license}`}>
              {license}
            </LicenseLink>
            <Spacer size={3} />license
          </Fragment>
        ) : (
          'No license found'
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
`;

const IconWrapper = styled.span`
  display: block;
  height: 24px;
  color: ${props => props.color};
`;

const LicenseLink = styled(ExternalLink)`
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
`;

export default License;
