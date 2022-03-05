import React from 'react';

export function PlaylistHeader(props) {
  return (
    <React.Fragment>
      <thead id="playlist-thead">
        <tr className="align-center">
          <th className="col-mobile-badge">SEARCH TERMS</th>
          <th>PLAYLIST TITLE</th>
          <th className="d-none d-sm-table-cell">☆'s</th>
          <th>PLAY</th>
        </tr>
      </thead>
    </React.Fragment>
  );
}
