// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { COLORS } from '../../constants';

import Paragraph from '../Paragraph';
import ExternalLink from '../ExternalLink';
import AlgoliaLogo from './AlgoliaLogo';

type Props = {};

class AddDependencyInitialScreen extends Component<Props> {
  render() {
    return (
      <EmptyState>
        <InstructionsParagraph>
          You can use the input above to search the Node Package Manager (NPM)
          registry for packages that have been published.
        </InstructionsParagraph>
        <InstructionsParagraph>
          Search by package name, description, keyword, or author.
        </InstructionsParagraph>
        <PoweredByWrapper>
          <ExternalLink href="https://www.algolia.com/?utm_source=guppy&amp;utm_medium=website&amp;utm_content=localhost&amp;utm_campaign=poweredby">
            <LinkText>
              <AlgoliaLogo />
            </LinkText>
          </ExternalLink>
        </PoweredByWrapper>
      </EmptyState>
    );
  }
}

export const InstructionsParagraph = Paragraph.extend`
  font-size: 1.4rem;
  color: ${COLORS.lightText};
`;

const EmptyState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 100px 40px;
  text-align: center;
`;

export const PoweredByWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 25px;
`;

const LinkText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${COLORS.lightText};
`;

export default AddDependencyInitialScreen;
