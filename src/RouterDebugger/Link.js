import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { recordLinkClicked } from './useHistoryActionStack';

export class Link extends React.Component {
  render() {
    const { onClick, ...props } = this.props;

    return (
      <ReactRouterLink
        {...props}
        onClick={(event) => {
          console.log('Link clicked:', this);
          recordLinkClicked(this);

          if (onClick) {
            onClick(event);
          }
        }}
      />
    )
  }
}