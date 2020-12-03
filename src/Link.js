import React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
// import {notifyLinkClicked} from ...

export class Link extends React.Component {
  render() {
    const { onClick, ...props } = this.props;

    return (
      <ReactRouterLink
        {...props}
        onClick={(event) => {
          console.log('Link clicked:', this);

          if (onClick) {
            onClick(event);
          }
        }}
      />
    )
  }
}