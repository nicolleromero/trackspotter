import React from 'react';

export function TracksHeader(props) {
  return (
    <thead id="playlist-thead">
      <tr align="center">
        <th className="col-mobile">   </th>
        <th className="d-none d-sm-table-cell">TRACK</th>
        <th className="col-mobile-badge">TITLE</th>
        <th>ARTIST</th>
        <th className="d-none d-sm-table-cell">ALBUM</th>
        <th className="d-none d-sm-table-cell">PLAYTIME</th>
        <th className="col-mobile">PLAY</th>
        <th className="col-mobile">
          {props.editable && (
            <span><i className="fa fa-trash-o"></i></span>
          )}</th>
      </tr>
    </thead>
  );
}
