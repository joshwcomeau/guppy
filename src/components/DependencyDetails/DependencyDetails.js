// @flow
import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import Heading from '../Heading';
import Spacer from '../Spacer';
import Label from '../Label';
import Button from '../Button';
import PixelShifter from '../PixelShifter';
import BigClickableButton from '../BigClickableButton';
import DependencyDetailsTable from '../DependencyDetailsTable';

import type { Dependency } from '../../types';

type Props = {
  projectId: string,
  dependency: Dependency,
};

class DependencyDetails extends PureComponent<Props> {
  render() {
    const { projectId, dependency } = this.props;

    const tags =
      dependency.keywords &&
      dependency.keywords.map(keyword => <Tag key={keyword}>{keyword}</Tag>);

    return (
      <Fragment>
        <Header>
          <PixelShifter y={-4}>
            <HeaderText>
              <Name size="small">{dependency.name}</Name>
              <Description>{dependency.description}</Description>
            </HeaderText>
          </PixelShifter>
        </Header>

        <VersionsWrapper>
          <Col>
            <VersionLabel>Installed Version</VersionLabel>
            <VersionNum>16.4.0</VersionNum>
          </Col>

          <Col>
            <VersionLabel>Latest Version</VersionLabel>
            <VersionNum>16.4.1</VersionNum>
          </Col>

          <Col>
            <Button
              size="small"
              type="fill"
              color1={COLORS.green[700]}
              color2={COLORS.lightGreen[500]}
            >
              Update
            </Button>
          </Col>
        </VersionsWrapper>

        <MainContent>
          <DependencyDetailsTable
            projectId={projectId}
            dependency={dependency}
          />
        </MainContent>
      </Fragment>
    );
  }
}

const Header = styled.header`
  position: relative;
  background-image: linear-gradient(
    45deg,
    ${COLORS.blue[700]},
    ${COLORS.violet[700]}
  );
  border-radius: 8px 8px 0 0;
  color: ${COLORS.white};
`;

const HeaderText = styled.div`
  padding: 15px;
`;

const Svg = styled.svg`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  overflow: visible;
`;

const Name = styled(Heading)`
  color: ${COLORS.white};
`;

const Description = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: ${COLORS.gray[300]};
  -webkit-font-smoothing: antialiased;
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 15px;
  background: ${COLORS.gray[700]};
  color: ${COLORS.white};
`;

const VersionsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 15px;
  background: ${COLORS.gray[100]};
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const Col = styled.div`
  width: 150px;
  text-align: center;
`;

const VersionLabel = styled(Label)`
  color: ${COLORS.gray[600]};
`;

const VersionNum = styled.div`
  margin-top: 3px;
  font-size: 22px;
  font-weight: 600;
  -webkit-font-smoothing: antialiased;
  line-height: 22px;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const Action = styled(Button)`
  width: 130px;
`;

const MainContent = styled.div`
  padding: 15px;
`;

export default DependencyDetails;
