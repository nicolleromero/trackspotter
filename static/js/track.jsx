const { Component, useState, useCallback } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;


// This component requires the following props: track, handleDeleteTrack
// Map over a list of track objects

function Track(props) {

  function millisToTime(milliseconds) {
    let minutes = Math.floor(milliseconds / 60000);
    let seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  // Order for search results should come from map func index
  let order = props.index + 1;

  // Or get order from playlist_tracks.track_order
  // let order = props.track.track_order

  // Handles the player
  let to_play = "https://open.spotify.com/embed/track/" + props.track.uid;

  return (
    <React.Fragment>
      {console.log(to_play)}
      <tr align="center" scope="row" key={props.track.track_id} value={props.track.track_id}>
        <td></td>
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
          <button
            className="btn btn-sm delete-button"
            onClick={() => props.handleDeleteTrack(props.track.uid)}
          >
            X
          </button>
        </td>
      </tr>
    </React.Fragment>
  );
}