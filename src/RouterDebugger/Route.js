import React from 'react';
import { Route as ReactRouterRoute } from 'react-router-dom';
// import {notifyLinkClicked} from ...

export class Route extends React.Component {
  render() {
    const { onChange, ...props } = this.props;

    return (
      <ReactRouterRoute
        {...props}
        onChange={(event) => {
          console.log('Route changed:', this);

          if (onChange) {
            onChange(event);
          }
        }}
      />
    )
  }
}