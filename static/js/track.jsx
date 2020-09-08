const { Component, useState, useCallback } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;


// Map over a list of track objects

function Track(props) {

  function millisToTime(milliseconds) {
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  // Order for search results should come from map func index
  let order = props.index + 1;


  // Handles the player
  let to_play = "https://open.spotify.com/embed/track/" + props.track.uid;
  console.log(to_play)

  let editable = (USER != null && props.playlistUser === USER.user_id);

  return (
    <React.Fragment>
      <td>
        <span className="material-icons">
          <img
            className="dragger"
            src="/static/img/baseline_drag_indicator_black_18dp.png"
            width="30"
            height="30"
          >

          </img>
        </span>
      </td>
      <td>{order}</td>
      <td>{props.track.title}</td>
      <td>{props.track.artist}</td>
      <td>{props.track.album}</td>
      <td>{millisToTime(props.track.playtime)}</td>
      {/* <td>
          <img src={props.track.album_art}></img>
        </td> */}
      <td>
        <iframe
          src={to_play}
          width="80"
          height="80"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
        >
        </iframe>
      </td>
      <td>
        {editable && (
          <button
            className="btn btn-sm delete-button"
            onClick={() => props.onDeleteTrack(props.track.track_id)}
          >
            X
          </button>
        )}
      </td>
    </React.Fragment>
  );
}