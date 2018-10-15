// @flow
import React from 'react';
import { connectHighlight } from 'react-instantsearch/connectors';

import { safeEscapeString } from '../../utils';

type Props = any;

// A CustomHighlight component to use with react-instantsearch
// to ensure elements are properly unescaped and spaced on output
const CustomHighlight = ({
  highlight,
  attribute,
  hit,
  highlightProperty,
}: Props) => {
  const highlights = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit,
  });

  return highlights.map((part, i) => {
    // Run the DOMParser on each of the parts of text
    const unescaped = safeEscapeString(part.value);

    // If the text is highlighted, wrap in <mark> for the highlight
    // Otherwise just render the part in a <span>
    return part.isHighlighted ? (
      <mark key={i} className="ais-Highlight-highlighted">
        {unescaped}
      </mark>
    ) : (
      <span key={i}>{unescaped}</span>
    );
  });
};

export default connectHighlight(CustomHighlight);
