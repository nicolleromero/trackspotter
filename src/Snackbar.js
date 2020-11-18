import React from 'react';

export function Snackbar(props) {
  return (
    <div className={props.snackbar ? ["snackbar", "show"].join(" ") : "snackbar"}>
      {props.message}
    </div>
  )
}
