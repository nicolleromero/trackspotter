import React from 'react';

function millisToTime(milliseconds) {
  let minutes = Math.floor(milliseconds / 60000);
  let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export function Track(props) {
  // Order for search results should come from map func index
  let order = props.index + 1;

  // Handles the player
  let toPlay = "https://open.spotify.com/embed/track/" + props.track.uid;

  return (
    <React.Fragment>
      <td className="col-mobile">
        {props.editable && (
          <span className="material-icons">
            <img
              className="dragger"
              src="/static/img/baseline_drag_indicator_black_18dp.png"
              width="30"
              height="30"
            >
            </img>
          </span>
        )}
      </td>
      <td className="d-none d-sm-table-cell">{order}</td>
      <td className="col-mobile-badge">{props.track.title}</td>
      <td>{props.track.artist}</td>
      <td className="d-none d-sm-table-cell">{props.track.album}</td>
      <td className="d-none d-sm-table-cell">{millisToTime(props.track.playtime)}</td>
      {/* <td>
          <img src={props.track.album_art}></img>
        </td> */}
      <td className="col-mobile">
        <iframe
          src={toPlay}
          width="80"
          height="80"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
        >
        </iframe>
      </td>
      <td className="col-mobile">
        {props.editable && (
          <button
            className="btn btn-sm delete-button"
            onClick={() => props.onDeleteTrack(props.track.track_id)}
          >
            ×
          </button>
        )}
      </td>
    </React.Fragment>
  );
}