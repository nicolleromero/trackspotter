import React from 'react';
import { FormControl, OverlayTrigger, Tooltip } from 'react-bootstrap'

export function NumSongs(props) {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="button-tooltip-2">Number of songs</Tooltip>}
    >
      {({ ref, ...triggerHandler }) => (
        <FormControl
          {...triggerHandler}
          ref={ref}
          type="number"
          min="10"
          max="50"
          step="5"
          value={props.numSongs}
          placeholder="20"
          onChange={(e) => props.onChange(e.target.value)}
          className="mr-sm-2 inline"
        />
      )}
    </OverlayTrigger>
  );
}
